#!/bin/bash
git pull origin master
npm install
pm2 restart rest-api  --update-env
# EOF
