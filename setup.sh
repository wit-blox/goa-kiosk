#!/bin/sh

npm install
mkdir uploads && mkdir uploads2
cd client && npm install && npm run build && cd ..
start http://localhost:3000
npm run digital-con