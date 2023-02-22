import Task from "@/models/Task";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DotsHorizontalIcon,
  CheckIcon,
  Cross2Icon,
  PlusIcon,
  MinusIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

export default function TaskCardMenu({
  task,
  taskId,
  completeTask,
  deleteTask,
  canHaveSubtasks,
}: {
  task: Task;
  taskId: string;
  completeTask: () => void;
  deleteTask: () => void;
  canHaveSubtasks: boolean;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  function toggleFormOpen() {
    setIsFormOpen((prev) => !prev);
  }

  return (
    <div className="flex">
      <CreateTaskModal
        taskId={taskId}
        open={isFormOpen}
        onOpenChange={toggleFormOpen}
      />
      {canHaveSubtasks && (
        <button
          onClick={toggleFormOpen}
          className=" ml-2 hover:bg-brand-dark p-2 rounded-full transition-colors"
          aria-label="Delete Task"
        >
          <PlusIcon className="dark:text-white" />
        </button>
      )}
      <button
        onClick={completeTask}
        className=" ml-2 hover:bg-brand-dark p-2 rounded-full transition-colors"
        aria-label="Delete Task"
      >
        <CheckIcon className="text-teal-500" />
      </button>
      <button
        onClick={deleteTask}
        className=" ml-2 hover:bg-brand-dark p-2 rounded-full transition-colors"
        aria-label="Delete Task"
      >
        <Cross1Icon className="text-pink-500" />
      </button>
    </div>
  );
}
