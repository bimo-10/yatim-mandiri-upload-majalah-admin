import LoginComponent from "./components/LoginComponent";
import React from "react";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function page() {
  return (
    <>
      <main className="flex justify-center items-center min-h-screen">
        <LoginComponent />
      </main>
    </>
  );
}
