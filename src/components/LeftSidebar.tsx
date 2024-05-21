import { useState, useEffect } from "react";

function NoChats() {
  return <div></div>;
}

function ChatComponent() {
  return <div></div>;
}

function ModelCompoennt() {
  return <div></div>;
}

export default function LeftSidebar() {
  const [previousChats, setPreviousChats] = useState([]);

  return (
    <div className="w-[280px] px-2 py-3 bg-[#F7F7F7] h-full flex flex-col border-r">
      <section className="flex flex-col space-y-2">
        <p className="text-xs font-medium text-[#363636]">Previous Chats</p>
        <div className="flex flex-col h-[400px]"></div>
      </section>
      <section></section>
    </div>
  );
}
