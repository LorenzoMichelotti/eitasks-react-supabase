import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useState } from "react";
import TaskCard from "./TaskCard";

const taskCardVariants = {
  initial: { opacity: 0, y: -20, scaleY: 0.75 },
  idle: { opacity: 1, y: 0, scaleY: 1 },
  completed: {
    opacity: 1,
    y: 0,
    scaleY: 1,
  },
  exit: (param: boolean) => ({
    opacity: 0,
    scale: 1,
    y: param ? -10 : 10,
  }),
};

export default function CompletedTaskList() {
  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));

  const [open, setOpen] = useState(false);

  function handleOnValueChange(e: any) {
    setOpen(e.trim() !== "");
  }

  return (
    <Accordion.Root
      onValueChange={handleOnValueChange}
      type="single"
      className="w-full"
      collapsible
    >
      <Accordion.Item
        value="item 1"
        className="overflow-hidden mt-1 dark:text-white"
      >
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full">
            <p className="dark:text-teal-500 flex items-center space-x-2 ml-auto mr-4">
              {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              <span>Completed tasks</span>
            </p>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden space-y-4 w-full mt-6 mx-auto h-full">
          <AnimatePresence>
            {tasks
              .filter((task) => task.completed)
              .map((task) => {
                if (!task.parentTaskId)
                  return <TaskCard task={task} key={task.id} />;
              })}
          </AnimatePresence>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
