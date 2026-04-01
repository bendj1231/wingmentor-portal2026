#!/usr/bin/env node

// Test Firebase Connection Script
const admin = require('firebase-admin');

// Test with your current configuration
console.log('🔍 Testing Firebase Connection...\n');

// Check if we can read the MCP configuration
try {
  const fs = require('fs');
  const mcpConfig = JSON.parse(fs.readFileSync('.windsurf/mcp.json', 'utf8'));
  const firebaseConfig = mcpConfig.mcpServers.firebase.env;
  
  console.log('📋 MCP Configuration Found:');
  console.log(`   Project ID: ${firebaseConfig.FIREBASE_PROJECT_ID}`);
  console.log(`   Client Email: ${firebaseConfig.FIREBASE_CLIENT_EMAIL}`);
  console.log(`   Database URL: ${firebaseConfig.FIREBASE_DATABASE_URL}`);
  console.log(`   Private Key: ${firebaseConfig.FIREBASE_PRIVATE_KEY ? '✅ Present' : '❌ Missing'}\n`);
  
  // Initialize Firebase with the configuration
  const serviceAccount = {
    projectId: firebaseConfig.FIREBASE_PROJECT_ID,
    clientEmail: firebaseConfig.FIREBASE_CLIENT_EMAIL,
    privateKey: firebaseConfig.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: firebaseConfig.FIREBASE_DATABASE_URL
    });
  }
  
  console.log('🔗 Firebase Admin Initialized\n');
  
  // Test Firestore connection
  const db = admin.firestore();
  console.log('📊 Testing Firestore Connection...');
  
  // Try to read a document from the users collection
  db.collection('users').limit(1).get()
    .then(snapshot => {
      console.log('✅ Firestore Connection Successful');
      console.log(`   Found ${snapshot.size} user(s) in database`);
      
      if (snapshot.size > 0) {
        const user = snapshot.docs[0].data();
        console.log(`   Sample user: ${user.email || user.displayName || 'No email'}`);
        console.log(`   User role: ${user.role || 'No role'}`);
        console.log(`   User status: ${user.status || 'No status'}`);
      }
    })
    .then(() => {
      // Test Auth connection
      console.log('\n🔐 Testing Firebase Auth Connection...');
      return admin.auth().listUsers(1);
    })
    .then(listUsersResult => {
      console.log('✅ Firebase Auth Connection Successful');
      console.log(`   Total users in Auth: ${listUsersResult.users.length}`);
      
      if (listUsersResult.users.length > 0) {
        const user = listUsersResult.users[0];
        console.log(`   Sample auth user: ${user.email}`);
        console.log(`   UID: ${user.uid}`);
        console.log(`   Disabled: ${user.disabled}`);
      }
      
      console.log('\n🎉 All Firebase Connections Successful!');
      console.log(`\n📱 Project Details:`);
      console.log(`   Project ID: ${firebaseConfig.FIREBASE_PROJECT_ID}`);
      console.log(`   This should match your Firebase Console project`);
      
      // Check if this is the expected project
      if (firebaseConfig.FIREBASE_PROJECT_ID === 'wingmentor-ab3ad') {
        console.log(`   ✅ Connected to correct WingMentor project`);
      } else {
        console.log(`   ⚠️  Connected to project: ${firebaseConfig.FIREBASE_PROJECT_ID}`);
        console.log(`   Expected: wingmentor-ab3ad`);
      }
      
    })
    .catch(error => {
      console.error('❌ Firebase Connection Failed:');
      console.error(`   Error: ${error.message}`);
      
      if (error.code === 'permission-denied') {
        console.error(`   Solution: Check service account permissions`);
      } else if (error.code === 'project-not-found') {
        console.error(`   Solution: Verify project ID is correct`);
      } else if (error.code === 'invalid-credential') {
        console.error(`   Solution: Check service account key format`);
      }
    })
    .finally(() => {
      process.exit(0);
    });
    
} catch (error) {
  console.error('❌ Configuration Error:');
  console.error(`   Could not read .windsurf/mcp.json`);
  console.error(`   Make sure the file exists and is valid JSON`);
  console.error(`   Error: ${error.message}`);
  process.exit(1);
}
