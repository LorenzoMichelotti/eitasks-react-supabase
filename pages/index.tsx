import Header from "@/components/Header";
import NavBar from "@/components/Navbar";
import Head from "next/head";
import { useEffect } from "react";
import useTaskStore from "@/hooks/UseTaskStore";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import { LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Tasks() {
  const tasks = useTaskStore((state) => state.tasks);
  const loadTasks = useTaskStore((state) => state.load);

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <Head>
        <title>Tasks 2.0</title>
        <meta name="description" content="A project by Lorenzo Michelotti" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-11/12 md:w-2/3 2xl:w-1/2 mx-auto my-4 md:my-24 h-full">
        <NavBar />
        <Header
          completedTaskCount={tasks.filter((t) => t.completed).length}
          taskCount={tasks.length}
        />
        <TaskForm></TaskForm>
        <TaskList></TaskList>
        <footer className="text-black dark:text-white w-full justify-center my-56 flex items-center space-x-4 opacity-50 hover:opacity-100">
          <a
            className="text-black dark:text-white hover:text-blue-500 hover:underline flex space-x-1 items-center"
            href="https://www.linkedin.com/in/lorenzo-michelotti-b1b4441a7/"
          >
            <LinkedInLogoIcon></LinkedInLogoIcon>
            <span>Lorenzo Michelotti</span>
          </a>
          <span>|</span>
          <a
            className="text-black dark:text-white hover:text-blue-500 hover:underline flex space-x-1 items-center"
            href="https://github.com/LorenzoMichelotti/lolo-tasks"
          >
            <GitHubLogoIcon></GitHubLogoIcon>
            <span>Lorenzo Michelotti</span>
          </a>
        </footer>
      </div>
    </>
  );
}
