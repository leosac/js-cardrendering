const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
        globals: {
            ...globals.node,
            requestAnimationFrame: "readonly",
        },

        sourceType: "module",
        ecmaVersion: 10,

        parserOptions: {
            ecmaFeatures: {
                modules: true,
            },
        },
    },
}]);