# Doctor Portal - Comprehensive Healthcare Management System

A modern React + TypeScript healthcare management system with multi-portal support for doctors, pharmacies, pathology labs, and patients.

## 🏥 Features

### 🏥 Doctor Portal
- Patient management and consultation
- Prescription management with medicine search
- Video calling with WebRTC
- Real-time messaging and notifications
- Dashboard with analytics

### 💊 Pharmacy Portal
- Pharmacy registration and profile management
- Medicine inventory management
- Order processing and fulfillment
- CSV import/export for bulk medicine data
- Integration with doctor prescriptions

### 🔬 Pathology Portal
- Laboratory registration and accreditation
- Test catalog management
- Sample tracking and reporting
- Results management
- Integration with doctor referrals

### 👤 Patient Portal
- Patient registration and profile
- Appointment booking
- Medical history access
- Prescription tracking
- Test results viewing

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Real-time Communication**: WebRTC, Firebase Realtime Database
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting ready

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Firestore enabled

### Installation & Setup

1. **Navigate to project directory:**
   ```powershell
   cd c:\doctor-portal\doctor-portal
   ```

2. **Install dependencies** (already done if you followed setup):
   ```powershell
   npm install
   ```

3. **Configure Firebase:**
   Edit `src/App.tsx` and replace the placeholder config:
   ```typescript
   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_AUTH_DOMAIN', 
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_STORAGE_BUCKET',
     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
     appId: 'YOUR_APP_ID',
   };
   ```

4. **Start development server:**
   ```powershell
   npm run dev
   ```

5. **Open in browser:**
   Navigate to the URL shown in terminal (typically `http://localhost:5173`)

## 📊 Data Structure

### Firestore Collections

#### `patients` Collection
```typescript
{
  firstName: string;
  lastName: string;
  dateOfBirth?: string;    // ISO date
  gender?: string;
  phone?: string;
  email?: string;
  createdAt?: string;      // ISO timestamp
}
```

#### `appointments` Collection
```typescript
{
  patientId: string;       // Reference to patient document ID
  scheduledFor: string;    // ISO datetime
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-queue';
  reason?: string;
  createdAt?: string;      // ISO timestamp
}
```

## 🧪 Testing the App

### Add Sample Data
Use Firebase Console or this quick script in browser console:

```javascript
// In browser console after opening the app
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();

// Add a sample patient
const patientRef = await addDoc(collection(db, 'patients'), {
  firstName: 'Jane',
  lastName: 'Doe',
  dateOfBirth: '1985-03-15',
  gender: 'Female',
  phone: '555-0123',
  email: 'jane.doe@example.com',
  createdAt: new Date().toISOString()
});

// Add a sample appointment
await addDoc(collection(db, 'appointments'), {
  patientId: patientRef.id,
  scheduledFor: new Date().toISOString(),
  status: 'in-queue',
  reason: 'Annual Checkup',
  createdAt: new Date().toISOString()
});
```

### Test Real-time Updates
1. Go to Firebase Console → Firestore
2. Find an appointment with `status: 'in-queue'`
3. Change status to `completed` 
4. Watch it disappear from Patient Queue instantly
5. Refresh Dashboard to see updated statistics

## 🎨 UI Components

### Navigation
- Fixed sidebar with 4 main sections
- Active state highlighting
- Lucide React icons
- Responsive design

### Dashboard
- Statistics cards (completed, total patients, cancelled, queue count)
- Today's appointments list
- Real-time queue counter

### Patient Queue
- Live-updating list via Firestore `onSnapshot`
- Patient initials avatars
- Appointment reasons and scheduling info

### Patients Table
- Sortable columns
- Responsive overflow handling
- Patient avatars with initials
- Complete contact information

## 🔧 Customization

### Styling
All styles use Tailwind utility classes. Key design tokens:
- **Primary Color**: Sky blue (`sky-600`)
- **Accent Colors**: Amber (`amber-600`), Emerald (`emerald-600`), Rose (`rose-600`)
- **Neutrals**: Gray scale for text and borders
- **Typography**: System font stack with proper hierarchy

### Adding Features
Since this is a single-file architecture, add new components as inline functions within `App.tsx`:

```typescript
const NewFeatureView = () => (
  <div className="space-y-6">
    {/* Your component JSX */}
  </div>
);

// Add to navigation array
const navItems: NavItem[] = [
  // ...existing items
  { key: 'newfeature', label: 'New Feature', icon: <YourIcon size={18} /> },
];

// Add to renderView switch
case 'newfeature': return <NewFeatureView />;
```

## 🐛 Troubleshooting

### Tailwind Not Working
1. Ensure `tailwind.config.js` content paths are correct
2. Verify `index.css` contains `@tailwind` directives
3. Clear cache: `Remove-Item -Recurse -Force node_modules; npm install`

### Firebase Connection Issues
1. Check console for authentication errors
2. Verify Firestore rules allow read/write
3. Confirm project ID in config matches Firebase console

### Real-time Updates Not Working
1. Check browser console for listener errors
2. Verify Firestore indexes (auto-created for simple queries)
3. Ensure network connectivity to Firebase

## 📦 Build & Deploy

### Production Build
```powershell
npm run build
```

### Deploy Options
- **Netlify**: Drag `dist` folder to Netlify
- **Vercel**: Connect GitHub repo for auto-deployment
- **Firebase Hosting**: `npm install -g firebase-tools; firebase deploy`

## 🔒 Security Notes

### Firestore Rules
For production, replace default rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated doctors only
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables
Move Firebase config to `.env` files:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc
```

## 🎯 Future Enhancements

- [ ] Authentication (Firebase Auth)
- [ ] Calendar integration with scheduling
- [ ] Patient search and filtering
- [ ] Appointment notifications
- [ ] Multi-doctor support
- [ ] Patient history tracking
- [ ] Export/reporting features
- [ ] Dark mode toggle

## 📄 File Structure

```
doctor-portal/
├── public/           # Static assets
├── src/
│   ├── App.tsx      # Single-file application (main component)
│   ├── main.tsx     # React entry point
│   └── index.css    # Tailwind directives
├── package.json     # Dependencies
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## 🤝 Contributing

Since this is a single-file architecture:
1. All component logic goes in `App.tsx`
2. Use TypeScript interfaces for type safety
3. Follow existing naming conventions
4. Test real-time features thoroughly
5. Maintain responsive design principles

---

**Built with ❤️ for healthcare professionals**
