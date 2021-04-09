module.exports = {
    "env": [
      'eslint:recommended',
      '@vue/airbnb',
      '@vue/typescript/recommended'
    ],

    "extends": [
        "eslint:recommended",
    ],

    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },

    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },

    "plugins": [    ],

    "rules": {
    },

    root: true,

    env: {
      browser: true,
      es6: true,
      node: true
    },

    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },

    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
};
