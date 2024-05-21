import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

interface Props {
  children?: JSX.Element;
}

export default function Layout({ children }: Props) {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-row">
      <LeftSidebar />
      {children}
      <RightSidebar />
    </div>
  );
}
