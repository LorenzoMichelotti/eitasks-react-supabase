import Image from "next/image";

export default function BottomNavigation() {
  return (
    <nav className="w-full bg-brand-darkest">
      <ul className="flex space-x-2 justify-around text-brand-lightest">
        <li>
          <button className="py-2 px-6 rounded-lg hover:bg-brand-dark">
            <Image
              src={"/assets/bar_chart.svg"}
              width={42}
              height={42}
              alt="plus icon"
              className="block lg:hidden aspect-auto"
            ></Image>
            <Image
              src={"/assets/bar_chart.svg"}
              width={24}
              height={24}
              alt="plus icon"
              className="hidden aspect-auto lg:block"
            ></Image>
          </button>
        </li>
        <li>
          <button className="py-2 px-6 rounded-lg hover:bg-brand-dark">
            <Image
              src={"/assets/library_books.svg"}
              width={42}
              height={42}
              alt="plus icon"
              className="block lg:hidden aspect-auto"
            ></Image>
            <Image
              src={"/assets/library_books.svg"}
              width={24}
              height={24}
              alt="plus icon"
              className="hidden aspect-auto lg:block"
            ></Image>
          </button>
        </li>
        <li>
          <button className="py-2 px-6 rounded-lg hover:bg-brand-dark">
            <Image
              src={"/assets/home.svg"}
              width={42}
              height={42}
              alt="plus icon"
              className="block lg:hidden aspect-auto"
            ></Image>
            <Image
              src={"/assets/home.svg"}
              width={24}
              height={24}
              alt="plus icon"
              className="hidden aspect-auto lg:block"
            ></Image>
          </button>
        </li>
        <li>
          <button className="py-2 px-6 rounded-lg hover:bg-brand-dark">
            <Image
              src={"/assets/person.svg"}
              width={42}
              height={42}
              alt="plus icon"
              className="block lg:hidden aspect-auto"
            ></Image>
            <Image
              src={"/assets/person.svg"}
              width={24}
              height={24}
              alt="plus icon"
              className="hidden aspect-auto lg:block"
            ></Image>
          </button>
        </li>
      </ul>
    </nav>
  );
}
