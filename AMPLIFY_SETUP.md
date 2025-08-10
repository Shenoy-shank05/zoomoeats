# 🚀 AWS Amplify Setup Guide - Firebase-Style Deployment

## One-Time Setup (Do this once)

### 1️⃣ Install Amplify CLI
```bash
sudo npm install -g @aws-amplify/cli
```

### 2️⃣ Configure AWS Credentials
```bash
amplify configure
```
This will:
- Open AWS Console in your browser
- Create an IAM user with `AdministratorAccess-Amplify` permissions
- Copy Access Key & Secret → paste in terminal

### 3️⃣ Initialize Amplify Project
```bash
amplify init
```
Choose:
- Your AWS profile
- Default answers are fine
- Say "No" to advanced settings

### 4️⃣ Add Hosting
```bash
amplify add hosting
```
Select:
- "Hosting with Amplify Console"
- Environment: DEV or PROD
- Choose "Manual deploy"

## 🔥 Deploy (Every time - like Firebase!)

### Option 1: Simple Command
```bash
npm run deploy
```

### Option 2: Manual Steps
```bash
npm run build
amplify publish
```

### Option 3: One-liner
```bash
npm run build && amplify publish
```

## 🎯 What's Fixed

✅ **White screen issue resolved** - Removed `"homepage": "."` from package.json
✅ **Absolute paths** - Assets now load correctly on AWS Amplify
✅ **SPA routing** - `_redirects` file handles client-side routing
✅ **Build optimization** - Updated `amplify.yml` configuration

## 📁 Files Ready

- `build-final.zip` - Production build with fixes
- `deploy.sh` - Automated deployment script
- `amplify.yml` - AWS Amplify configuration
- `_redirects` - SPA routing rules

## 🌐 Custom Domain (Optional)

After deployment, go to:
1. AWS Amplify Console
2. Your app → "Domain management"
3. Add your custom domain (like zoomoeats.com)

## 🔧 Troubleshooting

If you get permission errors:
```bash
sudo npm install -g @aws-amplify/cli
```

If deployment fails:
```bash
amplify status
amplify push
```

## 🎉 Result

Your app will be deployed to AWS Amplify with:
- Fast global CDN
- Automatic HTTPS
- SPA routing support
- No white screen issues!

Just like Firebase, but on AWS! 🚀
