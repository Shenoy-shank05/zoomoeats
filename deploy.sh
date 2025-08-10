#!/bin/bash

echo "🚀 Starting Zoomo Eats deployment..."

# Build the React app
echo "📦 Building React app..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Copy _redirects file to build folder
echo "📋 Copying _redirects file..."
cp public/_redirects build/_redirects

# Deploy with Amplify
echo "🌐 Deploying to AWS Amplify..."
amplify publish --yes

echo "🎉 Deployment complete! Your app is live!"
