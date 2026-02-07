import { describe, it, expect } from 'vitest';
import {
  registerRequestSchema,
  loginRequestSchema,
  updateUserSchema,
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  createCommentSchema,
  paginationQuerySchema,
  taskFilterQuerySchema,
  sendNotificationSchema,
  updatePreferencesSchema,
  createWebhookSchema,
  updateWebhookSchema,
  paginationSchema,
} from '../src/index.js';

describe('shared-contracts', () => {
  it('should export types', async () => {
    const mod = await import('../src/index.js');
    expect(mod).toBeDefined();
  });
});

describe('user schemas', () => {
  describe('registerRequestSchema', () => {
    it('accepts valid registration', () => {
      const result = registerRequestSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerRequestSchema.safeParse({
        email: 'invalid',
        password: 'password123',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = registerRequestSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty name', () => {
      const result = registerRequestSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        name: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginRequestSchema', () => {
    it('accepts valid login', () => {
      const result = loginRequestSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing password', () => {
      const result = loginRequestSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('accepts partial update', () => {
      const result = updateUserSchema.safeParse({ name: 'New Name' });
      expect(result.success).toBe(true);
    });

    it('accepts empty object', () => {
      const result = updateUserSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts valid role', () => {
      const result = updateUserSchema.safeParse({ role: 'admin' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid role', () => {
      const result = updateUserSchema.safeParse({ role: 'superadmin' });
      expect(result.success).toBe(false);
    });
  });
});

describe('project schemas', () => {
  describe('createProjectSchema', () => {
    it('accepts valid project', () => {
      const result = createProjectSchema.safeParse({
        name: 'My Project',
        description: 'A test project',
      });
      expect(result.success).toBe(true);
    });

    it('defaults description to empty string', () => {
      const result = createProjectSchema.safeParse({ name: 'My Project' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe('');
      }
    });

    it('rejects empty name', () => {
      const result = createProjectSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('updateProjectSchema', () => {
    it('accepts partial update', () => {
      const result = updateProjectSchema.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });
  });

  describe('createTaskSchema', () => {
    it('accepts valid task', () => {
      const result = createTaskSchema.safeParse({
        title: 'Fix bug',
        description: 'Fix the login bug',
        priority: 'high',
      });
      expect(result.success).toBe(true);
    });

    it('defaults priority to medium', () => {
      const result = createTaskSchema.safeParse({
        title: 'A task',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe('medium');
      }
    });

    it('rejects invalid priority', () => {
      const result = createTaskSchema.safeParse({
        title: 'A task',
        priority: 'urgent',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateTaskSchema', () => {
    it('accepts status change', () => {
      const result = updateTaskSchema.safeParse({ status: 'in_progress' });
      expect(result.success).toBe(true);
    });

    it('accepts null assigneeId to unassign', () => {
      const result = updateTaskSchema.safeParse({ assigneeId: null });
      expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
      const result = updateTaskSchema.safeParse({ status: 'cancelled' });
      expect(result.success).toBe(false);
    });
  });

  describe('createCommentSchema', () => {
    it('accepts valid comment', () => {
      const result = createCommentSchema.safeParse({ body: 'Great work!' });
      expect(result.success).toBe(true);
    });

    it('rejects empty body', () => {
      const result = createCommentSchema.safeParse({ body: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('paginationQuerySchema', () => {
    it('applies defaults', () => {
      const result = paginationQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(20);
      }
    });

    it('coerces string numbers', () => {
      const result = paginationQuerySchema.safeParse({ page: '3', pageSize: '50' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(3);
        expect(result.data.pageSize).toBe(50);
      }
    });

    it('rejects pageSize over 100', () => {
      const result = paginationQuerySchema.safeParse({ pageSize: 200 });
      expect(result.success).toBe(false);
    });
  });

  describe('taskFilterQuerySchema', () => {
    it('applies defaults', () => {
      const result = taskFilterQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sortBy).toBe('createdAt');
        expect(result.data.sortOrder).toBe('desc');
      }
    });

    it('accepts filter parameters', () => {
      const result = taskFilterQuerySchema.safeParse({
        status: 'todo,in_progress',
        priority: 'high',
        assigneeId: 'user123',
        search: 'bug',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('notification schemas', () => {
  describe('sendNotificationSchema', () => {
    it('accepts valid notification', () => {
      const result = sendNotificationSchema.safeParse({
        userId: 'user123',
        type: 'task_assigned',
        title: 'Task Assigned',
        body: 'You have been assigned a task',
      });
      expect(result.success).toBe(true);
    });

    it('accepts optional metadata and channels', () => {
      const result = sendNotificationSchema.safeParse({
        userId: 'user123',
        type: 'comment_added',
        title: 'New Comment',
        body: 'A comment was added',
        metadata: { taskId: 'task1' },
        channels: ['in_app', 'email'],
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid notification type', () => {
      const result = sendNotificationSchema.safeParse({
        userId: 'user123',
        type: 'invalid_type',
        title: 'Test',
        body: 'Test',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updatePreferencesSchema', () => {
    it('accepts partial preferences', () => {
      const result = updatePreferencesSchema.safeParse({
        taskAssigned: ['in_app', 'email'],
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid channel', () => {
      const result = updatePreferencesSchema.safeParse({
        taskAssigned: ['sms'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createWebhookSchema', () => {
    it('accepts valid webhook', () => {
      const result = createWebhookSchema.safeParse({
        url: 'https://example.com/webhook',
        secret: 'mysecretkey123',
        events: ['task_assigned', 'comment_added'],
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty events array', () => {
      const result = createWebhookSchema.safeParse({
        url: 'https://example.com/webhook',
        secret: 'mysecretkey123',
        events: [],
      });
      expect(result.success).toBe(false);
    });

    it('rejects short secret', () => {
      const result = createWebhookSchema.safeParse({
        url: 'https://example.com/webhook',
        secret: 'short',
        events: ['task_assigned'],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateWebhookSchema', () => {
    it('accepts partial update', () => {
      const result = updateWebhookSchema.safeParse({ active: false });
      expect(result.success).toBe(true);
    });
  });
});

describe('common schemas', () => {
  describe('paginationSchema', () => {
    it('applies defaults', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(20);
      }
    });
  });
});
