import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

type CheckResult = {
  label: string;
  failures: string[];
};

const root = process.cwd();

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "output",
]);

const sourceExtensions = new Set([
  ".css",
  ".scss",
  ".ts",
  ".tsx",
  ".mdx",
]);

const requiredFiles = [
  "docs/codex-harness.md",
  "docs/design-system/ai-ready-design-system.md",
  "docs/design-system/component-inventory.md",
  "docs/design-system/figma-code-handoff.md",
  "packages/README.md",
  "packages/brand-logo-3d/README.md",
  "packages/brand-logo-3d/src/index.tsx",
  "packages/brand-tokens/README.md",
];

const deprecatedLogoDirectories = [
  "apps/gravii-user-app/src/components/ui/gravii-logo-3d",
  "apps/gravii-user-landing/components/effects/gravii-logo-3d",
];

const deprecatedLogoImportFragments = [
  "@/components/ui/gravii-logo-3d",
  "@/components/effects/gravii-logo-3d",
  "components/ui/gravii-logo-3d",
  "components/effects/gravii-logo-3d",
];

function absolutePath(relativePath: string): string {
  return path.join(root, relativePath);
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function readText(relativePath: string): string {
  return readFileSync(absolutePath(relativePath), "utf8");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function listFiles(relativeDirectory: string): string[] {
  const directory = absolutePath(relativeDirectory);

  if (!existsSync(directory)) {
    return [];
  }

  const stats = statSync(directory);

  if (!stats.isDirectory()) {
    return [normalizePath(relativeDirectory)];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const childPath = path.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(childPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(normalizePath(childPath));
    }
  }

  return files;
}

function result(label: string, failures: string[]): CheckResult {
  return { label, failures };
}

function checkRequiredFiles(): CheckResult {
  return result(
    "canonical design-system files exist",
    requiredFiles.filter((filePath) => !existsSync(absolutePath(filePath))),
  );
}

function checkRootPackageScript(): CheckResult {
  const parsed: unknown = JSON.parse(readText("package.json"));

  if (!isRecord(parsed) || !isRecord(parsed.scripts)) {
    return result("root package script is registered", [
      "package.json must contain a scripts object",
    ]);
  }

  const script = parsed.scripts["check:design-system"];

  if (script !== "bun ./scripts/check-design-system-harness.ts") {
    return result("root package script is registered", [
      'package.json scripts.check:design-system must be "bun ./scripts/check-design-system-harness.ts"',
    ]);
  }

  return result("root package script is registered", []);
}

function checkDeprecatedLogoDirectories(): CheckResult {
  const failures = deprecatedLogoDirectories.flatMap((directory) => {
    const files = listFiles(directory);

    if (files.length === 0) {
      return [];
    }

    return files.map((filePath) => `${filePath} should not exist; use @gravii/brand-logo-3d`);
  });

  return result("deprecated app-local 3D logo implementations are absent", failures);
}

function checkDeprecatedLogoImports(): CheckResult {
  const sourceFiles = ["apps", "packages"]
    .flatMap((directory) => listFiles(directory))
    .filter((filePath) => sourceExtensions.has(path.extname(filePath)));

  const failures: string[] = [];

  for (const filePath of sourceFiles) {
    const text = readText(filePath);

    for (const fragment of deprecatedLogoImportFragments) {
      if (text.includes(fragment)) {
        failures.push(`${filePath} references deprecated logo path: ${fragment}`);
      }
    }
  }

  return result("deprecated 3D logo imports are absent", failures);
}

function checkCanonicalDocsMentionSharedLogo(): CheckResult {
  const filesToCheck = [
    "docs/design-system/ai-ready-design-system.md",
    "docs/design-system/component-inventory.md",
    "docs/design-system/figma-code-handoff.md",
    "packages/README.md",
  ];

  const failures = filesToCheck.filter((filePath) => {
    return !readText(filePath).includes("@gravii/brand-logo-3d");
  });

  return result("canonical docs reference @gravii/brand-logo-3d", failures);
}

function checkCodexHarnessMentionsDesignSystemFlow(): CheckResult {
  const text = readText("docs/codex-harness.md");
  const requiredMentions = [
    "docs/design-system/ai-ready-design-system.md",
    "docs/design-system/component-inventory.md",
    "docs/design-system/figma-code-handoff.md",
    "bun run check:design-system",
  ];

  return result(
    "codex harness documents the design-system flow",
    requiredMentions.filter((mention) => !text.includes(mention)),
  );
}

const checks = [
  checkRequiredFiles,
  checkRootPackageScript,
  checkDeprecatedLogoDirectories,
  checkDeprecatedLogoImports,
  checkCanonicalDocsMentionSharedLogo,
  checkCodexHarnessMentionsDesignSystemFlow,
];

const results = checks.map((check) => check());
const failedResults = results.filter((check) => check.failures.length > 0);

for (const check of results) {
  if (check.failures.length === 0) {
    console.log(`[design-system-harness] OK ${check.label}`);
    continue;
  }

  console.error(`[design-system-harness] FAIL ${check.label}`);

  for (const failure of check.failures) {
    console.error(`  - ${failure}`);
  }
}

if (failedResults.length > 0) {
  process.exit(1);
}

console.log("[design-system-harness] All checks passed.");
