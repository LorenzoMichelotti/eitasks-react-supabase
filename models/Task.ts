export default interface Task {
  id: number;
  created_at?: string;
  completed?: boolean;
  parentTaskId?: number;
  description: string;
  progress: number;
}

export interface CreateTask {
  description: string;
  progress: number;
  parentTaskId?: number;
  profileId: number;
}
