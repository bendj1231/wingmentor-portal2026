#!/bin/bash

echo "Restarting TypeScript Language Server..."

# Kill existing TypeScript language server processes
pkill -f "tsserver"
pkill -f "typescript-language-server"

# Clear TypeScript cache
rm -rf node_modules/.tmp
rm -rf .vscode/.tsbuildinfo

# Restart VS Code TypeScript server (if using VS Code)
if command -v code &> /dev/null; then
    echo "Restarting VS Code TypeScript server..."
    # This will restart the TypeScript server in VS Code
    osascript -e 'tell application "Visual Studio Code" to activate' \
              -e 'tell application "System Events" to keystroke "k" using {shift down, command down}' \
              -e 'delay 0.5' \
              -e 'tell application "System Events" to keystroke "t" using {command down}'
fi

echo "TypeScript Language Server restarted!"
