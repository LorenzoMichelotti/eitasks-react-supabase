import Task from "@/models/Task";
import { TrashIcon } from "@radix-ui/react-icons";

export default function SubtaskCard({
  subtask,
  toggleSubtask,
  handleDeleteSubtask,
}: {
  subtask: Task;
  toggleSubtask: (subtask: Task) => void;
  handleDeleteSubtask: (subtaskId: number) => void;
}): JSX.Element {
  return (
    <div
      key={subtask.id}
      className="flex group items-center justify-between rounded-lg hover:bg-brand-medium"
    >
      <button
        onClick={() => toggleSubtask(subtask)}
        className="flex items-center w-full px-4 py-2 h-full rounded-l-lg cursor-pointer space-x-4"
      >
        <input type="checkbox" readOnly checked={subtask.completed} />
        <span className="text-left">{subtask.title}</span>
      </button>
      <button
        onClick={() => handleDeleteSubtask(subtask.id)}
        className="opacity-5  flex w-10 h-10 group-hover:opacity-100 duration-75 hover:text-pink-500 justify-center items-center rounded-r-lg"
      >
        <TrashIcon></TrashIcon>
      </button>
    </div>
  );
}

export function SubtaskCardSkelleton() {
  return (
    <div className="flex p-2 px-4 items-center justify-between hover:bg-brand-medium rounded-lg"></div>
  );
}
