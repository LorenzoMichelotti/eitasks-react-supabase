import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { TrashIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import TaskForm from "../TaskForm";

export default function TaskReader({
  deleteTask,
}: {
  deleteTask: (taskId?: number, closeDetails?: boolean) => void;
}) {
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const { activeTask, updateTask, setTasks, getSubtasks, profile, tasks } =
    useTaskStore((state) => ({
      activeTask: state.activeTask,
      tasks: state.tasks,
      updateTask: state.updateTask,
      getSubtasks: state.getSubtasks,
      profile: state.profile,
      setTasks: state.setTasks,
    }));

  function toggleSubtask(subtask: Task) {
    if (!activeTask) return;
    const updatedTasks = [...tasks];
    // optimistically update the subtask
    const updatedSubtasks = [...subtasks];
    const updatedSubtask = { ...subtask };
    updatedSubtask.completed = !updatedSubtask.completed;
    updatedSubtasks.splice(
      updatedSubtasks.findIndex((t) => t.id === updatedSubtask.id),
      1,
      updatedSubtask
    );
    updatedTasks.splice(
      tasks.findIndex((t) => t.id === updatedSubtask.id),
      1,
      updatedSubtask
    );
    // optimistically update the parent task's progress
    const parentTask = tasks.find((t) => t.id === subtask.parentTaskId);
    const updatedProgress =
      (updatedSubtasks.filter((t) => t.completed).length * 100) /
      updatedSubtasks.length;
    if (!parentTask) return;
    const updatedParentTask = { ...parentTask };
    updatedParentTask.progress = Math.round(updatedProgress);
    updatedTasks.splice(
      tasks.findIndex((t) => t.id === updatedParentTask.id),
      1,
      updatedParentTask
    );
    // optimistic update
    setTasks(updatedTasks);
    setSubtasks(updatedSubtasks);
    // database update
    updateTask(updatedParentTask);
    updateTask(updatedSubtask);
  }

  async function loadSubtasks() {
    if (!activeTask || !profile) return;
    const resp = await getSubtasks(activeTask.id, profile.id);
    setSubtasks(resp.subtasks);
  }

  useEffect(() => {
    console.log("activeTask changed");
    loadSubtasks();
  }, [activeTask]);

  if (activeTask)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-2xl font-bold">
          {" "}
          <span className="text-brand-lightest mr-2">[ #{activeTask.id} ]</span>
          {activeTask.title}
        </h1>
        <span className="text-sm text-brand-lightest">
          {moment(activeTask.created_at).format("MMM Do YY")}
        </span>
        <p>{activeTask.description}</p>
        <div className="flex flex-col w-full">
          {/* subtasks */}
          <TaskForm parentTaskId={activeTask.id} subtaskMode={true} />
          <div className="flex max-h-64 overflow-auto flex-col space-y-1 mt-4">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex p-2 px-4 items-center justify-between hover:bg-brand-medium rounded-lg"
              >
                <div className="flex space-x-4">
                  <input
                    type="checkbox"
                    onChange={() => toggleSubtask(subtask)}
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
