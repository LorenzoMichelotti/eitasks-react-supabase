import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { MinusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import moment from "moment";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TaskDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const { activeTask, setActiveTask, updateTask, profile, removeTask } =
    useTaskStore((state) => ({
      activeTask: state.activeTask,
      setActiveTask: state.setActiveTask,
      updateTask: state.updateTask,
      profile: state.profile,
      removeTask: state.removeTask,
    }));

  function handleToggleEditor() {
    setIsEditing((prev) => !prev);
    resetFields();
  }

  function handleOpenEditor() {
    setIsEditing(true);
    resetFields();
  }

  function handleCloseEditor() {
    setIsEditing(false);
    resetFields();
  }

  function resetFields() {
    if (activeTask) {
      setFormTitle(activeTask.title);
      setFormDescription(activeTask.description);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!activeTask) return;

    toast.loading("Updating task...", { id: "updating-task-toast" });

    const updatedTask: Task = { ...activeTask };
    updatedTask.description = formDescription;
    updatedTask.title = formTitle;

    updateTask(updatedTask);
    handleCloseEditor();

    e.stopPropagation();
  }

  function deleteTask(taskId?: number) {
    if (!taskId) return toast.error("Invalid task");
    if (profile) {
      removeTask(taskId, profile?.id);
      setActiveTask();
    } else {
      return toast.error("Invalid profile");
    }
  }

  useEffect(() => {
    resetFields();
    handleCloseEditor();
  }, [activeTask]);

  return (
    <div className="text-white bg-brand-dark rounded-xl w-full p-4">
      <div className="w-full flex justify-end space-x-2">
        <button
          onClick={() => deleteTask(activeTask?.id)}
          className="p-2 hover:bg-brand-darkest rounded-full transition-colors"
        >
          <TrashIcon></TrashIcon>
        </button>
        <button
          onClick={() => handleToggleEditor()}
          className="p-2 hover:bg-brand-darkest rounded-full transition-colors"
        >
          <Pencil1Icon></Pencil1Icon>
        </button>
        <button
          onClick={() => setActiveTask()}
          className="p-2 hover:bg-brand-darkest rounded-full transition-colors"
        >
          <MinusIcon></MinusIcon>
        </button>
      </div>
      {activeTask && (
        <motion.div
          key={activeTask.id}
          animate={{ opacity: [0, 1], y: [50, 0] }}
          className="w-full flex flex-col space-y-2"
        >
          {!isEditing ? (
            <h1 className="text-2xl font-bold">{activeTask.title}</h1>
          ) : (
            <textarea
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              rows={2}
              className={
                "resize-none text-2xl font-bold w-full rounded-lg bg-brand-darkest p-2 px-3 text-white placeholder:text-placeholder"
              }
            ></textarea>
          )}
          <span className="text-sm text-brand-lightest">
            {moment(activeTask.created_at).format("MMM Do YY")}
          </span>
          {activeTask.description && !isEditing ? (
            <p>{activeTask.description}</p>
          ) : (
            // TASK DESCRIPTION EDITOR
            <form onSubmit={handleSubmit} action="POST" className="w-full">
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                name=""
                rows={5}
                placeholder={
                  !activeTask.description
                    ? "This task is missing a description"
                    : ""
                }
                className={
                  "resize-none w-full rounded-lg bg-brand-darkest p-2 px-3 text-white placeholder:text-placeholder"
                }
              ></textarea>
              <div className="flex justify-end w-full mt-2">
                <input
                  onClick={handleOpenEditor}
                  value={"CANCEL"}
                  type={"button"}
                  className="bg-brand-medium w-24 text-center font-bold rounded-lg p-2 px-4"
                />
                <input
                  type={"submit"}
                  value={"SAVE"}
                  className="bg-success-500 w-24 text-center ml-2 font-bold rounded-lg p-2 px-4"
                ></input>
              </div>
            </form>
          )}
        </motion.div>
      )}
    </div>
  );
}
