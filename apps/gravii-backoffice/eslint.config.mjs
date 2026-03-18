import { createNextConfig } from "../../packages/eslint-config/next.mjs";

export default createNextConfig({
  rules: {
    "@next/next/no-page-custom-font": "off"
  }
});
