#!/bin/sh

echo "Starting Server for" $1

npm install
mkdir uploads && mkdir uploads2
cd client && npm install && npm run build && cd ..
start http://localhost:3000

if  [[ $1 = "sensors" ]]; then
    npm run sensors
elif [[ $1 = "vernier" ]]; then
    npm run vernier
fi