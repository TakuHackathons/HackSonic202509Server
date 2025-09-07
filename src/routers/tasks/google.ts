import { Hono, Context } from 'hono';
import crypto from 'crypto';

const googleTasksRouter = new Hono();

googleTasksRouter.get('/', (c) => {
  return c.json({ hello: 'tasks google Router' });
});

googleTasksRouter.get('/usercheck', (c) => {
  const newUuid = crypto.randomUUID();
  return c.json({ userId: newUuid });
});

export { googleTasksRouter };
