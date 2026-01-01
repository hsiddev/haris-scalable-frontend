#!/bin/bash

set -e

echo "Azure Deployment Script for Frontend"
echo "===================================="

RESOURCE_GROUP="${RESOURCE_GROUP:-mediaapp-rg}"
APP_NAME="${APP_NAME:-mediaapp-frontend}"
API_URL="${API_URL:-https://mediaapp-backend.azurewebsites.net/api}"

if [ -z "$RESOURCE_GROUP" ] || [ -z "$APP_NAME" ]; then
  echo "Error: RESOURCE_GROUP and APP_NAME must be set"
  exit 1
fi

echo "Resource Group: $RESOURCE_GROUP"
echo "App Name: $APP_NAME"
echo "API URL: $API_URL"

echo ""
echo "Step 1: Building frontend..."
cd "$(dirname "$0")/.."

if [ ! -f ".env.production" ]; then
  echo "VITE_API_URL=$API_URL" > .env.production
fi

npm run build

if [ ! -d "dist" ]; then
  echo "Error: Build failed, dist directory not found"
  exit 1
fi

echo ""
echo "Step 2: Deploying to Azure Static Web Apps..."
az staticwebapp deploy \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --source-location . \
  --app-location . \
  --output-location dist

echo ""
echo "Step 3: Setting environment variables..."
az staticwebapp appsettings set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --setting-names "VITE_API_URL=$API_URL"

echo ""
echo "Deployment complete!"
echo "Frontend URL: https://$APP_NAME.azurestaticapps.net"


