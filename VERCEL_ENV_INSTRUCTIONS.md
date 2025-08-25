# Vercel Environment Variables Setup

## 🔑 Vapi Public Key Configuration

To enable real voice calls in the web interface, add this environment variable to Vercel:

### **Step 1: Access Vercel Dashboard**
1. Go to https://vercel.com/qualiasolutions-glluztech/armenius
2. Click **Settings** → **Environment Variables**

### **Step 2: Add Public Key**
Add the following environment variable:

- **Name**: `VAPI_PUBLIC_KEY`  
- **Value**: `92d97105-4364-4ed0-b897-feeb4cd68ffb`
- **Environment**: All (Production, Preview, Development)

### **Step 3: Redeploy (Optional)**
The system has a fallback to use the hardcoded key, so redeployment is optional but recommended for clean configuration.

## 📋 Current Status
- ✅ **Fallback Public Key**: Hardcoded in api/config.js  
- ✅ **Assistant ID**: 89b5d633-974a-4b58-a6b5-cdbba8c2726a
- ✅ **Phone Number ID**: 70013602-16e5-411f-9c81-578ad1d4e3c9
- ✅ **Main Domain**: https://armenius.vercel.app/

## 🎯 Result
Voice call button will now use **real Vapi** instead of mock interface for actual voice conversations with Maria assistant!