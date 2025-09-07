import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { cors } from 'hono/cors';
import { googleRouter } from './routers/oauth/google';

const app = new Hono({ strict: true });
app.use(trimTrailingSlash());
app.use('*', cors());

app.route('/oauth/google', googleRouter);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/download/apk', (c) => {
  return c.redirect('https://google.co.jp');
});

export default app;
