import { DotsVerticalIcon } from "@radix-ui/react-icons";

export default function ProjectsList() {
  return (
    <div className="bg-brand-dark w-full h-full rounded-xl p-4">
      <h1 className="text-lg font-semibold">Projects</h1>
      <div className="flex flex-col space-y-1 mt-4 max-h-48 overflow-auto">
        <div className="hover:bg-brand-medium group p-2 items-center px-4 flex justify-between rounded-lg">
          <span>Default Project</span>
          <DotsVerticalIcon className="opacity-0 group-hover:opacity-100 transition-opacity"></DotsVerticalIcon>
        </div>
      </div>
    </div>
  );
}
