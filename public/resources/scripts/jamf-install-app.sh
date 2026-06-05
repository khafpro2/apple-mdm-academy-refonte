#!/bin/bash
# Exemple script Jamf Policy — installation application
APP_NAME="CompanyApp"
DMG_URL="https://example.com/app.dmg"
MOUNT_POINT="/Volumes/install"
cp -R "$MOUNT_POINT/$APP_NAME.app" "/Applications/"
echo "Installed $APP_NAME"
