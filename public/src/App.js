import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Example import for using Firebase Auth
import { BookOpen } from 'lucide-react';

// Main App Component
const App = () => {
  const [app, setApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [status, setStatus] = useState('Checking configuration...');
  const [firebaseConfig, setFirebaseConfig] = useState({});
  const [isConfigComplete, setIsConfigComplete] = useState(false);

  useEffect(() => {
    // ----------------------------------------------------------------------
    // 1. GET CONFIGURATION SECURELY FROM ENVIRONMENT VARIABLES (Moved inside useEffect)
    // This ensures process.env is accessed safely within the component lifecycle
    // ----------------------------------------------------------------------
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      // measurementId is optional and not typically needed for initialization
    };

    setFirebaseConfig(config);

    // Check if any critical variable is missing before attempting initialization
    // Note: The check for undefined/null is also important as environment vars 
    // might be empty strings if not set on Vercel.
    const complete = Object.values(config).every(val => val !== undefined && val !== null && val !== "");
    setIsConfigComplete(complete);

    // ----------------------------------------------------------------------
    // 2. INITIALIZE FIREBASE
    // ----------------------------------------------------------------------

    if (complete) {
      try {
        const initializedApp = initializeApp(config);
        const initializedAuth = getAuth(initializedApp);
        
        setApp(initializedApp);
        setAuth(initializedAuth);
        
        setStatus('Firebase is connected and ready to use!');
        
        console.log("Firebase App Initialized Successfully!");
        console.log("Current Project ID:", initializedApp.options.projectId);

      } catch (error) {
        setStatus('Configuration complete, but initialization failed (Check console for error).');
        console.error("Error initializing Firebase:", error);
      }
    } else {
      setStatus('🚨 Missing Environment Variables. Please set them in .env.local and Vercel settings.');
      console.warn("Firebase configuration is incomplete. Check environment variables.");
    }
    // Dependency array is empty, this runs once on mount
  }, []); 

  // Use the state-stored config for display
  const displayConfig = firebaseConfig;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Vercel Secret Manager</h1>
        </div>
        <p className="text-gray-600 mb-6">
          This component securely retrieves the Firebase configuration using environment variables (`process.env.REACT_APP_*`).
        </p>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-indigo-700 mb-2">Configuration Status:</p>
          <p className={`font-mono text-sm ${app ? 'text-green-700' : 'text-red-700'}`}>
            {status}
          </p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Loaded Variables (for verification):</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><span className="font-mono bg-gray-100 px-1 rounded">Project ID:</span> {displayConfig.projectId || 'N/A'}</li>
            <li><span className="font-mono bg-gray-100 px-1 rounded">Auth Domain:</span> {displayConfig.authDomain || 'N/A'}</li>
            {/* API Key is available but typically not displayed in the UI */}
            <li><span className="font-mono bg-gray-100 px-1 rounded">API Key Check:</span> {displayConfig.apiKey ? 'Key Loaded Successfully (Hidden)' : '❌ Key Missing'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App; 
