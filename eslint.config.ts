import js from "@eslint/js";
import globals from "globals";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ['**/.vitepress']
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { 
      js 
    }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: globals.browser 
    } 
  },
  { 
    files: ["**/*.md"], 
    plugins: { 
      markdown 
    }, 
    language: "markdown/gfm", 
    extends: [
      "markdown/recommended"
    ] 
  },
]);
