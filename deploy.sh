#!/bin/bash
cd /home/ubuntu/OrderingFood_Server
npm install
npm install -g nodemon
nohup npm run start > /home/ubuntu/output.log 2>&1 &