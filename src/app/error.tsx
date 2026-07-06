"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = ({ error }: { error: Error }) => {
  console.log(error);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      {/* Icon */}
      <div className="mb-6">
        <AlertTriangle className="h-24 w-24 text-red-500" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900">
        Oops! Something went wrong
      </h1>

      {/* Subtitle */}
      <p className="mt-4 max-w-md text-lg text-gray-600">
        We’re having trouble loading this page. Please try again later or go
        back to the homepage.
      </p>

      {/* Error message */}
      {error?.message && (
        <pre className="mt-6 max-w-lg overflow-x-auto rounded-lg bg-red-50 p-4 text-left text-sm text-red-700 shadow-inner">
          {error.message}
        </pre>
      )}

      {/* Button */}
      <Link
        href="/"
        className="mt-8 rounded-2xl bg-red-500 px-6 py-3 text-white shadow-lg transition hover:bg-red-600"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
