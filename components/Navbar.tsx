import Link from "next/link";

export default function NavBar() {
  return (
    <div className="dark:text-white mb-12">
      <ul className="flex justify-between">
        <li className="font-semibold">
          <Link href="/">lolo-tasks</Link>
        </li>
        <li className="text-gray-500">
          <Link href="/">tasks</Link>
        </li>
      </ul>
    </div>
  );
}
