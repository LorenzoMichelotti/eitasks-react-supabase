import useTaskStore from "@/hooks/UseTaskStore";
import { getProfileData } from "@/services/supabaseUtils";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import BottomNavigation from "../BottomNavigation";
import Header from "../Header";
import NavBar from "../Navbar";
import TaskDetails from "./TaskDetails";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function Tasks({ session }: { session: Session }) {
  const { tasks, loadTasks, profile, loadProfile, activeTask } = useTaskStore(
    (state) => ({
      tasks: state.tasks,
      loadTasks: state.load,
      loadProfile: state.loadProfile,
      profile: state.profile,
      activeTask: state.activeTask,
    })
  );

  const supabase = useSupabaseClient();
  const user = useUser();

  const taskObserver = supabase
    .channel("task-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
        filter: `profileId=eq.${profile?.id}`,
      },
      () => {
        if (profile) loadTasks(profile, supabase);
      }
    )
    .subscribe();

  useEffect(() => {
    console.log("checking login information...");
    if (user) {
      getProfileData(user, supabase, loadProfile, loadTasks);
    }
  }, [session]);

  useEffect(() => {
    return () => {
      supabase.removeChannel(taskObserver);
    };
  }, []);

  const cardVariants = {
    enter: { scale: 0.5, opacity: 0 },
    idle: { scale: 1, opacity: 1 },
    exit: { scale: 1, opacity: 0, y: 50 },
  };

  if (user && tasks)
    return (
      <div className="w-full">
        <NavBar supabase={supabase} />
        <div className="grid grid-cols-1 gap-4 mx-4 lg:grid-cols-2 xl:grid-cols-3">
          {/* <Header /> */}
          {/* CONTENT CARDS */}
          {/* <div className="hidden lg:grid lg:grid-rows-2 xl:grid-rows-1 gap-4"> */}
          <AnimatePresence>
            <div className="hidden lg:flex lg:flex-col gap-4">
              <motion.div
                variants={cardVariants}
                initial="enter"
                animate="idle"
                exit="exit"
                key={"projects"}
                layout
                className="text-white h-full bg-brand-dark rounded-xl p-4"
              >
                Projects placeholder
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
        <div className="flex lg:hidden">
          <div className="pb-60 lg:pb-0"></div>
          <div className="fixed z-10 flex flex-col space-y-4 bottom-0 p-4 pb-12 pt-6 w-full bg-brand-darkest">
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
