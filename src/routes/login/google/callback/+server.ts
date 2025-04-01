import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';
import { google } from '$lib/server/auth';
import { decodeIdToken } from 'arctic';
import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { db } from '$lib/server/db';
import { Account, User } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

async function getUserFromGoogleId(googleUserId: string) {
	// Find the Account linked to this Google ID
	const accounts = await db
		.select()
		.from(Account)
		.where(and(eq(Account.provider, 'google'), eq(Account.providerAccountId, googleUserId)));

	if (accounts.length === 0) {
		return null;
	}

	const account = accounts[0];

	// Get the associated user
	const users = await db.select().from(User).where(eq(User.id, account.userId));

	return users.length > 0 ? users[0] : null;
}

// Function to create a new user and Google account
async function createUser(googleUserId: string, name: string, email?: string, picture?: string) {
	// Create a new user
	const [user] = await db
		.insert(User)
		.values({
			name: name || 'Google User',
			image: picture || '', // Use profile image from Google if available
			email: email || `google_${googleUserId}@placeholder.com`, // Fallback if email not provided
			updatedAt: new Date()
		})
		.returning();

	// Create an account record linking the user to their Google identity
	await db.insert(Account).values({
		userId: user.id,
		type: 'oauth',
		provider: 'google',
		providerAccountId: googleUserId,
		updatedAt: new Date()
	});

	return user;
}

export async function GET(event: RequestEvent): Promise<Response> {
	try {
		// Extract the state and code from the callback URL
		const code = event.url.searchParams.get('code');
		const state = event.url.searchParams.get('state');

		if (!code || !state) {
			return new Response('Missing code or state parameter', { status: 400 });
		}

		// Verify the state parameter (anti-forgery)
		// You should implement state verification here if you're using it for CSRF protection

		// Exchange the authorization code for tokens
		const tokens: OAuth2Tokens = await google.validateAuthorizationCode(code, null);

		// The ID token contains the user information
		if (!tokens.idToken) {
			return new Response('No ID token received from Google', { status: 400 });
		}

		// Decode the ID token to get user information
		const idToken = decodeIdToken(tokens.idToken());

		if (!idToken.sub) {
			return new Response('Invalid ID token', { status: 400 });
		}

		const googleUserId = idToken.sub;
		const name = idToken.name || '';
		const email = idToken.email || undefined;
		const picture = idToken.picture || undefined;

		// Check if user exists in our database
		const existingUser = await getUserFromGoogleId(googleUserId);

		if (existingUser !== null) {
			// User exists, create a new session
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, existingUser.id);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);

			// Redirect to home page or another destination
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/'
				}
			});
		}

		// User doesn't exist, create a new one
		const user = await createUser(googleUserId, name, email, picture);

		// Create a session for the new user
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// Redirect to home page or onboarding
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (error) {
		console.error('Error in Google callback:', error);
		return new Response(
			`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
			{
				status: 500
			}
		);
	}
}
