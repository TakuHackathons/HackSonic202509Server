import { Hono, Context } from 'hono';
import { env } from 'hono/adapter';
import crypto from 'crypto';
import { getOAuth2Client } from '../../utils/google-oauth2-client';

const oauthGoogleRouter = new Hono();

oauthGoogleRouter.get('/', (c) => {
  return c.json({ hello: 'oauth google Router' });
});

oauthGoogleRouter.get('/error', (c) => {
  return c.text('OAuth Failed.');
});

oauthGoogleRouter.get('/usercheck', (c) => {
  const newUuid = crypto.randomUUID();
  return c.json({ userId: newUuid });
});

oauthGoogleRouter.get('/auth', (c) => {
  const oauth2Client = getOAuth2Client(c);
  const oauthClientAuthUrlOptions: GenerateAuthUrlOpts = {
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/tasks.readonly'],
  };
  return c.redirect(oauth2Client.generateAuthUrl(oauthClientAuthUrlOptions));
});

oauthGoogleRouter.get('/callback', async (c) => {
  const oauth2Client = getOAuth2Client(c);
  const authCode = c.req.query('code');
  if (authCode) {
    const results = await oauth2Client.getToken(authCode);
    return c.json(results);
  } else {
    return c.redirect('/oauth/google/error');
  }
});

export { oauthGoogleRouter };
