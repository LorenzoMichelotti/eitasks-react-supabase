import useTaskStore from "@/hooks/UseTaskStore";

export default function Header() {
  const tasks = useTaskStore((state) => state.tasks);
  return (
    <div className="flex flex-col justify-between mb-4">
      <div className="top-12 ml-auto text-black dark:text-gray-500 text-sm">
        {tasks.filter((t) => t.completed).length} / {tasks.length} completed
        tasks
      </div>
    </div>
  );
}
