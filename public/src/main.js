// =========================================================================
// 1. IMPORTS
//    - These import the already initialized services (auth, db) 
//      and the specific functions (signInWithPopup, etc.) 
//      from your new, separate config file (src/lib/firebase.js)
// =========================================================================

import { 
    auth, 
    db, 
    provider, // GoogleAuthProvider instance
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    setDoc, 
    doc, 
    getDoc,
    sendPasswordResetEmail // Assuming you exported this function
} from './lib/firebase.js'; // <-- IMPORTANT: Check this path!

// =========================================================================
// 2. FIREBASE AUTH & FIRESTORE LOGIC
//    - This is the entire content of your original first <script type="module"> block, 
//      minus the initialization (which is now in firebase.js)
// =========================================================================

// NOTE: The variables 'signupModalUser' and 'signupModalEmployer' are not defined 
// in this code block, but are assumed to be defined elsewhere in your HTML or script.
const signinModal = document.getElementById('signin-modal');
const closeSigninModal = document.getElementById('close-signin-modal');

document.getElementById('google-signup-user').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        alert(`Signed up as: ${result.user.displayName}`);
        // Assuming signupModalUser is defined globally or imported
        if (typeof signupModalUser !== 'undefined') {
            signupModalUser.classList.add('hidden');
        }
        window.location.href = 'dashboard-user.html';
    } catch (error) {
        alert('Google sign-in failed.');
    }
});

document.getElementById('google-signup-employer').addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        alert(`Signed up as: ${result.user.displayName}`);
        // Assuming signupModalEmployer is defined globally or imported
        if (typeof signupModalEmployer !== 'undefined') {
            signupModalEmployer.classList.add('hidden');
        }
        window.location.href = 'dashboard-employer.html';
    } catch (error) {
        alert('Google sign-in failed.');
    }
});

// User form sign up
document.getElementById('user-signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save role to Firestore
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

// Employer form sign up
document.getElementById('employer-signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('employer-email').value;
    const password = document.getElementById('employer-password').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save role to Firestore
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

// Open sign in modal from either sign up modal
document.getElementById('open-signin-user').addEventListener('click', () => {
    signinModal.classList.remove('hidden');
});
document.getElementById('open-signin-employer').addEventListener('click', () => {
    signinModal.classList.remove('hidden');
});

// Close sign in modal
closeSigninModal.addEventListener('click', () => {
    signinModal.classList.add('hidden');
});
signinModal.addEventListener('click', (e) => {
    if (e.target === signinModal) {
        signinModal.classList.add('hidden');
    }
});

// Handle sign in
document.getElementById('signin-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === "user") {
                window.location.href = 'dashboard-user.html';
            } else if (role === "employer") {
                window.location.href = 'dashboard-employer.html';
            } else {
                alert('User role not set.');
            }
        } else {
            alert('User profile not found.');
        }
    } catch (error) {
        alert('Sign in failed: ' + error.message);
    }
});

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

// =========================================================================
// 3. UI/VALIDATION LOGIC
//    - This is the content of your original second <script> block
// =========================================================================

// Show/hide password for user sign up
document.getElementById('toggle-user-password').addEventListener('click', function() {
    const pwd = document.getElementById('user-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});
document.getElementById('toggle-user-confirm-password').addEventListener('click', function() {
    const pwd = document.getElementById('user-confirm-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});
// Show/hide password for employer sign up
document.getElementById('toggle-employer-password').addEventListener('click', function() {
    const pwd = document.getElementById('employer-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});
document.getElementById('toggle-employer-confirm-password').addEventListener('click', function() {
    const pwd = document.getElementById('employer-confirm-password');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        this.textContent = 'Hide';
    } else {
        pwd.type = 'password';
        this.textContent = 'Show';
    }
});

function isValidPassword(password) {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

// Confirm password validation for user
document.getElementById('user-signup-form').addEventListener('submit', function(e) {
    const password = document.getElementById('user-password').value;
    const confirm = document.getElementById('user-confirm-password').value;
    if (password !== confirm) {
        e.preventDefault();
        alert('Passwords do not match.');
        return false;
    }
    if (!isValidPassword(password)) {
        e.preventDefault();
        alert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
        return false;
    }
});

// Confirm password validation for employer
document.getElementById('employer-signup-form').addEventListener('submit', function(e) {
    const password = document.getElementById('employer-password').value;
    const confirm = document.getElementById('employer-confirm-password').value;
    if (password !== confirm) {
        e.preventDefault();
        alert('Passwords do not match.');
        return false;
    }
    if (!isValidPassword(password)) {
        e.preventDefault();
        alert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
        return false;
    }
});