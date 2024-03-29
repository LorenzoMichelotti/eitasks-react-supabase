import useTaskStore from "@/hooks/UseTaskStore";
import supabase from "@/services/supabaseClient";
import { MinusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TaskEditor from "./TaskEditor";
import TaskReader from "./TaskReader";

export default function TaskDetails() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { activeTask, setActiveTask, profile, removeTask } = useTaskStore(
    (state) => ({
      activeTask: state.activeTask,
      setActiveTask: state.setActiveTask,
      profile: state.profile,
      removeTask: state.removeTask,
    })
  );

  function handleToggleEditor() {
    setIsEditing((prev) => !prev);
  }

  function handleOpenEditor() {
    setIsEditing(true);
  }

  function handleCloseEditor() {
    setIsEditing(false);
  }

  function deleteTask(taskId?: number, closeDetails?: boolean) {
    if (!taskId) return toast.error("Invalid task");
    if (profile) {
      if (closeDetails) {
        removeTask(taskId, profile?.id, supabase);
        setActiveTask();
        router.reload();
      } else removeTask(taskId, profile?.id, supabase, true);
    } else {
      return toast.error("Invalid profile");
    }
  }

  useEffect(() => {
    if (!activeTask) {
      handleCloseEditor();
    }
  }, [activeTask]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      className="text-white h-full max-h-[120%] bg-brand-dark rounded-xl w-full p-4"
    >
      <motion.div layout className="w-full flex mb-4">
        <div className="w-full flex justify-end space-x-2">
          <button
            onClick={() => deleteTask(activeTask?.id, true)}
            className="p-2 hover:bg-brand-darkest rounded-full"
          >
            <TrashIcon></TrashIcon>
          </button>
          <button
            onClick={() => handleToggleEditor()}
            className={`p-2 hover:bg-brand-darkest rounded-full ${
              isEditing ? "text-success-400" : "text-white"
            }`}
          >
            <Pencil1Icon></Pencil1Icon>
          </button>
          <button
            onClick={() => setActiveTask()}
            className="p-2 hover:bg-brand-darkest rounded-full"
          >
            <MinusIcon></MinusIcon>
          </button>
        </div>
      </motion.div>
      {activeTask && (
        <motion.div
          layout
          key={activeTask.id}
          animate={{ opacity: [0, 1], y: [50, 0] }}
          className="w-full flex flex-col space-y-2"
        >
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <TaskReader deleteTask={deleteTask} key={"task-reader"} />
            ) : (
              <TaskEditor
                key={"task-editor"}
                handleCloseEditor={handleCloseEditor}
                handleOpenEditor={handleOpenEditor}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
