import Link from "next/link";
import { FiArrowLeftCircle } from "react-icons/fi";

interface BreadcrumbProps {
  pageName: string;
  parentPage?: string;
}

const Breadcrumb = ({ pageName, parentPage = "Dashboard" }: BreadcrumbProps) => {
  return (
    <div className="mb-2 mx-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white flex items-center gap-2">
        <Link href={`/dashboard`}>
          <FiArrowLeftCircle className="text-gray-700" size={30} />
        </Link>
        <span> / {pageName}</span>
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li className="text-title-xm font-semibold text-black dark:text-white">
            <Link className="font-medium" href="/">
              {parentPage} /
            </Link>
          </li>
          <li className="font-medium text-primary dark:text-blue-800">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;