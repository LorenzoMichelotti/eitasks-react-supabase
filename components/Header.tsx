import Task from "@/models/Task";

export default function Header({
  taskCount,
  completedTaskCount,
}: {
  taskCount: number;
  completedTaskCount: number;
}) {
  return (
    <div>
      <div className="absolute right-24 font-semibold top-12 text-teal-500">
        {completedTaskCount} / {taskCount + completedTaskCount}
      </div>
      <a
        href="https://www.linkedin.com/in/lorenzo-michelotti-b1b4441a7/"
        className="absolute opacity-25 hover:opacity-100 transition-opacity left-24 font-semibold top-12 text-teal-500"
      >
        tasks by @lolo
      </a>
    </div>
  );
}
