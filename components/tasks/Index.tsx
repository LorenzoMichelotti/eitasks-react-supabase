import useTaskStore from "@/hooks/UseTaskStore";
import { getProfileData } from "@/services/supabaseUtils";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import Header from "../Header";
import NavBar from "../Navbar";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function Tasks({ session }: { session: Session }) {
  const { tasks, loadTasks, profile, loadProfile } = useTaskStore((state) => ({
    tasks: state.tasks,
    loadTasks: state.load,
    loadProfile: state.loadProfile,
    profile: state.profile,
  }));

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

  if (user && tasks)
    return (
      <div className="w-11/12 md:w-2/3 lg:3/4 2xl:w-1/2 max-w-[700px] mx-auto my-4 md:my-24 h-full">
        <NavBar supabase={supabase} />
        <Header />
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
    );
  else return null;
}
