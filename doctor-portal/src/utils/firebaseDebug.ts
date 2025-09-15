import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const testFirebaseAuth = async () => {
  console.log('🔧 Testing Firebase Authentication Setup...');
  
  // Check Firebase configuration
  console.log('📋 Firebase Config:', {
    apiKey: auth.config.apiKey ? `${auth.config.apiKey.substring(0, 10)}...` : '❌ Missing',
    authDomain: auth.config.authDomain || '❌ Missing',
    projectId: 'medibot-b2bf7'
  });

  // Test basic auth connectivity
  try {
    console.log('🌐 Testing Firebase Auth connectivity...');
    
    // Try to create a test user (this will fail but give us detailed error info)
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'test123456';
    
    console.log('🧪 Attempting test user creation...');
    await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Test user creation successful');
    
  } catch (error: any) {
    console.log('🔍 Firebase Auth Error Analysis:');
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
    
    if (error.code === 'auth/operation-not-allowed') {
      console.log('🚫 ISSUE FOUND: Email/Password authentication is disabled in Firebase Console');
      console.log('💡 SOLUTION: Go to Firebase Console → Authentication → Sign-in method → Email/Password → Enable');
    } else if (error.code === 'auth/invalid-api-key') {
      console.log('🔑 ISSUE FOUND: Invalid API Key');
      console.log('💡 SOLUTION: Check your Firebase configuration in src/config/firebase.ts');
    } else if (error.code === 'auth/network-request-failed') {
      console.log('🌐 ISSUE FOUND: Network request failed');
      console.log('💡 SOLUTION: Check your internet connection and Firebase project status');
    } else {
      console.log('❓ Unknown error - check Firebase project settings');
    }
    
    return error;
  }
};

// Add this to window for easy testing in browser console
(window as any).testFirebaseAuth = testFirebaseAuth;
