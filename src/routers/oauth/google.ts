import { Hono, Context } from 'hono';
import { env } from 'hono/adapter';
import crypto from 'crypto';
import { GenerateAuthUrlOpts, OAuth2ClientOptions, OAuth2Client, Credentials } from 'google-auth-library';

const googleRouter = new Hono();

googleRouter.get('/', (c) => {
  return c.json({ hello: 'oauth google Router' });
});

googleRouter.get('/error', (c) => {
  return c.text('OAuth Failed.');
});

googleRouter.get('/usercheck', (c) => {
  const newUuid = crypto.randomUUID();
  return c.json({ userId: newUuid });
});

googleRouter.get('/auth', (c) => {
  const oauth2Client = getOAuth2Client(c);
  const oauthClientAuthUrlOptions: GenerateAuthUrlOpts = {
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/tasks.readonly'],
  };
  return c.redirect(oauth2Client.generateAuthUrl(oauthClientAuthUrlOptions));
});

googleRouter.get('/callback', async (c) => {
  const oauth2Client = getOAuth2Client(c);
  const authCode = c.req.query('code');
  if (authCode) {
    const results = await oauth2Client.getToken(authCode);
    return c.json(results);
  } else {
    return c.redirect('/oauth/google/error');
  }
});

function getOAuth2Client(context: Context): OAuth2Client {
  const envConfigs = env(context);
  const currentUrl = new URL(context.req.url);
  currentUrl.pathname = `/oauth/google/callback`;
  currentUrl.search = '';
  const globalOauth2ClientSettings: OAuth2ClientOptions = {
    clientId: envConfigs.GOOGLE_API_OAUTH2_CLIENT_ID?.toString(),
    clientSecret: envConfigs.GOOGLE_API_OAUTH2_CLIENT_SECRET?.toString(),
    redirectUri: currentUrl.toString(),
  };
  const oauth2Client = new OAuth2Client(globalOauth2ClientSettings);
  return oauth2Client;
}

export { googleRouter };
