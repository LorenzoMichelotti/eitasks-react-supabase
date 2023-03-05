import Head from "next/head";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import Tasks from "@/components/tasks/Index";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  return (
    <>
      <Head>
        <title>eitasks</title>
        <meta name="description" content="A project by Lorenzo Michelotti" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!session ? (
        <div className="w-11/12 md:w-2/3 2xl:w-1/2 max-w-[500px] mx-auto my-4 md:my-24 h-full">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
          />
        </div>
      ) : (
        <Tasks session={session}></Tasks>
      )}
    </>
  );
}
