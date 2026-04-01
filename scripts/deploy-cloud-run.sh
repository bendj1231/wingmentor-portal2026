#!/bin/bash

# Configuration (Replace with your actual project details)
PROJECT_ID="wingmentor-ab3ad"
REGION="us-central1"
SERVICE_NAME="segment-mini-app"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting Deployment of $SERVICE_NAME to Google Cloud Run..."

# 1. Build the Docker image locally
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME ./segment-mini-app

# 2. Push the image to Google Container Registry (or Artifact Registry)
echo "📤 Pushing image to registry..."
docker push $IMAGE_NAME

# 3. Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID

echo "✅ Deployment Complete!"
echo "📍 Make sure to update your Host (App.tsx) remote URL with the new Cloud Run Service URL."
