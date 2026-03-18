import type { ReactNode } from "react";

import { PrototypeChatPanel } from "@/features/hq/components/chat-panel";
import { PrototypeMainHeader } from "@/features/hq/components/main-header";
import { PrototypeSidebar } from "@/features/hq/components/sidebar";

type PrototypeAppShellProps = {
  children: ReactNode;
};

export function PrototypeAppShell({ children }: Readonly<PrototypeAppShellProps>) {
  return (
    <>
      <div className="grain" />
      <div className="app">
        <PrototypeSidebar />
        <PrototypeChatPanel />
        <div className="main">
          <PrototypeMainHeader />
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
}
