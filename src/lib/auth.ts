import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth state management
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Convert Firebase User to AuthUser
const convertFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL
});

// Error message mapping - now exported
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled';
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled';
    default:
      return 'An unexpected error occurred. Please try again';
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return convertFirebaseUser(result.user);
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, name: string): Promise<AuthUser> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(result.user, {
      displayName: name
    });
    
    return convertFirebaseUser(result.user);
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return convertFirebaseUser(result.user);
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(convertFirebaseUser(user));
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  return user ? convertFirebaseUser(user) : null;
};