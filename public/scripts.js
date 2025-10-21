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

// Function to close the Bootstrap modal
function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
}

// -------------------------------------------------------------
// Firebase Sign-Up Logic (with Password Confirmation and Redirection)
// -------------------------------------------------------------
$('#signupForm').on('submit', function(e) {
    e.preventDefault();

    // Clear previous status messages
    $('#signupStatus').html(''); 

    const email = $('#signupEmail').val();
    const password = $('#signupPassword').val();
    const passwordConfirm = $('#signupPasswordConfirm').val(); // NEW: Confirmation field
    
    const firstName = $('#signupFirstName').val();
    const lastName = $('#signupLastName').val();
    const accountType = $('#accountType').val(); 
    const fieldOfInterest = $('#fieldOfInterest').val();

    // 🛑 STEP 1: Check if passwords match
    if (password !== passwordConfirm) {
        $('#signupStatus').html('<div class="alert alert-danger mt-2">Sign-up Failed: Passwords do not match.</div>');
        console.error("Sign-up Error: Passwords do not match.");
        return; // Stop execution
    }

    // 1. Create User in Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // 2. Save Additional Info to Firestore (Profile Data)
            return db.collection("users").doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                accountType: accountType,
                fieldOfInterest: fieldOfInterest,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            // Success: Close modal, show success message, and redirect
            console.log("User created, profile saved, and ready for redirection.");
            
            closeModal('signupModal');
            
            // 🛑 STEP 3: Conditional Redirection based on Account Type
            let redirectUrl;
            if (accountType === 'Client') {
                // Placeholder URL for Client Dashboard (change this later)
                redirectUrl = '/client-dashboard.html'; 
            } else if (accountType === 'Business') {
                // Placeholder URL for Business Dashboard (change this later)
                redirectUrl = '/business-dashboard.html';
            } else {
                // Fallback for safety
                redirectUrl = '/index.html';
            }

            // Perform the redirect
            window.location.href = redirectUrl;

        })
        .catch((error) => {
            // Error handling
            const errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '');
            $('#signupStatus').html(`<div class="alert alert-danger mt-2">Sign-up Failed: ${errorMessage}</div>`);
            console.error("Sign-up Error:", error);
        });
});
