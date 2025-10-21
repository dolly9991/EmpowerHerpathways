// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVhG_WF_zFprs_ouXweTPib9LJ9j72_5A",
  authDomain: "empowerherpathways-bw.firebaseapp.com",
  projectId: "empowerherpathways-bw",
  storageBucket: "empowerherpathways-bw.firebasestorage.app",
  messagingSenderId: "595741770949",
  appId: "1:595741770949:web:47863c0802b6184d6a5cac",
  measurementId: "G-G5EJDZ7Z3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase Sign-Up Logic (Create Account and Save Profile Data)
$('#signupForm').on('submit', function(e) {
    e.preventDefault();

    // Clear previous status messages
    $('#signupStatus').html(''); 

    const email = $('#signupEmail').val();
    const password = $('#signupPassword').val();
    const firstName = $('#signupFirstName').val();
    const lastName = $('#signupLastName').val();
    // NEW: Retrieve the account type value
    const accountType = $('#accountType').val(); 
    const fieldOfInterest = $('#fieldOfInterest').val();

    // 1. Create User in Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // 2. Save Additional Info to Firestore
            // Use the Firebase User UID as the document ID for easy lookup
            return db.collection("users").doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                accountType: accountType, // NEW: Saved to the user profile
                fieldOfInterest: fieldOfInterest,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            // Success: Close modal and show success message
            console.log("User created and profile saved successfully.");
            
            // Close the sign-up modal
            const modalElement = document.getElementById('signupModal');
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.hide();
            
            alert('Welcome to EmpowerHer Pathways! Your account is ready.');
            
            // Update the navigation bar (e.g., change 'Login' to 'Logout')
            $('#login-trigger').html('Logout');

        })
        .catch((error) => {
            // Error handling
            const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '');
            $('#signupStatus').html(`<div class="alert alert-danger mt-2">Sign-up Failed: ${errorMessage}</div>`);
            console.error("Sign-up Error:", error);
        });
});