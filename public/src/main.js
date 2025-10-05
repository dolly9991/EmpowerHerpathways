// =========================================================================
// src/main.js (Firebase Auth & Form Logic)
// =========================================================================

import { 
    auth, 
    db, 
    provider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    setDoc, 
    doc, 
    getDoc,
    sendPasswordResetEmail
} from './lib/firebase.js'; 

// --------------------------------------------------
// 1. GLOBAL ELEMENT DEFINITIONS (Needed for Auth Logic)
// --------------------------------------------------
const signinModal = document.getElementById('signin-modal');
const closeSigninModal = document.getElementById('close-signin-modal');

// IMPORTANT: Define these missing variables here
const signupModalUser = document.getElementById('signup-modal-user');
const signupModalEmployer = document.getElementById('signup-modal-employer');

// --------------------------------------------------
// 2. PASSWORD UTILITIES (Toggles and Validation)
// --------------------------------------------------

function isValidPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

// Password Toggle Listeners (FIXED: Runs immediately as part of the module)
document.getElementById('toggle-user-password')?.addEventListener('click', function() {
    const pwd = document.getElementById('user-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});

document.getElementById('toggle-user-confirm-password')?.addEventListener('click', function() {
    const pwd = document.getElementById('user-confirm-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});

document.getElementById('toggle-employer-password')?.addEventListener('click', function() {
    const pwd = document.getElementById('employer-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});

document.getElementById('toggle-employer-confirm-password')?.addEventListener('click', function() {
    const pwd = document.getElementById('employer-confirm-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});


// --------------------------------------------------
// 3. FIREBASE AUTHENTICATION LOGIC
// --------------------------------------------------

// Google Sign-Up for User
document.getElementById('google-signup-user').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        alert(`Signed up as: ${result.user.displayName}`);
        signupModalUser?.classList.add('hidden');
        window.location.href = 'dashboard-user.html';
    } catch (error) {
        alert('Google sign-in failed.');
    }
});

// Google Sign-Up for Employer
document.getElementById('google-signup-employer').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        alert(`Signed up as: ${result.user.displayName}`);
        signupModalEmployer?.classList.add('hidden');
        window.location.href = 'dashboard-employer.html';
    } catch (error) {
        alert('Google sign-in failed.');
    }
});

// Email/Password Sign-Up (User) with Validation
document.getElementById('user-signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('user-password').value;
    const confirm = document.getElementById('user-confirm-password').value;

    if (password !== confirm) {
        alert('Passwords do not match.');
        return;
    }
    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
        return;
    }

    const email = document.getElementById('user-email').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            role: "user",
            name: document.getElementById('user-name').value,
            email: email
        });
        window.location.href = 'dashboard-user.html';
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    }
});

// Email/Password Sign-Up (Employer) with Validation
document.getElementById('employer-signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('employer-password').value;
    const confirm = document.getElementById('employer-confirm-password').value;

    if (password !== confirm) {
        alert('Passwords do not match.');
        return;
    }
    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
        return;
    }
    
    const email = document.getElementById('employer-email').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            role: "employer",
            name: document.getElementById('employer-name').value,
            email: email
        });
        window.location.href = 'dashboard-employer.html';
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    }
});

// Handle Sign In
document.getElementById('signin-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            window.location.href = role === "user" ? 'dashboard-user.html' : 'dashboard-employer.html';
        } else {
            alert('User profile not found.');
        }
    } catch (error) {
        alert('Sign in failed: ' + error.message);
    }
});

// Handle Forgot Password
document.getElementById('forgot-password-btn').addEventListener('click', async function() {
    const email = document.getElementById('signin-email').value;
    if (!email) {
        alert('Please enter your email address above first.');
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent! Please check your inbox.');
    } catch (error) {
        alert('Error sending password reset email: ' + error.message);
    }
});