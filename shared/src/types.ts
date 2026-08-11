/** Domain entities and API contract types shared by the server and client. */

export type TodoStatus = 'open' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  notes?: string;
  status: TodoStatus;
  priority: TodoPriority;
  listId: string;
  tagIds: string[];
  /** ISO date (YYYY-MM-DD), no time component. */
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  /** Hex color, e.g. "#e05d44". */
  color: string;
  createdAt: string;
}

export interface List {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export type ActivityAction = 'created' | 'updated' | 'completed' | 'reopened' | 'deleted';

export interface ActivityEntry {
  id: string;
  todoId: string;
  /** Todo title at the time of the action, so the feed survives deletions. */
  todoTitle: string;
  action: ActivityAction;
  at: string;
}

export interface StatsSummary {
  total: number;
  open: number;
  done: number;
  byPriority: Record<TodoPriority, number>;
  completedThisWeek: number;
  overdue: number;
}

export interface TagStat {
  tagId: string;
  tagName: string;
  color: string;
  todoCount: number;
}

export interface InspirationQuote {
  text: string;
  author: string;
  category: string;
}

/** Query parameters accepted by GET /api/todos. */
export interface TodoQuery {
  status?: TodoStatus;
  priority?: TodoPriority;
  tagId?: string;
  listId?: string;
  /** Free-text search over title and notes. */
  q?: string;
  sort?: 'createdAt';
  page?: number;
  pageSize?: number;
}

export interface PageMeta {
  total: number;
  page: number;
  pageSize: number;
}

/** Every successful API response uses this envelope (see docs/adr/0001). */
export interface ApiSuccess<T> {
  data: T;
  meta?: PageMeta;
}

export type ApiErrorCode =
  'VALIDATION_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'RATE_LIMITED' | 'UPSTREAM_ERROR' | 'INTERNAL';

/** Every error API response uses this envelope (see docs/adr/0001). */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}
