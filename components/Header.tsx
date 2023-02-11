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
      <div className="top-12 ml-auto opacity-50 text-black dark:text-white">
        {completedTaskCount} / {taskCount + completedTaskCount} completed tasks
      </div>
    </div>
  );
}
