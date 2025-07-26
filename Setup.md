### How to setup typescript

1. npm init -y

2. npm install -D typescript

3. tsc --init

4. Add script in package.json
"scripts": {
    "build": "npx tsc",
    "watch": "tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently \"npm run watch\" \"npo start\"",
    "test": "echo \"Error: no test specified\" && exit 1"
  },