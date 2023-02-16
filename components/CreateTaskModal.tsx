import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { JsxElement } from "typescript";

export default function CreateTaskModal({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="bg-white rounded-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh]">
          <Dialog.Title>Create Task</Dialog.Title>
          <Dialog.Description>
            Create a new task to be completed
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="DropdownMenuItem p-4 hover:bg-white/5 rounded-t-2xl flex space-x-2 items-center">
              <Cross1Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
