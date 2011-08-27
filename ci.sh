#!/bin/sh

# cheap CI
# run this under cron

# use forever to start the daemon process first like:
# forever start server.js
git pull
forever restart server.js
