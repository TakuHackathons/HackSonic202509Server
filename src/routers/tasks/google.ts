import { Hono, Context } from 'hono';
import crypto from 'crypto';
import { getOauth2ClientSettings } from '../../utils/google-oauth2-client';
import { google } from 'googleapis';

const googleTasksRouter = new Hono();

googleTasksRouter.get('/', (c) => {
  return c.json({ hello: 'tasks google Router' });
});

googleTasksRouter.get('/list', async (c) => {
  // Show: https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/list
  const oauth2Client = new google.auth.OAuth2(getOauth2ClientSettings(c));
  oauth2Client.setCredentials({
    refresh_token: 'refresh_token',
  });
  const service = google.tasks({ version: 'v1', auth: oauth2Client });
  const tasklistResponses = await service.tasklists.list();
  const allTasks = [];
  for (const taskListItem of tasklistResponses.data.items || []) {
    const taskResponse = await service.tasks.list({ tasklist: taskListItem.id?.toString(), showCompleted: false, maxResults: 100 });
    for (const taskItem of taskResponse.data.items || []) {
      allTasks.push(taskItem);
    }
  }
  return c.json(allTasks);
});

googleTasksRouter.get('/completes', (c) => {
  return c.json({ hello: 'tasks google Router' });
});

googleTasksRouter.get('/usercheck', (c) => {
  const newUuid = crypto.randomUUID();
  return c.json({ userId: newUuid });
});

export { googleTasksRouter };
