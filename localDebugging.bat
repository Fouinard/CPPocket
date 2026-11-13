@echo off
set port=8081
title Reverse TCP CPPocket for local debugging
echo.
echo Using port %port% for reverse TCP connection.
echo.
adb reverse tcp:%port% tcp:%port%
npx expo start --localhost --port %port% --go
pause