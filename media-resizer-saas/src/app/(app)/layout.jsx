"use client";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

function AppLayout({ children }) {
  return (
    <>
      <Header/>
      {children}
      <Toaster />
    </>
  );
}

export default AppLayout;
