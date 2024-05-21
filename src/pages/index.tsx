import { useState, useRef } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import MessageMode from "@/components/MessageMode";

export default function Home() {
  const [messageMode, setMessageMode] = useState<boolean>(true);
  const fileInputRef = useRef<any>(null);

  const handleFileChange = () => {
    const file = fileInputRef?.current?.files[0];
  };

  return (
    <>
      {messageMode ? (
        <MessageMode />
      ) : (
        <Layout>
          <div className="w-full flex p-2 flex-col">
            <header className="flex flex-row justify-end items-end">
              <button>Model</button>
              <button></button>
            </header>
            <main className="flex flex-col justify-center items-center w-full">
              <p className="mt-6 font-medium text-gray-900 text-5xl">
                Welcome Back
              </p>
              <div className="mt-10 flex w-1/2 flex-row p-2 rounded border">
                <input className="flex-1" />
                <button className="bg-[#1A2F59] text-white text-sm font-medium hover:opacity-90 rounded py-1.5 px-2.5">
                  Start Chat
                </button>
              </div>
            </main>
          </div>
        </Layout>
      )}
    </>
  );
}
