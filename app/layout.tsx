import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Wayfare | Group Trip Planning",
  description: "Plan, vote, map, schedule, and split costs for group trips in one shared workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
