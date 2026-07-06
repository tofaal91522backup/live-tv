import Link from "next/link";

export const Row = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 p-2 hover:bg-accent transition text-slate-800 dark:text-slate-300"
  >
    {children}
  </Link>
);
