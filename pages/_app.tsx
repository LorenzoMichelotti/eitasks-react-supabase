import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AnimatePresence>
        <Toaster />
      </AnimatePresence>
      <Component {...pageProps} />
    </>
  );
}
