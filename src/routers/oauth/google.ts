import { Hono, Context } from 'hono';
import { env } from 'hono/adapter';

const googleRouter = new Hono();

googleRouter.get('/', (c) => {
  return c.json({ hello: 'oauth google Router' });
});

export { googleRouter };
