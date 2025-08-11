#!/bin/bash

# ZoomoEats GitHub Publishing Script
# This script helps you publish your ZoomoEats project to GitHub

echo "🚀 ZoomoEats GitHub Publishing Script"
echo "====================================="

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ This is not a Git repository. Please run this script from the project root."
    exit 1
fi

echo "✅ Git repository detected"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing them now..."
    git add .
    git commit -m "feat: final preparations for GitHub publishing"
fi

echo "✅ All changes committed"

# Get GitHub username
echo ""
echo "Please enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Repository name
REPO_NAME="zoomoeats"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "📋 Repository Details:"
echo "   Username: $GITHUB_USERNAME"
echo "   Repository: $REPO_NAME"
echo "   URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin "$REPO_URL"

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Renaming branch to 'main'..."
    git branch -M main
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named '$REPO_NAME'"
echo "3. Set it as Public (recommended)"
echo "4. DO NOT initialize with README, .gitignore, or license"
echo "5. After creating the repository, run:"
echo ""
echo "   git push -u origin main"
echo ""
echo "📚 For detailed instructions, see: setup-github.md"
echo ""
echo "✨ Your ZoomoEats project is ready for GitHub!"
echo "   Repository URL will be: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
