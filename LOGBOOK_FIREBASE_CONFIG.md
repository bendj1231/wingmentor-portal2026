# Digital Logbook – Firebase Configuration

This guide explains everything needed for the Digital Logbook screens (`LogbookPage` and `DigitalLogbookPage`) to read and write flight entries in Firebase.

## 1. Environment Variables (Vite)
Create a `.env` file in the project root (same folder as `package.json`) and provide your real Firebase web-app credentials:

```
# Firebase Web App
VITE_FIREBASE_API_KEY=YOUR_REAL_KEY
VITE_FIREBASE_AUTH_DOMAIN=wingmentor-portal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wingmentor-portal
VITE_FIREBASE_STORAGE_BUCKET=wingmentor-portal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Restart `npm run dev` (or rebuild in production) after editing this file so Vite injects the values at build time.

## 2. Firestore Collections
The logbook UI uses the following collections:

| Collection | Used By | Required fields |
|------------|---------|-----------------|
| `flightLogs` | `LogbookPage`, `DigitalLogbookPage`, `PilotProfilePage` | `userId` (string, UID), `date` (ISO string), `aircraftType` (string), `hours` (number). Optional: `registration`, `route`, `category`, `remarks`, `sessionDescription`, `createdAt` |
| `pilotProfiles` *(optional)* | `PilotProfilePage` | Provides overrides for license type/status and total hours. |

### `flightLogs` document example
```json
{
  "userId": "dev-super-admin",
  "date": "2024-03-10",
  "aircraftType": "C172",
  "registration": "RPC-1885",
  "route": "EGLL-EGLC",
  "category": "DUAL",
  "hours": 1.5,
  "remarks": "Pattern work",
  "createdAt": "2024-03-10T12:00:00.000Z"
}
```

### Composite Index (userId + date)
`DigitalLogbookPage` queries `flightLogs` with `where('userId','==', uid)` and `orderBy('date','desc')`. Create an index:

```
Collection: flightLogs
Fields:
  userId  | Ascending
  date    | Descending
```

You can create it via the Firestore console (Indexes → Composite → Add Index) or CLI:
```
firebase firestore:indexes
```

## 3. Firestore Security Rules (minimum)
Adjust as needed, but a basic rule to keep users scoped to their own entries:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /flightLogs/{logId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    match /pilotProfiles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // managed by admins only
    }
  }
}
```

## 4. Seeding Test Data
1. Open Firestore console → `flightLogs` → **Add document**.
2. Set `userId` to the UID you use in development (default mock UID is `dev-super-admin` when Firebase credentials are missing).
3. Add several documents so the logbook tables display real data.

With these steps, the Digital Logbook UI will read existing entries, allow adding new ones (`addDoc` to `flightLogs`), and keep the dashboard credentials in sync.
