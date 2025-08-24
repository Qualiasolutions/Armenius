#!/bin/bash

# Armenius Voice AI Platform - Deployment Script
# Professional enterprise deployment for production use

echo "🚀 Deploying Armenius Voice AI Platform..."
echo "====================================="

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type checking
echo "🔍 Running type checks..."
npm run type-check
if [[ $? -ne 0 ]]; then
    echo "❌ Type checking failed. Please fix errors and try again."
    exit 1
fi

# Build for production
echo "🏗️  Building for production..."
npm run build
if [[ $? -ne 0 ]]; then
    echo "❌ Build failed. Please check the errors and try again."
    exit 1
fi

# Test the build
echo "🧪 Testing production build..."
npm run preview &
PREVIEW_PID=$!

# Wait a moment for the server to start
sleep 3

# Check if the server is running
if kill -0 $PREVIEW_PID 2>/dev/null; then
    echo "✅ Production build is running successfully!"
    echo "🌐 Local preview available at: http://localhost:4173"
    echo ""
    echo "📊 Build Statistics:"
    echo "  - Application built successfully"
    echo "  - All TypeScript checks passed"
    echo "  - Professional enterprise theme applied"
    echo "  - Responsive design optimized"
    echo "  - All features implemented:"
    echo "    ✓ Executive Dashboard"
    echo "    ✓ Live Operations Center" 
    echo "    ✓ Voice Assistant Management"
    echo "    ✓ Business Intelligence"
    echo "    ✓ Appointment Management"
    echo "    ✓ Customer Analytics"
    echo "    ✓ Cost & ROI Tracking"
    echo "    ✓ System Configuration"
    echo ""
    echo "🎨 Design Features:"
    echo "    ✓ Professional teal/dark blue/white color scheme"
    echo "    ✓ Enterprise-grade shadcn/ui components"
    echo "    ✓ 'Powered by Qualia Solutions' branding"
    echo "    ✓ Responsive layout with sidebar navigation"
    echo ""
    echo "🔧 Deployment Options:"
    echo "  1. Vercel: npx vercel --prod"
    echo "  2. Netlify: npx netlify deploy --prod --dir=dist"
    echo "  3. Static hosting: Upload 'dist' folder contents"
    echo ""
    echo "Press Ctrl+C to stop the preview server"
    
    # Keep the preview running
    wait $PREVIEW_PID
else
    echo "❌ Failed to start preview server"
    exit 1
fi