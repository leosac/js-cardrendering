module.exports = {
    extends: ["eslint:recommended"],
    env: {
        es6: true,
        node: true
    },
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 10,
        ecmaFeatures: {
            modules: true
        },
    },
    globals: {
        requestAnimationFrame: "readonly"
    }
};