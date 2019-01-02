echo off
set SCRIPT_DIR=%~dp0
set PATH=%SCRIPT_DIR%\..\node;%PATH%

..\node_modules\.bin\mocha test-app.js
