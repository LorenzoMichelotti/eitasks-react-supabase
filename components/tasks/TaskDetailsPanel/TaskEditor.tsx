import useTaskStore from "@/hooks/UseTaskStore";
import Task from "@/models/Task";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { animate, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TaskEditor({
  handleCloseEditor,
}: {
  handleCloseEditor: () => void;
  handleOpenEditor: () => void;
}) {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const supabase = useSupabaseClient();

  const { activeTask, updateTask, tasks, setTasks } = useTaskStore((state) => ({
    activeTask: state.activeTask,
    updateTask: state.updateTask,
    tasks: state.tasks,
    setTasks: state.setTasks,
  }));

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
    // optimistic update
    const updatedTasks = [...tasks];
    updatedTasks.splice(
      updatedTasks.findIndex((t) => t.id === updatedTask.id),
      1,
      updatedTask
    );
    setTasks(updatedTasks);
    // database update
    updateTask(updatedTask, supabase);
    resetFields();
    handleCloseEditor();
    e.stopPropagation();
  }

  useEffect(() => {
    resetFields();
  }, [activeTask]);

  const formFieldsVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        type: "spring",
        transition: { duration: 0.1 },
      },
    },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };

  if (activeTask)
    return (
      <motion.form
        onSubmit={handleSubmit}
        action="POST"
        className="w-full flex flex-col space-y-2"
        variants={formFieldsVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.label variants={formFieldsVariants}>Title</motion.label>
        <motion.textarea
          variants={formFieldsVariants}
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          rows={2}
          className={
            "resize-none text-2xl font-bold w-full rounded-lg bg-brand-darkest p-2 px-3 text-white placeholder:text-placeholder"
          }
        ></motion.textarea>
        <motion.label variants={formFieldsVariants}>Description</motion.label>
        <motion.textarea
          variants={formFieldsVariants}
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          name=""
          rows={5}
          placeholder={
            !activeTask.description ? "This task is missing a description" : ""
          }
          className={
            "resize-none w-full rounded-lg bg-brand-darkest p-2 px-3 text-white placeholder:text-placeholder"
          }
        ></motion.textarea>
        <motion.div
          variants={formFieldsVariants}
          className="flex justify-end w-full mt-2"
        >
          <input
            onClick={() => {
              resetFields();
              handleCloseEditor();
            }}
            value={"CANCEL"}
            type={"button"}
            className="bg-brand-medium hover:brightness-110 transition-all w-24 cursor-pointer text-center font-bold rounded-lg p-2 px-4"
          />
          <input
            type={"submit"}
            value={"SAVE"}
            className="bg-success-500 hover:brightness-110 transition-all w-24 cursor-pointer text-center ml-2 font-bold rounded-lg p-2 px-4"
          ></input>
        </motion.div>
      </motion.form>
    );
  else return null;
}
