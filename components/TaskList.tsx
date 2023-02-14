import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, Reorder } from "framer-motion";
import TaskCard from "./TaskCard";

const taskCardVariants = {
  initial: { opacity: 0, y: -20, scaleY: 0.75 },
  idle: { opacity: 1, y: 0, scaleY: 1 },
  completed: {
    opacity: 1,
    scaleX: 1.2,
    scaleY: 1.2,
    rotateX: 360,
    transition: { duration: 0.5 },
  },
  exit: (param: boolean) => ({
    opacity: 0,
    scale: param ? 1 : 0.8,
    x: param ? 200 : 0,
  }),
};

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  return (
    <Reorder.Group
      axis="y"
      values={tasks}
      onReorder={(reorderedTasks: Task[]) => {
        setTasks([...reorderedTasks, ...tasks.filter((t) => t.parentTaskId)]);
      }}
      className="mt-12 space-y-4 w-full mx-auto h-full"
    >
      <AnimatePresence>
        {tasks.map((task) => {
          if (!task.parentTaskId)
            return (
              // <Reorder.Item
              //   variants={taskCardVariants}
              //   custom={task.completed}
              //   initial={"initial"}
              //   animate={task.completed ? "completed" : "idle"}
              //   whileHover={"hovered"}
              //   exit={"exit"}
              //   value={task}
              //   // drag="y"
              //   layout
              //   key={task.id}
              //   className={`w-full h-full relative`} //task
              // >
              <TaskCard task={task} key={task.id} />
              // </Reorder.Item>
            );
        })}
      </AnimatePresence>
    </Reorder.Group>
  );
}
