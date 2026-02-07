import type { User, AuthToken } from '../types/user.js';
import type { Task } from '../types/project.js';
import type { SendNotificationRequest } from '../types/notification.js';
import type { ApiResponse, PaginatedResponse, PaginationQuery } from '../types/common.js';

export class NexusApiClient {
  constructor(
    private baseUrl: string,
    private serviceToken?: string,
  ) {}

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.serviceToken) {
      headers['Authorization'] = `Bearer ${this.serviceToken}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = (body as { error?: { message?: string } })?.error?.message || response.statusText;
      throw new Error(`API error ${response.status}: ${message}`);
    }

    const json = (await response.json()) as ApiResponse<T>;
    return json.data;
  }

  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    const query = ids.join(',');
    return this.request<User[]>(`/users/batch?ids=${encodeURIComponent(query)}`);
  }

  async validateToken(token: string): Promise<AuthToken> {
    return this.request<AuthToken>('/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`);
  }

  async getProjectTasks(projectId: string, query?: PaginationQuery): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.pageSize) params.set('pageSize', String(query.pageSize));
    const qs = params.toString();
    const path = `/projects/${projectId}/tasks${qs ? `?${qs}` : ''}`;
    return this.request<PaginatedResponse<Task>>(path);
  }

  async sendNotification(req: SendNotificationRequest): Promise<void> {
    await this.request<void>('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  }
}
