import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { JsxElement } from "typescript";
import TaskForm from "./TaskForm";

export default function CreateTaskModal({
  taskId,
  open,
  onOpenChange,
}: {
  taskId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  function toggleModalOpen() {
    onOpenChange(!open);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/25 dark:text-white backdrop-blur-xl fixed inset-0 pointer-events-auto" />
        <Dialog.Content className="rounded-2xl fixed flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh]">
          <TaskForm
            setIsOpen={toggleModalOpen}
            parentTaskId={taskId}
          ></TaskForm>
          <Dialog.Close asChild>
            <motion.button
              animate={{ opacity: [0, 1] }}
              className="border-2 rounded-2xl p-2 hover:border-pink-400 hover:text-pink-400 active:scale-95 active:border-pink-600 active:text-pink-600 text-pink-500 border-pink-500 w-3/12 mt-2 transition-all"
            >
              Cancel
            </motion.button>
          </Dialog.Close>
          <div></div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
