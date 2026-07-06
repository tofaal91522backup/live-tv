import { Toaster } from "sonner";
import QueryProvider from "./query-provider";

import { ThemeProvider } from "./theme-provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
