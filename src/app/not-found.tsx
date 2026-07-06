import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-6 4h12a2 2 0 002-2V8a2 2 0 
          00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 
          0012.586 4H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>

      {/* Title */}
      <h1 className="mt-6 text-5xl font-extrabold text-gray-800 dark:text-gray-100">
        404
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Sorry, the page you’re looking for doesn’t exist.
      </p>

      {/* Button */}
      <Link
        href="/"
        className={buttonVariants({ variant: "outline", size: "lg" }) + " mt-6"}
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
