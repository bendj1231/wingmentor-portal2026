#!/usr/bin/env node

// Firebase to Supabase Migration Script
import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';

// Initialize Firebase Admin
import serviceAccount from './.windsurf/mcp-servers/serviceAccountKey.json' with { type: 'json' };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
  });
}

const firebaseDB = admin.firestore();
const firebaseAuth = admin.auth();

// Initialize Supabase (you'll need to update these)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateUsers() {
  console.log('🔥 Starting Firebase to Supabase migration...');
  
  try {
    // 1. Get all Firebase Auth users
    console.log('📥 Exporting Firebase Auth users...');
    const listUsersResult = await firebaseAuth.listUsers(1000);
    const firebaseUsers = listUsersResult.users;
    
    console.log(`Found ${firebaseUsers.length} users in Firebase Auth`);
    
    // 2. Get all Firestore profiles
    console.log('📥 Exporting Firestore profiles...');
    const profilesSnapshot = await firebaseDB.collection('users').get();
    const firestoreProfiles = {};
    
    profilesSnapshot.forEach(doc => {
      firestoreProfiles[doc.id] = { id: doc.id, ...doc.data() };
    });
    
    console.log(`Found ${Object.keys(firestoreProfiles).length} profiles in Firestore`);
    
    // 3. Create users in Supabase Auth
    console.log('📤 Creating users in Supabase Auth...');
    const supabaseUsers = [];
    
    for (const firebaseUser of firebaseUsers) {
      try {
        // Extract user metadata from Firebase
        const profile = firestoreProfiles[firebaseUser.uid] || {};
        
        const { data, error } = await supabase.auth.admin.createUser({
          email: firebaseUser.email,
          email_confirm: firebaseUser.emailVerified,
          user_metadata: {
            display_name: profile.displayName || firebaseUser.displayName || '',
            role: profile.role || 'mentee',
            firebase_uid: firebaseUser.uid,
            created_at_firebase: firebaseUser.metadata.creationTime
          },
          phone: firebaseUser.phoneNumber,
          phone_confirm: !!firebaseUser.phoneNumber
        });
        
        if (error) {
          console.error(`❌ Failed to create user ${firebaseUser.email}:`, error.message);
          continue;
        }
        
        supabaseUsers.push({
          firebase: firebaseUser,
          supabase: data.user,
          profile
        });
        
        console.log(`✅ Created Supabase user: ${firebaseUser.email}`);
        
      } catch (error) {
        console.error(`❌ Error creating user ${firebaseUser.email}:`, error.message);
      }
    }
    
    // 4. Create profiles in Supabase
    console.log('📤 Creating profiles in Supabase...');
    for (const user of supabaseUsers) {
      try {
        const profileData = {
          id: user.supabase.id,
          email: user.firebase.email,
          display_name: user.profile.displayName || user.firebase.displayName || '',
          role: user.profile.role || 'mentee',
          status: user.profile.status || 'active',
          track: user.profile.track || '',
          firebase_uid: user.firebase.uid,
          created_at: user.firebase.metadata.creationTime || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('profiles')
          .insert(profileData);
        
        if (error) {
          console.error(`❌ Failed to create profile for ${user.firebase.email}:`, error.message);
        } else {
          console.log(`✅ Created profile for: ${user.firebase.email}`);
        }
        
      } catch (error) {
        console.error(`❌ Error creating profile for ${user.firebase.email}:`, error.message);
      }
    }
    
    // 5. Migrate app access data
    console.log('📤 Migrating app access data...');
    for (const user of supabaseUsers) {
      const appAccess = user.profile.appAccess || [];
      
      for (const appId of appAccess) {
        try {
          const { error } = await supabase
            .from('user_app_access')
            .insert({
              user_id: user.supabase.id,
              app_id: appId,
              granted: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (error) {
            console.error(`❌ Failed to add app access ${appId} for ${user.firebase.email}:`, error.message);
          } else {
            console.log(`✅ Added app access ${appId} for: ${user.firebase.email}`);
          }
          
        } catch (error) {
          console.error(`❌ Error adding app access ${appId} for ${user.firebase.email}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Migration completed!');
    console.log(`✅ Migrated ${supabaseUsers.length} users to Supabase`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Helper function to migrate specific collections
async function migrateCollection(collectionName, transformFn) {
  console.log(`📥 Migrating ${collectionName}...`);
  
  try {
    const snapshot = await firebaseDB.collection(collectionName).get();
    const documents = [];
    
    snapshot.forEach(doc => {
      const data = transformFn ? transformFn(doc.id, doc.data()) : { id: doc.id, ...doc.data() };
      documents.push(data);
    });
    
    if (documents.length > 0) {
      const { error } = await supabase
        .from(collectionName)
        .insert(documents);
      
      if (error) {
        console.error(`❌ Failed to migrate ${collectionName}:`, error.message);
      } else {
        console.log(`✅ Migrated ${documents.length} documents from ${collectionName}`);
      }
    }
    
  } catch (error) {
    console.error(`❌ Error migrating ${collectionName}:`, error.message);
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting Firebase to Supabase migration...');
  console.log('⚠️  Make sure you have updated SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.log('');
  
  if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-service-role-key')) {
    console.error('❌ Please update your Supabase credentials in the script or environment variables');
    process.exit(1);
  }
  
  await migrateUsers();
  
  // You can add additional collection migrations here
  // await migrateCollection('logs', (id, data) => ({ id, ...data, migrated_at: new Date().toISOString() }));
  // await migrateCollection('settings', (id, data) => ({ id, ...data }));
  
  console.log('\n✨ Migration complete! You can now start using the Supabase MCP server.');
  process.exit(0);
}

// Run the migration
runMigration().catch(console.error);

export { migrateUsers, migrateCollection, runMigration };
