import { SettingsContent } from "./_components/SettingsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Personal Librarian",
  description: "Configure your reading preferences and manage app settings",
};

export default function SettingsPage() {
  return <SettingsContent />;
}