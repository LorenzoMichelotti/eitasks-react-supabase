import useTaskStore from "@/hooks/UseTaskStore";
import { getProfileData } from "@/services/supabaseUtils";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import BottomNavigation from "../BottomNavigation";
import NavBar from "../Navbar";
import ProjectsList from "./ProjectsPanel/ProjectsList";
import TaskDetails from "./TaskDetailsPanel/TaskDetails";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { Pagination } from "@nextui-org/react";
import Task from "../../models/Task";

export default function Tasks({ session }: { session: Session }) {
  const { tasks, loadTasks, profile, loadProfile, activeTask, taskCount } =
    useTaskStore((state) => ({
      tasks: state.tasks,
      taskCount: state.taskCount,
      loadTasks: state.load,
      loadProfile: state.loadProfile,
      profile: state.profile,
      activeTask: state.activeTask,
    }));

  const [currentPage, setCurrentPage] = useState(1);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    console.log("checking login information...");
    if (user) {
      getProfileData(user, supabase, loadProfile);
    }
  }, [session]);

  useEffect(() => {
    if (!profile) return;
    const insertTasksObserver = supabase
      .channel("tasks-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `profileId=eq.${profile.id}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.errors || !payload.new) return;
          const updatedTask = payload.new as Task;
          if (!updatedTask.parentTaskId && payload.eventType === "INSERT") {
            console.log("going to page 1.");
            if (currentPage === 1) loadTasks(profile, supabase, 1, 5);
            else setCurrentPage(1);
          } else {
            console.log("staying on the same page.", currentPage);
            return loadTasks(profile, supabase, currentPage, 5);
          }
        }
      )
      .subscribe();
    return () => {
      insertTasksObserver.unsubscribe();
    };
  }, [profile, currentPage]);

  useEffect(() => {
    if (!profile) return;
    console.log("loading tasks because the page number changed");
    loadTasks(profile, supabase, currentPage, 5);
  }, [currentPage, profile]);

  function handleSetPage(page: number) {
    setCurrentPage(page);
  }

  const cardVariants = {
    enter: { scale: 0.5, opacity: 0 },
    idle: { scale: 1, opacity: 1 },
    exit: { scale: 1, opacity: 0, y: 50 },
  };

  if (user && tasks)
    return (
      <div className="w-full">
        <NavBar supabase={supabase} />
        <div className="grid grid-cols-1 pb-4 gap-4 mx-4 lg:grid-cols-2 xl:grid-cols-3">
          {/* CONTENT CARDS */}
          <AnimatePresence>
            <div className="hidden lg:flex lg:flex-col gap-4">
              <motion.div
                variants={cardVariants}
                initial="enter"
                animate="idle"
                exit="exit"
                layout
                className="text-white h-full"
              >
                <ProjectsList />
              </motion.div>
              {activeTask && (
                <motion.div
                  variants={cardVariants}
                  initial="enter"
                  animate="idle"
                  exit="exit"
                  key={"task-details-mobile"}
                  layout
                  className="hidden h-full lg:flex xl:hidden"
                >
                  <TaskDetails />
                </motion.div>
              )}
            </div>
          </AnimatePresence>
          <TaskList></TaskList>
          <AnimatePresence>
            {activeTask && (
              <motion.div
                variants={cardVariants}
                initial="enter"
                animate="idle"
                exit="exit"
                key={"task-details-desktop"}
                layout
                className="hidden lg:hidden xl:flex"
              >
                <TaskDetails />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-1 pb-4 gap-4 mx-4 lg:grid-cols-2 xl:grid-cols-3">
          <div></div>
          <div className="w-full z-0 pb-12 flex justify-center">
            <Pagination
              onChange={handleSetPage}
              page={currentPage}
              total={Math.ceil(taskCount / 5)}
              initialPage={currentPage}
            />
          </div>
        </div>

        <div className="flex z-10 lg:hidden">
          <div className="pb-60 lg:pb-0"></div>
          <div className="fixed flex flex-col space-y-4 bottom-0 p-4 pb-12 pt-6 w-full bg-brand-darkest">
            <TaskForm></TaskForm>
            <BottomNavigation></BottomNavigation>
          </div>
        </div>

        <footer className="text-black hidden lg:flex flex-col text-[12px] dark:text-white w-full justify-center mb-12 mt-24 items-center opacity-50 hover:opacity-100">
          <div className="flex justify-center">
            <a
              className="text-black dark:text-white hover:text-blue-500 hover:underline flex space-x-1 items-center"
              href="https://www.linkedin.com/in/lorenzo-michelotti-b1b4441a7/"
            >
              <LinkedInLogoIcon></LinkedInLogoIcon>
              <span className="whitespace-nowrap flex sm:hidden">
                LoMichelotti
              </span>
              <span className="whitespace-nowrap hidden sm:flex">
                Lorenzo Michelotti
              </span>
            </a>
            <a
              className="text-black dark:text-white ml-4 hover:text-blue-500 hover:underline flex space-x-1 items-center"
              href="https://github.com/LorenzoMichelotti/lolo-tasks"
            >
              <GitHubLogoIcon></GitHubLogoIcon>
              <span className="whitespace-nowrap flex sm:hidden">
                LoMichelotti
              </span>
              <span className="whitespace-nowrap hidden sm:flex">
                Lorenzo Michelotti
              </span>
            </a>
          </div>
        </footer>
      </div>
    );
  else return null;
}
