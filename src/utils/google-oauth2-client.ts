import { Context } from 'hono';
import { env } from 'hono/adapter';
import { OAuth2ClientOptions, OAuth2Client } from 'google-auth-library';

export function getOAuth2Client(context: Context): OAuth2Client {
  const oauth2Client = new OAuth2Client(getOauth2ClientSettings(context));
  return oauth2Client;
}

export function getOauth2ClientSettings(context: Context): OAuth2ClientOptions {
  const envConfigs = env(context);
  const currentUrl = new URL(context.req.url);
  currentUrl.pathname = `/oauth/google/callback`;
  currentUrl.search = '';
  const globalOauth2ClientSettings: OAuth2ClientOptions = {
    clientId: envConfigs.GOOGLE_API_OAUTH2_CLIENT_ID?.toString(),
    clientSecret: envConfigs.GOOGLE_API_OAUTH2_CLIENT_SECRET?.toString(),
    redirectUri: currentUrl.toString(),
  };
  return globalOauth2ClientSettings;
}
