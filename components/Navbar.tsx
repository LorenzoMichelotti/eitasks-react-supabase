import useTaskStore from "@/hooks/UseTaskStore";
import { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import BottomNavigation from "./BottomNavigation";

export default function NavBar({
  supabase,
}: {
  supabase: SupabaseClient<any, "public", any>;
}) {
  const { profile } = useTaskStore((state) => ({
    profile: state.profile,
  }));
  return (
    <div className="dark:text-white mt-8 mb-4 lg:mb-12">
      <ul className="flex justify-around items-center lg:justify-between lg:mx-8">
        <li className="font-semibold text-[24px] italic">
          <Link href="/">TASKING</Link>
        </li>
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <BottomNavigation></BottomNavigation>
        </div>
        <li className="text-gray-500">
          <button onClick={() => supabase.auth.signOut()}>
            {profile?.username || profile?.email}
          </button>
        </li>
      </ul>
    </div>
  );
}
