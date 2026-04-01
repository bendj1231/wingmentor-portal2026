# Firebase Setup Guide

## Why We Need Real Firebase Credentials

The WingMentor Portal is designed to work with real Firebase for production use. Currently, it's using mock data because the Firebase credentials in your `.env` file are placeholder values.

## Current Status

✅ **Development Mode**: Working with mock data  
❌ **Production Mode**: Needs real Firebase credentials  
🔄 **Hybrid Approach**: Uses real Firebase when available, falls back to mock when not

## How to Get Real Firebase Credentials

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `wingmentor-ab3ad`
3. Go to **Project Settings** (⚙️ icon)

### Step 2: Get Web App Configuration
1. In Project Settings, scroll down to **"Your apps"** section
2. Click on the Web app (or create one if it doesn't exist)
3. Click **"Firebase SDK snippet"** and select **"Config"**
4. Copy the configuration values

### Step 3: Update Your .env File

Replace the placeholder values in your `.env` file with the real Firebase credentials:

```bash
# Firebase Configuration - REPLACE WITH REAL VALUES
VITE_FIREBASE_API_KEY=your_real_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=wingmentor-ab3ad.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wingmentor-ab3ad
VITE_FIREBASE_STORAGE_BUCKET=wingmentor-ab3ad.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_real_sender_id
VITE_FIREBASE_APP_ID=your_real_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_real_measurement_id
```

### Step 4: Restart the Application

After updating the `.env` file:
1. Stop the current Vite server (Ctrl+C)
2. Restart with: `npm run dev`
3. The console should show: `🔥 Connecting to real Firebase`

## Benefits of Real Firebase

### ✅ **With Real Firebase:**
- **Live Data**: Actual user profiles and authentication
- **Persistence**: Changes saved to database
- **Real Authentication**: Email/password login
- **MCP Integration**: Full Windsurf integration
- **Production Ready**: Deployable to production

### ⚠️ **Current Mock Mode:**
- **Development Only**: No real data persistence
- **Mock Users**: Predefined user data
- **Limited Features**: No real authentication
- **Testing Only**: Good for development and testing

## Hybrid Approach

The application now uses a smart hybrid approach:

```javascript
// Automatic detection
if (hasValidCredentials) {
  // Use real Firebase
  console.log("🔥 Connecting to real Firebase");
} else {
  // Use mock system
  console.log("⚠️ Using development mode");
}
```

## Firebase Rules Setup

For the Mentor Management System to work properly, ensure your Firestore has:

### Security Rules (Firestore Rules tab):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read/write all users
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
  }
}
```

### Authentication Setup:
1. Enable **Email/Password** authentication
2. Enable **Google Sign-in** (optional)
3. Configure authorized domains

## Testing Real Firebase

Once you have real credentials:

1. **Check Console**: Should show `🔥 Connecting to real Firebase`
2. **Test Registration**: Create a new user account
3. **Test Mentor Management**: Verify real data persistence
4. **Test MCP**: Use Windsurf commands with real data

## Troubleshooting

### Common Issues:

**"invalid-argument" errors:**
- Check that all Firebase credentials are correct
- Ensure project ID matches exactly
- Verify API key is not truncated

**"permission-denied" errors:**
- Check Firestore security rules
- Ensure Authentication is enabled
- Verify user has proper permissions

**White screen:**
- Check console for Firebase initialization messages
- Verify all environment variables are set
- Ensure Vite can read the .env file

## MCP Integration

With real Firebase, your MCP server will:
- Connect to actual user data
- Allow real user management through Windsurf
- Persist changes to your Firebase database
- Work with your actual `wingmentor-ab3ad` project

## Next Steps

1. **Get Real Credentials** from Firebase Console
2. **Update .env File** with actual values
3. **Restart Application** to use real Firebase
4. **Test Features** with live data
5. **Deploy to Production** when ready

The hybrid approach ensures you can develop with mock data and easily switch to production Firebase when ready!
