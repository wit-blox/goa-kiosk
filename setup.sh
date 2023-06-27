#!/bin/sh

cd C:/goa-kiosk

echo "Starting Server for" $1

npm install
mkdir sensor-files && mkdir vernier-files && mkdir reveal-files
cd client && npm install && npm run build && cd ..

npm run $1