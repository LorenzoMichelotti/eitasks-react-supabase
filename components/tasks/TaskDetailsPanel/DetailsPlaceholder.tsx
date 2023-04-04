import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function DetailsPlaceholder() {
  return (
    <div className="border-2 w-full rounded-lg border-dashed text-gray-600 border-brand-medium flex flex-col justify-center items-center">
      <MagnifyingGlassIcon className="mb-4 w-16 h-16"></MagnifyingGlassIcon>
      <h3>Click on a task to open the details panel</h3>
    </div>
  );
}
