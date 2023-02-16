import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DotsHorizontalIcon,
  CheckIcon,
  Cross2Icon,
  PlusIcon,
  MinusIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";

export default function TaskCardMenu({
  openForm,
  completeTask,
  deleteTask,
}: {
  openForm: () => void;
  completeTask: () => void;
  deleteTask: () => void;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="flex">
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
              onClick={() => {
                openForm();
                setIsFormOpen((old) => !old);
              }}
              className="DropdownMenuItem p-4 hover:bg-white/5 rounded-t-2xl flex space-x-2 items-center"
            >
              {!isFormOpen && (
                <>
                  <PlusIcon></PlusIcon>
                  <span>Add subtask</span>
                </>
              )}
              {isFormOpen && (
                <>
                  <MinusIcon></MinusIcon>
                  <span>Close form</span>
                </>
              )}
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
