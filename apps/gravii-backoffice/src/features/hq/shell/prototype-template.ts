import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";

import type { Campaign, DashboardPageId, Partner } from "@/features/hq/types";

type PrototypeTemplate = {
  campaigns: Campaign[];
  chatResponses: Record<string, string>;
  insights: Record<string, string[]>;
  pageTitles: Record<DashboardPageId, string>;
  partners: Partner[];
  scriptContent: string;
  styleContent: string;
};

type PrototypeSeed = {
  campaigns: Campaign[];
  pageTitles: Record<DashboardPageId, string>;
  partners: Partner[];
};

type PrototypeChatSeed = {
  chatResponses: Record<string, string>;
  insights: Record<string, string[]>;
};

function extractSection(source: string, pattern: RegExp, label: string) {
  const match = source.match(pattern);

  if (!match || !match[1]) {
    throw new Error(`Unable to extract ${label} from gravii-hq_v2.html`);
  }

  return match[1].trim();
}

function extractPrototypeSeed(scriptContent: string): PrototypeSeed {
  const prelude = extractSection(
    scriptContent,
    /^([\s\S]*?)function navTo\(el\)\{/,
    "prototype data"
  );
  const sandbox: { EXPORTED?: PrototypeSeed } = {};

  runInNewContext(
    `${prelude}
globalThis.EXPORTED = {
  partners: PARTNERS,
  campaigns: CAMPAIGNS,
  pageTitles
};`,
    sandbox
  );

  if (!sandbox.EXPORTED) {
    throw new Error("Unable to evaluate prototype data from gravii-hq_v2.html");
  }

  return sandbox.EXPORTED;
}

function extractPrototypeChatSeed(scriptContent: string): PrototypeChatSeed {
  const chatBlock = extractSection(
    scriptContent,
    /(const INSIGHTS = [\s\S]*?)let chatOpen = false;/,
    "prototype chat data"
  );
  const sandbox: { EXPORTED?: PrototypeChatSeed } = {};

  runInNewContext(
    `${chatBlock}
globalThis.EXPORTED = {
  insights: INSIGHTS,
  chatResponses: Object.fromEntries(
    Object.entries(CHAT_RESPONSES).map(([key, value]) => [key, value()])
  )
};`,
    sandbox
  );

  if (!sandbox.EXPORTED) {
    throw new Error("Unable to evaluate prototype chat data from gravii-hq_v2.html");
  }

  return sandbox.EXPORTED;
}

function loadPrototypeTemplate(): PrototypeTemplate {
  const htmlPath = join(process.cwd(), "public", "gravii-hq_v2.html");
  const source = readFileSync(htmlPath, "utf8");
  const scriptContent = extractSection(source, /<script>([\s\S]*?)<\/script>\s*<\/body>/, "script");
  const seed = extractPrototypeSeed(scriptContent);
  const chatSeed = extractPrototypeChatSeed(scriptContent);

  return {
    styleContent: extractSection(source, /<style>([\s\S]*?)<\/style>/, "style"),
    scriptContent,
    partners: seed.partners,
    campaigns: seed.campaigns,
    pageTitles: seed.pageTitles,
    insights: chatSeed.insights,
    chatResponses: chatSeed.chatResponses
  };
}

export const prototypeTemplate = loadPrototypeTemplate();
