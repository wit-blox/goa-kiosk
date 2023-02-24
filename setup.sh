#!/bin/sh

npm install
mkdir uploads && mkdir uploads2
cd client && npm install && npm run build && cd ..
npm run digital-con