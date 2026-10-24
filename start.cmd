@echo off
setlocal
cd /d "%~dp0"
set ELECTRON_RUN_AS_NODE=
node scripts\start-local.cjs
if errorlevel 1 pause
endlocal
