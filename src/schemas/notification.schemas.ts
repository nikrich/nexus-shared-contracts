import { z } from 'zod';

const notificationChannelSchema = z.enum(['in_app', 'email', 'webhook']);
const notificationTypeSchema = z.enum([
  'task_assigned',
  'task_status_changed',
  'comment_added',
  'project_invited',
  'task_due_soon',
]);

export const sendNotificationSchema = z.object({
  userId: z.string().min(1),
  type: notificationTypeSchema,
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
  metadata: z.record(z.string()).optional(),
  channels: z.array(notificationChannelSchema).optional(),
});

export const updatePreferencesSchema = z.object({
  taskAssigned: z.array(notificationChannelSchema).optional(),
  taskStatusChanged: z.array(notificationChannelSchema).optional(),
  commentAdded: z.array(notificationChannelSchema).optional(),
  projectInvited: z.array(notificationChannelSchema).optional(),
  taskDueSoon: z.array(notificationChannelSchema).optional(),
});

export const createWebhookSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(8),
  events: z.array(notificationTypeSchema).min(1),
});

export const updateWebhookSchema = z.object({
  url: z.string().url().optional(),
  secret: z.string().min(8).optional(),
  events: z.array(notificationTypeSchema).min(1).optional(),
  active: z.boolean().optional(),
});
