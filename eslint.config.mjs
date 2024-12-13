import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/build",
        "**/.eslintrc.json",
        "**/node_modules/",
        "**/.scannerwork/",
        "**/test",
        "**/sonar-project.properties",
    ],
}, ...compat.extends("eslint:recommended", "plugin:prettier/recommended"), {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.module,
        },

        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        "no-console": "warn",

        "prettier/prettier": ["error", {}, {
            usePrettierrc: true,
        }],

        "no-duplicate-imports": "warn",
        "valid-typeof": "error",
        eqeqeq: "warn",
        "no-delete-var": "error",
        "no-empty-function": "warn",
        "no-var": "error",
    },
}];