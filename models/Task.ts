export default interface Task {
  id: string;
  description: string;
  progress: number;
  created: string;
  completed?: boolean;
  parentTaskId?: string;
}
