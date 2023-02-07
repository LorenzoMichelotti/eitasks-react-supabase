import Progress from "@/components/Progress";
import Slider from "@/components/Slider";
import { AnimatePresence, motion, Reorder, useTransform } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface Task {
  id: number;
  description: string;
  progress: number;
  created: string;
  completed?: boolean;
}

const taskCardVariants = {
  initial: { opacity: 0, y: -20, scaleY: 0.75 },
  idle: { opacity: 1, y: 0, scaleY: 1 },
  hovered: { opacity: 1, y: 0, scaleY: 1 },
  completed: {
    opacity: 1,
    scaleX: 1.2,
    scaleY: 1.2,
    rotateX: [null, 360],
    transition: { duration: 0.5 },
  },
  exit: (param: number) => ({
    opacity: 0,
    x: 300 * param,
    y: 50,
    rotate: 25 * param,
  }),
};

const taskCardButtonVariants = {
  idle: { opacity: 0 },
  hovered: { opacity: 0.5 },
};

export default function Home() {
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  const textArea = useRef<HTMLTextAreaElement>(null);

  function createTask(description: string, progress: number) {
    if (description == "") {
      console.log("Please enter description", description);
      return;
    }
    console.log("Creating task...");
    const newTask: Task = {
      created: new Date().toLocaleDateString(),
      description,
      progress: Math.round(progress),
      id: tasks.length + 1,
    };
    setTasks((prev) => {
      save([newTask, ...prev]);
      return [newTask, ...prev];
    });
    setDescription("");
    setProgress(0);
  }

  function deleteTask(taskId: number) {
    setTasks((prev) => {
      save(prev.filter((task) => task.id !== taskId));
      return prev.filter((task) => task.id !== taskId);
    });
  }

  function completeTask(taskId: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.progress = 100;
        task.completed = true;
      }
      return task;
    });
    setTasks((prev) => {
      save(newTasks);
      return newTasks;
    });

    setTimeout(() => {
      const thisTask = tasks.find((task) => task.id === taskId);
      if (thisTask)
        setCompletedTasks((prev) => {
          saveCompleted([...prev, thisTask]);
          return [...prev, thisTask];
        });
      setTasks((prev) => {
        save(prev.filter((task) => task.id !== taskId));
        return prev.filter((task) => task.id !== taskId);
      });
    }, 1000);
  }

  function updateTask(e: MouseEvent, taskId: number, progressChange: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        progressChange = e.shiftKey ? progressChange : progressChange * 2;
        const newProgress = Math.ceil((task.progress + progressChange) / 5) * 5;
        if (newProgress >= 100) task.progress = 100;
        else if (newProgress <= 0) task.progress = 0;
        else
          task.progress = Math.ceil((task.progress + progressChange) / 5) * 5;
      }
      return task;
    });
    setTasks((old) => {
      save(newTasks);
      return newTasks;
    });
  }

  function save(tasks: Task[]) {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function saveCompleted(tasks: Task[]) {
    window.localStorage.setItem("completed_tasks", JSON.stringify(tasks));
  }

  function load() {
    const loadedTasks = window.localStorage.getItem("tasks");
    const loadedCompletedTasks = window.localStorage.getItem("completed_tasks");

    if (loadedTasks && loadedTasks?.length > 0)
      setTasks(JSON.parse(loadedTasks));
    if (loadedCompletedTasks && loadedCompletedTasks?.length > 0)
      setCompletedTasks(JSON.parse(loadedCompletedTasks));
  }

  useEffect(() => {
    load();
  }, []);

  // useEffect(() => {
  //   load();
  //   function quickCreate() {
  //     createTask(description, progress);
  //   }
  //   window.addEventListener("keydown", (e: KeyboardEvent) => {
  //     if (e.key === "Enter" && e.shiftKey) quickCreate();
  //   });
  //   return () => {
  //     window.removeEventListener("keydown", (e: KeyboardEvent) => {
  //       if (e.key === "Enter" && e.shiftKey) quickCreate();
  //     });
  //   };
  // }, [description, progress]);

  // useEffect(() => {
  //   save();
  // }, [tasks]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="w-1/2 2xl:w-1/4 mx-auto my-24 ">
          <div className="absolute right-24 font-semibold top-12 text-teal-500">
            {completedTasks.length} / {tasks.length + completedTasks.length}
          </div>
          <div
            className="w-full focus-within:scale-105 transition-transform h-56 flex space-x-2"
            id="task_form_container"
          >
            <div
              className="w-11/12 h-full bg-[#1B1B22] shadow-xl p-4 rounded-l-2xl rounded-r-md"
              id="task_form"
            >
              <textarea
                ref={textArea}
                value={description}
                onChange={(e) => {
                  e.preventDefault();
                  setDescription(e.target.value);
                  e.stopPropagation();
                }}
                className="text-white py-2 px-4 text-[20px] resize-none w-full h-4/6 bg-[#151517] rounded-xl"
              ></textarea>
              <Slider value={progress} setValue={setProgress} />
            </div>
            <motion.button
              onClick={() => createTask(description, progress)}
              whileHover={{
                backgroundColor: "#485577",
                transition: { duration: 0.2, type: "spring" },
              }}
              whileTap={{
                backgroundColor: "#3D4062",
                scale: 0.95,
                transition: { duration: 0.2, type: "spring" },
              }}
              className="bg-[#3C435C] w-1/12 rounded-r-2xl rounded-l-md shadow-xl flex justify-center items-center"
            >
              <Image
                src={"/plus_icon2.svg"}
                width={24}
                height={24}
                alt="plus icon"
              ></Image>
            </motion.button>
          </div>
          <Reorder.Group
            axis="y"
            values={tasks}
            onReorder={(tasks: Task[]) => {
              setTasks((prev) => {
                save(tasks);
                return tasks;
              });
            }}
            className="mt-12 space-y-4 w-10/12 mx-auto "
          >
            <AnimatePresence>
              {tasks.map((task) => (
                <Reorder.Item
                  variants={taskCardVariants}
                  custom={task.completed ? 1 : -1}
                  initial={"initial"}
                  animate={task.completed ? "completed" : "idle"}
                  whileHover={"hovered"}
                  exit={"exit"}
                  value={task}
                  drag="y"
                  layout
                  key={task.id}
                  className={`w-full relative bg-[#1B1B22] h-fit rounded-2xl p-4 shadow-xl`} //task
                >
                  <p className="text-lg text-white">{task.description}</p>
                  <Progress value={task.progress} />
                  {!task.completed && (
                    <motion.button
                      variants={taskCardButtonVariants}
                      onClick={() => deleteTask(task.id)}
                      className="absolute -left-1/4 top-1/2 active:opacity-100 -translate-y-1/2 active:scale-95 rounded-xl w-16 h-16 border-2 border-pink-500 opacity-10 hover:opacity-100  transition-all flex items-center justify-center"
                    >
                      <Image
                        src={"/plus_icon2.svg"}
                        width={24}
                        height={24}
                        alt="plus icon"
                        className="rotate-45"
                      ></Image>
                    </motion.button>
                  )}
                  {!task.completed && (
                    <motion.button
                      variants={taskCardButtonVariants}
                      onClick={() => completeTask(task.id)}
                      className="absolute -right-1/4 top-1/2 -translate-y-1/2 active:scale-95 rounded-xl w-16 h-16 border-2 border-teal-500 opacity-10 hover:opacity-100 transition-all flex items-center justify-center"
                    >
                      <Image
                        src={"/check.svg"}
                        width={24}
                        height={24}
                        alt="plus icon"
                      ></Image>
                    </motion.button>
                  )}
                  {!task.completed && (
                    <motion.button
                      variants={taskCardButtonVariants}
                      onClick={(e) =>
                        updateTask(e as unknown as MouseEvent, task.id, -5)
                      }
                      className="absolute -left-12 top-1/2 -translate-y-1/2 active:scale-95 rounded-xl w-8 h-8 border-2 border-white-500 opacity-50 hover:opacity-100 transition-all flex items-center justify-center"
                    >
                      <Image
                        src={"/minus.svg"}
                        width={24}
                        height={24}
                        alt="plus icon"
                      ></Image>
                    </motion.button>
                  )}
                  {!task.completed && (
                    <motion.button
                      variants={taskCardButtonVariants}
                      onClick={(e) =>
                        updateTask(e as unknown as MouseEvent, task.id, 5)
                      }
                      className="absolute -right-12 top-1/2 -translate-y-1/2 active:scale-95 rounded-xl w-8 h-8 border-2 border-white-500 opacity-50 hover:opacity-100 transition-all flex items-center justify-center"
                    >
                      <Image
                        src={"/plus_icon2.svg"}
                        width={24}
                        height={24}
                        alt="plus icon"
                      ></Image>
                    </motion.button>
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      </main>
    </>
  );
}
