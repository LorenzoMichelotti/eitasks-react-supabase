import useTaskStore from "@/hooks/UseTaskStore";
import { getProfileData } from "@/services/supabaseUtils";
// import {
//   GitHubLogoIcon,
//   LinkedInLogoIcon,
//   MagnifyingGlassIcon,
// } from "@radix-ui/react-icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
// import BottomNavigation from "../BottomNavigation";
import NavBar from "../Navbar";
// import ProjectsList from "./ProjectsPanel/ProjectsList";
import TaskDetails from "./TaskDetailsPanel/TaskDetails";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { Pagination } from "@nextui-org/react";
// import Task from "../../models/Task";
import Footer from "../Footer";
// import DetailsPlaceholder from "./TaskDetailsPanel/DetailsPlaceholder";

export default function Tasks({ session }: { session: Session }) {
  const {
    tasks,
    loadTasks,
    profile,
    loadProfile,
    activeTask,
    taskCount,
    setActiveTask,
  } = useTaskStore((state) => ({
    tasks: state.tasks,
    taskCount: state.taskCount,
    loadTasks: state.load,
    loadProfile: state.loadProfile,
    profile: state.profile,
    activeTask: state.activeTask,
    setActiveTask: state.setActiveTask,
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
    console.log("loading tasks because the profile was loaded");
    loadTasks(profile, supabase, 1, 5);
  }, [profile]);

  function handleSetPage(page: number) {
    if (!profile) return;
    loadTasks(profile, supabase, page, 5);
  }

  const cardVariants = {
    enter: { scale: 0.5, opacity: 0 },
    idle: { scale: 1, opacity: 1 },
    exit: { scale: 1, opacity: 0, y: 50 },
  };

  if (user && tasks)
    return (
      <div className="relative w-full -mt-8 pt-8">
        <NavBar supabase={supabase} />
        <div className="grid grid-cols-1 pb-4 gap-4 mx-4 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            <div className="hidden lg:flex lg:flex-col gap-4">
              {/* <motion.div
                variants={cardVariants}
                initial="enter"
                animate="idle"
                exit="exit"
                layout
                className="text-white h-full"
              >
                <ProjectsList />
              </motion.div> */}
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
          <div className="w-full z-0 pb-4 lg:pb-12 flex justify-center">
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
            <AnimatePresence>
              {activeTask && (
                <motion.div
                  initial={{ backdropFilter: "blur(0px)" }}
                  animate={{ backdropFilter: "blur(16px)" }}
                  exit={{ backdropFilter: "blur(0px)" }}
                  className="fixed top-1/2 -translate-y-1/2 left-0 flex flex-col items-center justify-end w-full h-full px-4 backdrop-blur-xl"
                >
                  <div className="overflow-auto h-full w-full md:w-2/3 mt-4 rounded-lg">
                    <TaskDetails />
                  </div>
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={() => setActiveTask()}
                    className="mt-4 mb-12 py-4 lg:py-12 w-full rounded-lg text-2xl text-brand-lightest bg-brand-medium"
                  >
                    CLOSE
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            <TaskForm></TaskForm>
            {/* <BottomNavigation></BottomNavigation> */}
          </div>
        </div>
        <Footer></Footer>
      </div>
    );
  else return null;
}
