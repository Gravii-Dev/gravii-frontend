import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const defaultIgnores = [
  "node_modules/**",
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts"
];

export function createNextConfig({
  typescript = true,
  ignores = [],
  rules = {}
} = {}) {
  const config = [...nextCoreWebVitals];

  if (typescript) {
    config.push(...nextTypeScript);
  }

  if (Object.keys(rules).length > 0) {
    config.push({ rules });
  }

  config.push({
    ignores: [...defaultIgnores, ...ignores]
  });

  return config;
}
