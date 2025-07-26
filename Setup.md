### How to setup typescript

1. npm init -y

2. npm install -D typescript

3. tsc --init

4. Add script in package.json:  Use this if you want first to convert to dist
 "scripts": {

    "lint": "eslint . --ext .ts",

    "lint:fix": "eslint . --ext .ts --fix",

    "format": "prettier --write \"**/*.ts\"",

    "format:check": "prettier --check \"**/*.ts\"",

    "prebuild": "npx eslint . --fix",

    "build": "npx tsc",

    "watch": "npx tsc -w",

    "prestart": "npm run build",

    "start": "npx nodemon dist/index.js",

    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\"",

    "test": "echo \"Error: no test specified\" && exit 1"

  },