// ESLint flat config (requires PLAN.md Phase 2 devDependencies: eslint, eslint-plugin-vue, eslint-config-prettier).
import vue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist/**", "node_modules/**", "public/**"] },
  ...vue.configs["flat/recommended"],
  prettier,
  {
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
    },
  },
];
