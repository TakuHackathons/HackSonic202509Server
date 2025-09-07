import { Hono, Context } from 'hono';
import crypto from 'crypto';
import { env } from 'hono/adapter';
import { getOauth2ClientSettings } from '../../utils/google-oauth2-client';
import { google } from 'googleapis';
import { GoogleGenAI } from '@google/genai';

const googleTasksRouter = new Hono();

googleTasksRouter.get('/', async (c) => {
  const envConfigs = env(c);
  return c.json({ hello: 'tasks google Router' });
});

googleTasksRouter.get('/list', async (c) => {
  const envConfigs = env(c);
  // Show: https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/list
  const oauth2Client = new google.auth.OAuth2(getOauth2ClientSettings(c));
  oauth2Client.setCredentials({
    refresh_token: envConfigs.DEBUG_PRIVATE_GOOGLE_TASK_REFRESH_TOKEN?.toString(),
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

googleTasksRouter.get('/message/completes', async (c) => {
  const envConfigs = env(c);
  // Show: https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/list
  const oauth2Client = new google.auth.OAuth2(getOauth2ClientSettings(c));
  oauth2Client.setCredentials({
    refresh_token: envConfigs.DEBUG_PRIVATE_GOOGLE_TASK_REFRESH_TOKEN?.toString(),
  });
  const service = google.tasks({ version: 'v1', auth: oauth2Client });
  const tasklistResponses = await service.tasklists.list();
  const completedTasks = [];
  for (const taskListItem of tasklistResponses.data.items || []) {
    const taskResponse = await service.tasks.list({ tasklist: taskListItem.id?.toString(), showCompleted: true, maxResults: 100 });
    for (const taskItem of taskResponse.data.items || []) {
      if (taskItem.completed) {
        completedTasks.push(taskItem);
      }
    }
  }
  const ai = new GoogleGenAI({ apiKey: envConfigs.GOOGLE_API_KEY?.toString() });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-lite-001',
    contents: `以降に1行ごとにタスクを紹介します。これらのタスクを完了しました。タスクの内容を踏まえて若い女の子が褒めてくれるようなメッセージを端的に返してください。\n${completedTasks.map((completedTask) => completedTask.title).join('\n')}`,
  });
  return c.json({
    message: response.text,
    targetTasks: completedTasks,
  });
});

googleTasksRouter.get('/message/complete', async (c) => {
  const envConfigs = env(c);
  // Show: https://developers.google.com/workspace/tasks/reference/rest/v1/tasks/list
  const oauth2Client = new google.auth.OAuth2(getOauth2ClientSettings(c));
  oauth2Client.setCredentials({
    refresh_token: envConfigs.DEBUG_PRIVATE_GOOGLE_TASK_REFRESH_TOKEN?.toString(),
  });
  const service = google.tasks({ version: 'v1', auth: oauth2Client });
  const tasklistResponses = await service.tasklists.list();
  const completedTasks = [];
  for (const taskListItem of tasklistResponses.data.items || []) {
    const taskResponse = await service.tasks.list({ tasklist: taskListItem.id?.toString(), showCompleted: true, maxResults: 100 });
    for (const taskItem of taskResponse.data.items || []) {
      if (taskItem.completed) {
        completedTasks.push(taskItem);
      }
    }
  }
  const ai = new GoogleGenAI({ apiKey: envConfigs.GOOGLE_API_KEY?.toString() });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-lite-001',
    contents: `以降に1行ごとにタスクを紹介します。これらのタスクを完了しました。タスクの内容を踏まえて若い女の子が褒めてくれるようなメッセージを端的に返してください。\n${completedTasks.map((completedTask) => completedTask.title).join('\n')}`,
  });
  const targetTask = completedTasks[Math.floor(Math.random() * completedTasks.length)];
  //  const messageText = `やったね!!${targetTask.title}を終わらせたんだね!!`;
  return c.json({
    message: response.text,
    targetTask: targetTask,
  });
});

googleTasksRouter.get('/usercheck', (c) => {
  const newUuid = crypto.randomUUID();
  return c.json({ userId: newUuid });
});

export { googleTasksRouter };
