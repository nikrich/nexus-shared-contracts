// Notification types - NEXUS-SC-002
export type NotificationChannel = 'in_app' | 'email' | 'webhook';
export type NotificationType =
  | 'task_assigned'
  | 'task_status_changed'
  | 'comment_added'
  | 'project_invited'
  | 'task_due_soon';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  metadata: Record<string, string>;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  userId: string;
  taskAssigned: NotificationChannel[];
  taskStatusChanged: NotificationChannel[];
  commentAdded: NotificationChannel[];
  projectInvited: NotificationChannel[];
  taskDueSoon: NotificationChannel[];
}

export interface SendNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, string>;
  channels?: NotificationChannel[];
}

export interface WebhookConfig {
  id: string;
  userId: string;
  url: string;
  secret: string;
  events: NotificationType[];
  active: boolean;
  createdAt: string;
}
