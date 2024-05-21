import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import Image from 'next/image';


interface MessageProps {
  type: string;
  message: string;
}

export default function MessageMode() {
  const [text, setText] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState<any>("");
  const [endReached, setEndReached] = useState<boolean>(false);
  const [messages, setMessages] = useState<any>([]);
  const [latestImage, setLatestImage] = useState<string>(""); // Store the latest image value
  const [selectedOption, setSelectedOption] = useState<string>("Phi"); // Selected option in dropdown
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (endReached) {
      setMessages((prevMessages: any) => [
        ...prevMessages,
        { type: "ai", message: currentMessage },
      ]);
      setCurrentMessage("");
      setEndReached(false);
    }
  }, [endReached]);

  useEffect(() => {
    //@ts-ignore
    window.electronAPI.on("receiveTokens", (event, arg) => {
      setCurrentMessage(arg);
    });

    //@ts-ignore
    window.electronAPI.on("endTokens", (event, arg) => {
      setEndReached(true);
    });

    //@ts-ignore
    window.electronAPI.on("setLatestImage", (event, image) => {
      setLatestImage(image); // Set the latest image value received from the main process
    });
  }, []);

    // Dropdown options
    const options = [
      { value: "Phi", label: "Phi" },
      { value: "Gemma", label: "Gemma" },
      { value: "OpenAI", label: "OpenAI" },
    ];
  
    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOption(event.target.value);
    };

  return (
    <div
      className="h-[100vh]"
      style={{ background: "radial-gradient(#ffffff, transparent)" }}
    >
            {/* Dropdown */}
            <div className="flex justify-center items-center">
      {/* Dropdown */}
      <select
        value={selectedOption}
        onChange={handleOptionChange}
        className="rounded-md border border-gray-300 pr-8 bg-white text-sm leading-5 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Render the selected image */}
      <div className="ml-2">
        <Image
          src={`/images/${selectedOption}.png`} // Use the selected value to change the image source
          height={24}
          width={24}
          alt="Selected Image"
        />
      </div>
    </div>


      <div
        style={{
          height: "calc(100vh - 54px)",
          overflowY: "auto",
        }}
        className="w-full flex flex-col justify-between items-between"
      >
        <div
          className="flex-1 flex flex-col p-2 space-y-1.5"
          style={{
            height: "calc(100vh - 54px)",
            overflowY: "auto",
            scrollBehavior: "auto", // Auto scroll to the bottom
          }}
        >
          {messages.map((value: any, index: number) => {
            return (
              <Message key={index} type={value.type} message={value.message} />
            );
          })}
          {currentMessage.length ? (
            <Message type="ai" message={selectedOption+"$!$"+currentMessage} />
          ) : (
            <></>
          )}
          <div ref={messagesEndRef} />
        </div>
        <br></br>
        <div className="flex flex-row space-x-3"></div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Append the latest image value to the beginning of the text
            const messageToSend = selectedOption + '$!$' + text;
            console.log(messageToSend);
            //@ts-ignore
            window.electronAPI.send("sendChat", messageToSend);
            setMessages((prevMessages: any) => [
              ...prevMessages,
              { type: "user", message: text },
            ]);
            setText("");
          }}
          className="fixed bottom-0 left-0 w-full p-2 flex flex-row space-x-3"
        >
          <div className="w-full p-1 bg-white flex rounded-full border flex-row justify-between items-between space-x-3">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              className="text-xs bg-gray-300 rounded-full font-medium text-[#333333] flex-1 border-none focus:outline-none focus:ring-0"
              placeholder="Say something"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
