import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import {
  createBrowserSupabaseClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { createTheme } from "@nextui-org/react";

const darkTheme = createTheme({
  type: "dark",
});

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabase] = useState(() =>
    createBrowserSupabaseClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    })
  );
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          duration: 2000,
        }}
      />
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <NextUIProvider theme={darkTheme}>
          <Component {...pageProps} />
        </NextUIProvider>
      </SessionContextProvider>
    </>
  );
}
