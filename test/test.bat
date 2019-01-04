echo off
set SCRIPT_DIR=%~dp0
set DIR=%SCRIPT_DIR%\..

set PATH=%DIR%\node;%DIR%\node_modules\.bin;%PATH%

node -v

mocha %DIR%\test\test-app.js
