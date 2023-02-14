import Task from "@/models/Task";

export default function Header({
  taskCount,
  completedTaskCount,
}: {
  taskCount: number;
  completedTaskCount: number;
}) {
  return (
    <div className="flex flex-col justify-between mb-4">
      <div className="top-12 ml-auto text-black dark:text-gray-500 text-sm">
        {completedTaskCount} / {taskCount + completedTaskCount} completed tasks
      </div>
    </div>
  );
}
