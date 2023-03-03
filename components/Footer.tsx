import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="text-black hidden lg:flex flex-col text-[12px] dark:text-white w-full justify-center mb-12 mt-24 items-center opacity-50 hover:opacity-100">
      <div className="flex justify-center">
        <a
          className="text-black dark:text-white hover:text-blue-500 hover:underline flex space-x-1 items-center"
          href="https://www.linkedin.com/in/lorenzo-michelotti-b1b4441a7/"
        >
          <LinkedInLogoIcon></LinkedInLogoIcon>
          <span className="whitespace-nowrap flex sm:hidden">LoMichelotti</span>
          <span className="whitespace-nowrap hidden sm:flex">
            Lorenzo Michelotti
          </span>
        </a>
        <a
          className="text-black dark:text-white ml-4 hover:text-blue-500 hover:underline flex space-x-1 items-center"
          href="https://github.com/LorenzoMichelotti/lolo-tasks"
        >
          <GitHubLogoIcon></GitHubLogoIcon>
          <span className="whitespace-nowrap flex sm:hidden">LoMichelotti</span>
          <span className="whitespace-nowrap hidden sm:flex">
            Lorenzo Michelotti
          </span>
        </a>
      </div>
    </footer>
  );
}
