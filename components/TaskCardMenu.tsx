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
  taskId: number;
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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className=" hover:bg-brand-dark p-2 rounded-full transition-colors"
              aria-label="Customise options"
            >
              <DotsHorizontalIcon className="dark:text-white" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="DropdownMenuContent dark:bg-brand-medium shadow-lg border-2 border-brand-dark dark:text-white rounded-2xl"
              sideOffset={5}
            >
              <DropdownMenu.Item
                onClick={toggleFormOpen}
                className="DropdownMenuItem p-4 hover:bg-teal-500/5 flex space-x-2 text-white items-center"
              >
                <PlusIcon></PlusIcon> <span>Add task</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={completeTask}
                className="DropdownMenuItem p-4 hover:bg-teal-500/5 flex space-x-2 text-teal-500 items-center"
              >
                <CheckIcon></CheckIcon> <span>Complete task</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={deleteTask}
                className="DropdownMenuItem p-4 hover:bg-pink-500/5 rounded-b-2xl text-pink-500 flex space-x-2 items-center transition-colors"
              >
                <Cross2Icon></Cross2Icon> <span>Delete task</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
      {!canHaveSubtasks && (
        <button
          onClick={completeTask}
          className=" ml-2 hover:bg-brand-dark p-2 rounded-full transition-colors"
          aria-label="Delete Task"
        >
          <CheckIcon className="text-teal-500" />
        </button>
      )}
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
