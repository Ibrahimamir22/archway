#!/bin/bash

# Create global VSCode settings directory if it doesn't exist
mkdir -p ~/Library/Application\ Support/Code/User/

# Create or update settings.json to disable TypeScript
cat > ~/Library/Application\ Support/Code/User/settings.json << EOL
{
  "typescript.validate.enable": false,
  "javascript.validate.enable": false,
  "typescript.tsserver.enable": false,
  "typescript.disableAutomaticTypeAcquisition": true,
  "typescript.suggestionActions.enabled": false,
  "typescript.updateImportsOnFileMove.enabled": "never",
  "editor.formatOnSave": false,
  "typescript.format.enable": false,
  "javascript.format.enable": false
}
EOL

echo "TypeScript validation disabled globally in VSCode!"
echo "Please restart VSCode for changes to take effect." 