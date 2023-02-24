import useTaskStore from "@/hooks/UseTaskStore";
import { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function NavBar({
  supabase,
}: {
  supabase: SupabaseClient<any, "public", any>;
}) {
  const { profile } = useTaskStore((state) => ({
    profile: state.profile,
  }));
  return (
    <div className="dark:text-white mb-12">
      <ul className="flex justify-between">
        <li className="font-semibold">
          <Link href="/">lolo-tasks</Link>
        </li>
        <li className="text-gray-500">
          <button onClick={() => supabase.auth.signOut()}>
            {profile?.username || profile?.email}
          </button>
        </li>
      </ul>
    </div>
  );
}
