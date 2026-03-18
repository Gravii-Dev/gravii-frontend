import { PrototypeRuntime } from "@/features/hq/shell/prototype-runtime";
import { prototypeTemplate } from "@/features/hq/shell/prototype-template";

export function PrototypeShell() {
  return (
    <PrototypeRuntime
      campaigns={prototypeTemplate.campaigns}
      chatResponses={prototypeTemplate.chatResponses}
      insights={prototypeTemplate.insights}
      pageTitles={prototypeTemplate.pageTitles}
      partners={prototypeTemplate.partners}
      styleContent={prototypeTemplate.styleContent}
    />
  );
}
