import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import Image from "next/image";

interface Props {
  type: string;
  message: string;
}

function ModelMessage({ message }: Props) {
  const [value, setValue] = useState<any>([]);
  let modelGemma = false;
  let modelOpenai = false;
  let modelPhi = false;

  if (message) {
    const parts = message.split('$!$');
    const second_parts = parts[1].split('^@^');
    const model = String(second_parts[0].slice(0, -1)).toLowerCase();
    let speed = String(second_parts[1]);
    const regex = /^(\d+\.\d{0,2})|\d+/;
    let result = speed.match(regex);
    speed = result ? result[0] : 'Invalid number';
    if (model === "phi") {
      modelPhi = true;
    } else if (model == "openai") {
      modelOpenai = true;
    } else {
      modelGemma = true;
    }
    const updatedMessage = parts[0]; // Store the updated message in a different variable*/

    return (
      <div className="flex flex-col space-y-1 px-2.5 py-2 border bg-gray-100 rounded-xl">
        <div className="flex flex-row space-x-1.5">
          <Image
            src={`/images/${modelGemma ? "Gemma" : modelOpenai ? "OpenAI" : "Phi"}.png`}
            height={16}
            width={16}
            className="my-auto"
            alt="mistral logo"
          />
          <p className="text-xs font-semibold text-[#363636]">
            {modelGemma ? "Gemma" : modelOpenai ? "GPT-4o" : "Phi-3 Multimodal"}
          </p>
        </div>
        <Markdown
  options={{
    overrides: {
      b: {
        component: ({ children, ...props }) => <strong {...props}>{children}</strong>,
      },
      i: {
        component: ({ children, ...props }) => <em {...props}>{children}</em>,
      },
      code: {
        component: ({ children, ...props }) => (
          <pre {...props} className="language-python">
            <code className="text-[10px] break-all text-[#333333]">
              {children}
            </code>
          </pre>
        ),
      },
      ul: {
        component: ({ children, ...props }) => (
          <ul {...props} className="text-xs ml-5 list-disc mt-1 text-[#333333]">
            {children}
          </ul>
        ),
      },
      li: {
        component: ({ children, ...props }) => (
          <li {...props} className="text-sm mt-0.5 text-[#333333]">
            {children}
          </li>
        ),
      },
      p: {
        component: ({ children, ...props }) => (
          <p {...props} className="text-xs mt-2.5 text-[#333333]">
            {children}
          </p>
        ),
      },
      h1: {
        component: ({ children, ...props }) => (
          <h1 {...props} className="text-sm mt-3 font-bold text-[#333333]">
            {children}
          </h1>
        ),
      },
    },
  }}
>
          {updatedMessage}
        </Markdown>
        <div className="mt-2 flex flex-row justify-between items-center w-full">
    <button className="flex flex-row space-x-1 py-1 px-2 rounded hover:bg-gray-300">
        <svg
            width="10"
            height="10"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="my-auto"
        >
            <path
                d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
            ></path>
        </svg>
        <p className="text-[10px]">Copy</p>
    </button>
    <p className="text-[10px] font-mono">Inference speed: {speed} tokens/sec</p>
</div>

      </div>
    );
  }
}

function UserMessage({ message }: Props) {
  return (
    <div className="flex flex-col space-y-0.5 px-2.5 py-2.5 border bg-gray-100 rounded-xl">
      <p className="text-xs font-semibold text-[#363636]">Me</p>
      <p className="text-sm text-[#333333] font-light break-all">{message}</p>
    </div>
  );
}

export default function Message({ type, message }: Props) {
  return (
    <>
      {type == "user" ? (
        <UserMessage type={type} message={message} />
      ) : (
        <ModelMessage type={type} message={message} />
      )}
    </>
  );
}