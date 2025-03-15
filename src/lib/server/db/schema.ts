import { relations, sql } from 'drizzle-orm'
import { boolean, foreignKey, integer, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

export const ReleaseType = pgEnum('ReleaseType', ['SINGLE', 'EP', 'LP', 'COMPILATION', 'MIXTAPE'])

export const User = pgTable('User', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	image: text('image').notNull(),
	username: text('username'),
	email: text('email').notNull().unique(),
	emailVerified: timestamp('emailVerified', { precision: 3 }),
	walletAddress: text('walletAddress').unique(),
	bio: text('bio'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const Account = pgTable('Account', {
	userId: text('userId').notNull(),
	type: text('type').notNull(),
	provider: text('provider').notNull(),
	providerAccountId: text('providerAccountId').notNull(),
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expires_at: integer('expires_at'),
	token_type: text('token_type'),
	scope: text('scope'),
	id_token: text('id_token'),
	session_state: text('session_state'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (Account) => ({
	'Account_user_fkey': foreignKey({
		name: 'Account_user_fkey',
		columns: [Account.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'Account_cpk': primaryKey({
		name: 'Account_cpk',
		columns: [Account.provider, Account.providerAccountId]
	})
}));

export const Playlist = pgTable('Playlist', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	name: text('name').notNull(),
	description: text('description'),
	isPublic: boolean('isPublic').notNull().default(true),
	coverUrl: text('coverUrl'),
	userId: text('userId').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (Playlist) => ({
	'Playlist_user_fkey': foreignKey({
		name: 'Playlist_user_fkey',
		columns: [Playlist.userId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const PlaylistTrack = pgTable('PlaylistTrack', {
	playlistId: text('playlistId').notNull(),
	trackId: text('trackId').notNull(),
	position: integer('position').notNull(),
	addedAt: timestamp('addedAt', { precision: 3 }).notNull().defaultNow()
}, (PlaylistTrack) => ({
	'PlaylistTrack_Playlist_fkey': foreignKey({
		name: 'PlaylistTrack_Playlist_fkey',
		columns: [PlaylistTrack.playlistId],
		foreignColumns: [Playlist.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'PlaylistTrack_Track_fkey': foreignKey({
		name: 'PlaylistTrack_Track_fkey',
		columns: [PlaylistTrack.trackId],
		foreignColumns: [Track.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'PlaylistTrack_cpk': primaryKey({
		name: 'PlaylistTrack_cpk',
		columns: [PlaylistTrack.playlistId, PlaylistTrack.trackId]
	})
}));

export const Release = pgTable('Release', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	title: text('title').notNull(),
	type: ReleaseType('type').notNull(),
	genre: text('genre'),
	description: text('description'),
	artistId: text('artistId').notNull(),
	coverUrl: text('coverUrl'),
	releaseDate: timestamp('releaseDate', { precision: 3 }).notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
}, (Release) => ({
	'Release_Artist_fkey': foreignKey({
		name: 'Release_Artist_fkey',
		columns: [Release.artistId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const Track = pgTable('Track', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	title: text('title').notNull(),
	artistId: text('artistId').notNull(),
	genre: text('genre'),
	mimeType: text('mimeType'),
	fileSize: integer('fileSize'),
	duration: integer('duration'),
	uploadedAt: timestamp('uploadedAt', { precision: 3 }).notNull().defaultNow(),
	suiId: text('suiId').unique(),
	streamCount: integer('streamCount').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull(),
	releaseId: text('releaseId').notNull(),
	trackNumber: integer('trackNumber').notNull(),
	blobName: text('blobName')
}, (Track) => ({
	'Track_artist_fkey': foreignKey({
		name: 'Track_artist_fkey',
		columns: [Track.artistId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'Track_Release_fkey': foreignKey({
		name: 'Track_Release_fkey',
		columns: [Track.releaseId],
		foreignColumns: [Release.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const likedTracks = pgTable('_likedTracks', {
	UserId: text('A').notNull(),
	TrackId: text('B').notNull()
}, (likedTracks) => ({
	'_likedTracks_User_fkey': foreignKey({
		name: '_likedTracks_User_fkey',
		columns: [likedTracks.UserId],
		foreignColumns: [User.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade'),
	'_likedTracks_Track_fkey': foreignKey({
		name: '_likedTracks_Track_fkey',
		columns: [likedTracks.TrackId],
		foreignColumns: [Track.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const UserRelations = relations(User, ({ many }) => ({
	accounts: many(Account, {
		relationName: 'AccountToUser'
	}),
	playlists: many(Playlist, {
		relationName: 'PlaylistToUser'
	}),
	Release: many(Release, {
		relationName: 'ReleaseToUser'
	}),
	releasedTracks: many(Track, {
		relationName: 'releasedTracks'
	}),
	likedTracks: many(TrackToUser, {
		relationName: 'UserToTrackToUser'
	})
}));

export const AccountRelations = relations(Account, ({ one }) => ({
	user: one(User, {
		relationName: 'AccountToUser',
		fields: [Account.userId],
		references: [User.id]
	})
}));

export const PlaylistRelations = relations(Playlist, ({ one, many }) => ({
	user: one(User, {
		relationName: 'PlaylistToUser',
		fields: [Playlist.userId],
		references: [User.id]
	}),
	PlaylistTrack: many(PlaylistTrack, {
		relationName: 'PlaylistToPlaylistTrack'
	})
}));

export const PlaylistTrackRelations = relations(PlaylistTrack, ({ one }) => ({
	Playlist: one(Playlist, {
		relationName: 'PlaylistToPlaylistTrack',
		fields: [PlaylistTrack.playlistId],
		references: [Playlist.id]
	}),
	Track: one(Track, {
		relationName: 'PlaylistTrackToTrack',
		fields: [PlaylistTrack.trackId],
		references: [Track.id]
	})
}));

export const ReleaseRelations = relations(Release, ({ one, many }) => ({
	Artist: one(User, {
		relationName: 'ReleaseToUser',
		fields: [Release.artistId],
		references: [User.id]
	}),
	Track: many(Track, {
		relationName: 'ReleaseToTrack'
	})
}));

export const TrackRelations = relations(Track, ({ many, one }) => ({
	PlaylistTrack: many(PlaylistTrack, {
		relationName: 'PlaylistTrackToTrack'
	}),
	artist: one(User, {
		relationName: 'releasedTracks',
		fields: [Track.artistId],
		references: [User.id]
	}),
	Release: one(Release, {
		relationName: 'ReleaseToTrack',
		fields: [Track.releaseId],
		references: [Release.id]
	}),
	usersWhoLike: many(TrackToUser, {
		relationName: 'TrackToTrackToUser'
	})
}));

export const likedTracksRelations = relations(likedTracks, ({ one }) => ({
	User: one(User, {
		relationName: 'UserToTrackToUser',
		fields: [likedTracks.UserId],
		references: [User.id]
	}),
	Track: one(Track, {
		relationName: 'TrackToTrackToUser',
		fields: [likedTracks.TrackId],
		references: [Track.id]
	})
}));