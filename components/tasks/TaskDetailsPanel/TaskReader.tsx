import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { TrashIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import moment from "moment";
import TaskCard from "../TaskCard";
import TaskForm from "../TaskForm";

export default function TaskReader({
  deleteTask,
}: {
  deleteTask: (taskId?: number, closeDetails?: boolean) => void;
}) {
  const { activeTask, tasks, updateTask } = useTaskStore((state) => ({
    activeTask: state.activeTask,
    tasks: state.tasks,
    updateTask: state.updateTask,
  }));

  function toggleSubtask(subtask: Task) {
    subtask.completed = !subtask.completed;
    updateTask(subtask);
  }

  if (activeTask)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-2xl font-bold">{activeTask.title}</h1>
        <span className="text-sm text-brand-lightest">
          {moment(activeTask.created_at).format("MMM Do YY")}
        </span>
        <p>{activeTask.description}</p>
        <div className="flex flex-col w-full">
          {/* subtasks */}
          <TaskForm parentTaskId={activeTask.id} subtaskMode={true} />
          <div className="flex max-h-64 overflow-auto flex-col space-y-1 mt-4">
            {tasks
              .filter((task) => task.parentTaskId === activeTask.id)
              .map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex p-2 px-4 items-center justify-between hover:bg-brand-medium rounded-lg"
                >
                  <div className="flex space-x-4">
                    <input
                      type="checkbox"
                      onClick={() => toggleSubtask(subtask)}
                      checked={subtask.completed}
                    />
                    <span>{subtask.title}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(subtask.id)}
                    className="hover:text-pink-500 w-8 h-8 flex justify-center items-center rounded-full"
                  >
                    <TrashIcon></TrashIcon>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    );
  else return null;
}
