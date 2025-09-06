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

export default app;
