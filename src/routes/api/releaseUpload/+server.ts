//TODO: try catch within separate functions, use sveltekit error in POST
import { db } from '$lib/server/db';
import { Release, Track } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SASProtocol, BlobServiceClient, BlobSASPermissions } from '@azure/storage-blob';
import {
	SUI_ADMIN_KEY,
	CONTAINER_NAME,
	AZ_STORAGE_CN_KEY,
	AZ_STORAGE_ACC_NAME
} from '$env/static/private';
import type { TrackData } from '../../upload/+page.server.js';
import { eq } from 'drizzle-orm/mysql-core/expressions';

type TrackCreatedEvent = {
	artist_address: string;
	title: string;
	track_number: number;
	track_id: string;
};

// consts to load during server start
// Sui
const SUI_CLIENT = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });
const FLOWR_PACKAGE_ID = '0x7a30f5a19c2975790bc9cd50d004e6d7b2c0c2f4a622f1484ffddd7dbb86e5b3';
const ADMIN_KEYPAIR = Ed25519Keypair.deriveKeypair(SUI_ADMIN_KEY);
// Azure
const blobServiceClient = BlobServiceClient.fromConnectionString(AZ_STORAGE_CN_KEY);
const CONTAINER_CLIENT = blobServiceClient.getContainerClient(CONTAINER_NAME);

export async function POST({ request }) {
	const {
		releaseTitle,
		releaseType,
		releaseGenre,
		releaseDescription,
		releaseDate,
		tracks,
		coverMimeType
	} = await request.json();
	// validation
	if (!releaseTitle || !releaseDate || !tracks || !releaseType || !coverMimeType) {
		error(400, 'data in request is missing or invalid');
	}
	const typedReleaseDate = new Date(releaseDate);
	// TODO: replace this with var user id
	const artistId = 'testUserId';

	// 1. first create Release in db
	const [newRelease] = await db
		.insert(Release)
		.values({
			title: releaseTitle,
			type: releaseType,
			artistId: artistId,
			releaseDate: typedReleaseDate,
			genre: releaseGenre,
			description: releaseDescription,
			updatedAt: new Date()
		})
		.returning();
	if (!newRelease.id) {
		error(500, 'error when creating Release, has no id field');
	}

	//TODO: art cover URL, get rid of hard coding on name and address
	const coverBlobUrl = `https://${AZ_STORAGE_ACC_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${artistId}/releases/${newRelease.id}/cover`;
	// 2. update db
	await db.update(Release).set({ coverUrl: coverBlobUrl }).where(eq(Release.id, newRelease.id));

	// 3. now create sui objects
	const dateString = typedReleaseDate.toDateString();
	const artistName = 'test name';
	const artistAddress = '0x0';
	const { suiDigest } = await suiCreateTracks(
		releaseType,
		releaseTitle,
		dateString,
		releaseGenre,
		artistName,
		artistAddress,
		tracks,
		coverBlobUrl
	);

	// 3. create signed URLs

	const coverUploadUrl = await generateTrackUploadUrls(
		artistId,
		newRelease.id,
		tracks,
		coverMimeType
	);
	// 4. create tracks in db
	const trackValues = tracks.map((track: TrackData) => ({
		title: track.title,
		artistId: artistId,
		releaseId: newRelease.id,
		trackNumber: track.number,
		genre: releaseGenre,
		mimeType: track.mimeType,
		suiId: track.suiId,
		blobName: track.blobName,
		updatedAt: new Date()
	}));

	// Bulk insert :)
	await db.insert(Track).values(trackValues);

	return json({ ok: true, status: 201, suiDigest, tracks, coverUploadUrl });
}
// TODO: cover url
// function to create sui object for each track
async function suiCreateTracks(
	releaseType: string,
	releaseTitle: string,
	releaseDate: string,
	genre: string,
	artistName: string,
	artistAddress: string,
	tracks: TrackData[],
	coverUrl: string
): Promise<{ suiDigest: string }> {
	const tx = new Transaction();
	tracks.map((track) => {
		tx.moveCall({
			package: FLOWR_PACKAGE_ID,
			module: 'track',
			function: 'create_track',
			arguments: [
				tx.pure.string(releaseType),
				tx.pure.string(releaseTitle),
				tx.pure.u8(track.number),
				tx.pure.string(track.title),
				tx.pure.string(artistName),
				tx.pure.address(artistAddress),
				tx.pure.string(genre),
				tx.pure.string(releaseDate),
				tx.pure.string(coverUrl)
			]
		});
	});
	// admin sends the tx and pays
	tx.setSender(ADMIN_KEYPAIR.toSuiAddress());
	const txBytes = await tx.build({ client: SUI_CLIENT });
	const signature = (await ADMIN_KEYPAIR.signTransaction(txBytes)).signature;
	const response = await SUI_CLIENT.executeTransactionBlock({
		transactionBlock: txBytes,
		signature,
		options: {
			showEvents: true,
			showObjectChanges: true
		}
	});

	if (!response.events) {
		throw new Error('No events returned from transaction');
	}
	// insert ids into tracks
	response.events.map((event) => {
		if (event.type === `${FLOWR_PACKAGE_ID}::track::TrackCreated`) {
			const eventData = event.parsedJson as TrackCreatedEvent;
			const thisId = eventData.track_id;
			const thisNumber = eventData.track_number;
			const matchingTrack = tracks.find((track) => track.number === thisNumber);
			if (matchingTrack) {
				matchingTrack.suiId = thisId;
			} else {
				error(500, `could not find match sui object data for track #${thisNumber}`);
			}
		}
	});
	const suiDigest = response.digest;
	return { suiDigest };
}

// Function to generate SAS URLs for tracks in parallel
async function generateTrackUploadUrls(
	userId: string,
	releaseId: string,
	tracks: TrackData[],
	coverMimeType: string
) {
	// config

	// TODO: Create an array of promises for each track instead of awaits
	tracks.map(async (track) => {
		const blobName = `${userId}/releases/${releaseId}/tracks/${track.number}-${track.fileName}`;
		const blobClient = CONTAINER_CLIENT.getBlobClient(blobName);
		const permissions = new BlobSASPermissions();
		permissions.create = true;
		permissions.write = true;

		const sasUrl = await blobClient.generateSasUrl({
			permissions: permissions,
			expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // active for 15 minutes
			contentType: track.mimeType,
			protocol: SASProtocol.Https
		});

		// Update the track properties in place
		track.uploadUrl = sasUrl;
		track.blobName = blobName;
	});

	// create 1 special url for the cover
	const blobName = `${userId}/releases/${releaseId}/cover`;
	const blobClient = CONTAINER_CLIENT.getBlobClient(blobName);
	const permissions = new BlobSASPermissions();
	permissions.create = true;
	permissions.write = true;
	const coverUploadUrl = await blobClient.generateSasUrl({
		permissions: permissions,
		expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000), // active for 15 minutes
		contentType: coverMimeType,
		protocol: SASProtocol.Https
	});
	return { coverUploadUrl };
	// Wait for all promises to complete
}
