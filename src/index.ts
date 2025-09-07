import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { cors } from 'hono/cors';
import { oauthGoogleRouter } from './routers/oauth/google';
import { googleTasksRouter } from './routers/tasks/google';

const app = new Hono({ strict: true });
app.use(trimTrailingSlash());
app.use('*', cors());

app.route('/oauth/google', oauthGoogleRouter);
app.route('/tasks/google', googleTasksRouter);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/download/apk', (c) => {
  return c.redirect('https://pub-c6f0350ad3f742868c0442195330a327.r2.dev/ClimbIngPig.apk');
});

export default app;
