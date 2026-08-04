import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 p-4 bg-gray-950 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
