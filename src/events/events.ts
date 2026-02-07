import type { TaskStatus } from '../types/project.js';

export type ServiceEvent =
  | { type: 'user.created'; payload: { userId: string; email: string; name: string } }
  | { type: 'user.updated'; payload: { userId: string; changes: string[] } }
  | { type: 'task.created'; payload: { taskId: string; projectId: string; createdBy: string } }
  | { type: 'task.assigned'; payload: { taskId: string; assigneeId: string; assignedBy: string } }
  | { type: 'task.status_changed'; payload: { taskId: string; from: TaskStatus; to: TaskStatus; changedBy: string } }
  | { type: 'comment.created'; payload: { commentId: string; taskId: string; authorId: string } }
  | { type: 'project.created'; payload: { projectId: string; ownerId: string } };

export class EventBus {
  private handlers: Map<string, ((event: ServiceEvent) => Promise<void>)[]> = new Map();

  on(type: string, handler: (event: ServiceEvent) => Promise<void>): void {
    const existing = this.handlers.get(type) || [];
    existing.push(handler);
    this.handlers.set(type, existing);
  }

  async emit(event: ServiceEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map((h) => h(event)));
  }

  removeAll(): void {
    this.handlers.clear();
  }
}
