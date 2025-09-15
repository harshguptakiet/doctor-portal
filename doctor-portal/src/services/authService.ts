import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type {
  User,
  Doctor,
  Patient,
  UserRole,
  LoginCredentials,
  DoctorSignupData,
  AuthState
} from '../types/auth';

class AuthService {
  private currentAuthState: AuthState = {
    user: null,
    loading: true,
    error: null
  };
  private authStateCallbacks: Array<(authState: AuthState) => void> = [];

  constructor() {
    console.log('🔧 Initializing AuthService...');
    console.log('🔧 Firebase config check:', {
      apiKey: auth.config.apiKey ? '✅ Present' : '❌ Missing',
      authDomain: auth.config.authDomain ? '✅ Present' : '❌ Missing',
      projectId: '✅ Present'
    });
    this.initAuthStateListener();
  }

  private initAuthStateListener() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await this.getUserData(firebaseUser.uid);
          this.updateAuthState({ user, loading: false, error: null });
        } catch (error) {
          console.error('Error fetching user data:', error);
          this.updateAuthState({ 
            user: null, 
            loading: false, 
            error: 'Failed to fetch user data' 
          });
        }
      } else {
        this.updateAuthState({ user: null, loading: false, error: null });
      }
    });
  }

  private updateAuthState(newState: Partial<AuthState>) {
    this.currentAuthState = { ...this.currentAuthState, ...newState };
    this.authStateCallbacks.forEach(callback => callback(this.currentAuthState));
  }

  onAuthStateChange(callback: (authState: AuthState) => void) {
    this.authStateCallbacks.push(callback);
    // Immediately call with current state
    callback(this.currentAuthState);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      this.updateAuthState({ loading: true, error: null });
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = await this.getUserData(userCredential.user.uid);
      
      if (!user.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      console.log('✅ User logged in successfully:', user.role);
      return user;
    } catch (error: any) {
      const errorMessage = this.getAuthErrorMessage(error.code) || error.message;
      this.updateAuthState({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  }

  async signupDoctor(doctorData: DoctorSignupData): Promise<Doctor> {
    try {
      console.log('📝 Starting doctor signup process...');
      console.log('📝 Doctor data:', { ...doctorData, password: '***', confirmPassword: '***' });
      
      this.updateAuthState({ loading: true, error: null });

      // Validate password match
      if (doctorData.password !== doctorData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      console.log('🔥 Creating Firebase auth user...');
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        doctorData.email,
        doctorData.password
      );
      console.log('✅ Firebase user created successfully:', userCredential.user.uid);

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: doctorData.displayName
      });

      // Create doctor document
      const doctor: Doctor = {
        uid: userCredential.user.uid,
        email: doctorData.email,
        displayName: doctorData.displayName,
        role: 'doctor',
        licenseNumber: doctorData.licenseNumber,
        specialization: doctorData.specialization,
        qualifications: doctorData.qualifications,
        experience: doctorData.experience,
        clinicName: doctorData.clinicName,
        clinicAddress: doctorData.clinicAddress,
        phoneNumber: doctorData.phoneNumber,
        consultationFee: doctorData.consultationFee || 500,
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' }
          ]
        },
        isVerified: false, // Admin verification required
        patients: [],
        totalConsultations: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', doctor.uid), doctor);
      await setDoc(doc(db, 'doctors', doctor.uid), doctor);

      console.log('✅ Doctor registered successfully:', doctor.uid);
      return doctor;
    } catch (error: any) {
      console.error('❌ Doctor signup error details:');
      console.error('Error object:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      const errorMessage = this.getAuthErrorMessage(error.code) || error.message;
      this.updateAuthState({ loading: false, error: errorMessage });
      
      // Preserve the original error for better debugging
      throw error;
    }
  }

  async getUserData(uid: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();
    
    // Convert Firestore timestamps to Date objects
    return {
      ...userData,
      createdAt: userData.createdAt?.toDate() || new Date(),
      updatedAt: userData.updatedAt?.toDate() || new Date()
    } as User;
  }

  async getDoctorData(uid: string): Promise<Doctor> {
    const doctorDoc = await getDoc(doc(db, 'doctors', uid));
    
    if (!doctorDoc.exists()) {
      throw new Error('Doctor data not found');
    }

    const doctorData = doctorDoc.data();
    
    return {
      ...doctorData,
      createdAt: doctorData.createdAt?.toDate() || new Date(),
      updatedAt: doctorData.updatedAt?.toDate() || new Date()
    } as Doctor;
  }

  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    const patientsQuery = query(
      collection(db, 'patients'),
      where('assignedDoctor', '==', doctorId)
    );
    
    const querySnapshot = await getDocs(patientsQuery);
    const patients: Patient[] = [];
    
    querySnapshot.forEach((doc) => {
      const patientData = doc.data();
      patients.push({
        ...patientData,
        createdAt: patientData.createdAt?.toDate() || new Date(),
        updatedAt: patientData.updatedAt?.toDate() || new Date()
      } as Patient);
    });

    return patients;
  }

  async assignPatientToDoctor(patientId: string, doctorId: string): Promise<void> {
    try {
      // Update patient's assigned doctor
      await updateDoc(doc(db, 'patients', patientId), {
        assignedDoctor: doctorId,
        updatedAt: serverTimestamp()
      });

      // Add patient to doctor's patient list
      await updateDoc(doc(db, 'doctors', doctorId), {
        patients: arrayUnion(patientId),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Patient assigned to doctor successfully');
    } catch (error) {
      console.error('Error assigning patient to doctor:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  async checkLicenseExists(licenseNumber: string, role: 'doctor' | 'pharmacy' | 'pathology'): Promise<boolean> {
    try {
      const collection_name = role === 'doctor' ? 'doctors' : `${role}s`;
      const licenseQuery = query(
        collection(db, collection_name),
        where('licenseNumber', '==', licenseNumber)
      );
      
      const querySnapshot = await getDocs(licenseQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking license:', error);
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentAuthState.user;
  }

  isLoggedIn(): boolean {
    return !!this.currentAuthState.user;
  }

  hasRole(role: UserRole): boolean {
    return this.currentAuthState.user?.role === role;
  }

  isDoctor(): boolean {
    return this.hasRole('doctor');
  }

  isPatient(): boolean {
    return this.hasRole('patient');
  }

  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred.';
  }
}

// Create and export singleton instance
const authService = new AuthService();

// Export individual functions for convenience
export const getCurrentUser = async (): Promise<{ user: User | null; role: UserRole | null }> => {
  const currentUser = authService.getCurrentUser();
  return {
    user: currentUser,
    role: currentUser?.role || null
  };
};

export const logout = () => authService.logout();

export const login = (credentials: LoginCredentials) => authService.login(credentials);
export const signupDoctor = (doctorData: DoctorSignupData) => authService.signupDoctor(doctorData);
export const checkEmailExists = (email: string) => authService.checkEmailExists(email);
export const checkLicenseExists = (licenseNumber: string, role: 'doctor' | 'pharmacy' | 'pathology') => authService.checkLicenseExists(licenseNumber, role);
export const onAuthStateChange = (callback: (authState: AuthState) => void) => authService.onAuthStateChange(callback);

export default authService;
