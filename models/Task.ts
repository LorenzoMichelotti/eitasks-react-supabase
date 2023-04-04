export default interface Task {
  id: number;
  created_at?: string;
  completed?: boolean;
  parentTaskId?: number;
  description: string;
  progress: number;
  title: string;
}

export interface CreateTask {
  progress: number;
  parentTaskId?: number;
  profileId: number;
  title: string;
}
