export default interface Task {
  id: number;
  description: string;
  progress: number;
  created: string;
  completed?: boolean;
  subtasks?: Task[];
}
