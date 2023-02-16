import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import TaskCard from "./TaskCard";
import CompletedTaskList from "./CompletedTaskList";

const taskCardVariants = {
  initial: { opacity: 0, y: -20, scaleY: 0.75 },
  idle: { opacity: 1, y: 0, scaleY: 1 },
  completed: {
    opacity: 1,
    rotateX: 360,
    scaleY: 1,
    scaleX: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  exit: (param: boolean) => ({
    opacity: 0,
    scale: 1,
    y: param ? -10 : 10,
  }),
};

export default function TaskList() {
  const { tasks, setTasks } = useTaskStore((state) => ({
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));
  return (
    <div className="w-full flex flex-col mt-12 space-y-4 mx-auto h-full">
      {/* <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={(reorderedTasks: Task[]) => {
          setTasks([...reorderedTasks, ...tasks.filter((t) => t.parentTaskId)]);
        }}
        className="mt-12 space-y-4 w-full mx-auto h-full"
      > */}
      <AnimatePresence>
        {tasks
          .filter((task) => !task.completed)
          .map((task) => {
            if (!task.parentTaskId)
              return (
                <motion.div
                  // dragListener={false}
                  variants={taskCardVariants}
                  custom={task.completed}
                  initial={"initial"}
                  animate={task.completed ? "completed" : "idle"}
                  exit={"exit"}
                  // drag="y"
                  layout
                  key={task.id}
                  className={`w-full h-full relative`} //task
                >
                  <TaskCard task={task} key={task.id} />
                </motion.div>
              );
          })}
      </AnimatePresence>
      {/* </Reorder.Group> */}
      <CompletedTaskList></CompletedTaskList>
    </div>
  );
}
