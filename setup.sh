#!/bin/sh

echo "Starting Server for" $1

npm install
mkdir sensor-files && mkdir vernier-files
cd client && npm install && npm run build && cd ..

npm run $1