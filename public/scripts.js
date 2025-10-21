// Utility function to close the Bootstrap modal
function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    // CRITICAL FIX: Check if the modal element exists and try to get the instance.
    // We use the Bootstrap 5 Modal API correctly to retrieve the instance and hide it.
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
}

// -------------------------------------------------------------
// USER REDIRECTION HELPER
// -------------------------------------------------------------
function redirectToDashboard(accountType) {
    let redirectUrl;
    // Determine the correct dashboard based on the user's stored account type
    if (accountType === 'Client') {
        redirectUrl = '/client-dashboard.html'; 
    } else if (accountType === 'Business') {
        redirectUrl = '/business-dashboard.html';
    } else {
        // Fallback for safety if accountType is missing or invalid
        redirectUrl = '/index.html';
    }
    // Perform the redirection
    window.location.href = redirectUrl;
}

// -------------------------------------------------------------
// FIREBASE SIGN-UP LOGIC (Uses ID: signupForm)
// -------------------------------------------------------------
$('#signupForm').on('submit', function(e) {
    e.preventDefault();

    $('#signupStatus').html(''); 

    const email = $('#signupEmail').val();
    const password = $('#signupPassword').val();
    const passwordConfirm = $('#signupPasswordConfirm').val(); 
    
    const firstName = $('#signupFirstName').val();
    const lastName = $('#signupLastName').val();
    const accountType = $('#accountType').val(); 
    const fieldOfInterest = $('#fieldOfInterest').val();

    if (password !== passwordConfirm) {
        $('#signupStatus').html('<div class="alert alert-danger mt-2" role="alert"><i class="fas fa-times-circle me-2"></i> Sign-up Failed: Passwords do not match.</div>');
        console.error("Sign-up Error: Passwords do not match.");
        return; 
    }

    // Show loading spinner
    $('#signupStatus').html('<div class="text-center mt-2 submission-status"><div class="spinner-border text-purple-600" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2 text-purple-600">Creating account...</p></div>');

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Save profile data to Firestore
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
            // Success: Close modal and redirect
            closeModal('signupModal');
            redirectToDashboard(accountType);
        })
        .catch((error) => {
            // Error handling
            const code = error.code;
            let errorMessage = error.message;

            if (code === 'auth/email-already-in-use') {
                errorMessage = 'This email address is already in use.';
            } else if (code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            } else {
                // General error display
                errorMessage = errorMessage.replace('Firebase: Error (auth/', '').replace(').', '');
            }

            $('#signupStatus').html(`<div class="alert alert-danger mt-2" role="alert"><i class="fas fa-exclamation-triangle me-2"></i> Sign-up Failed: ${errorMessage}</div>`);
            console.error("Sign-up Error:", error);
        });
});

// -------------------------------------------------------------
// FIREBASE LOGIN LOGIC (Uses ID: loginForm)
// -------------------------------------------------------------
$('#loginForm').on('submit', function(e) {
    e.preventDefault();

    $('#loginStatus').html(''); 

    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    const rememberMe = $('#rememberMe').prop('checked'); // Get the state of the "Remember Me" checkbox
    
    // Set persistence (session or local)
    // 'local' keeps the user logged in indefinitely, 'session' only until the browser window is closed.
    const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;

    // Show loading spinner
    $('#loginStatus').html('<div class="text-center mt-2 submission-status"><div class="spinner-border text-purple-600" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2 text-purple-600">Logging in...</p></div>');

    auth.setPersistence(persistence)
        .then(() => {
            // 1. Sign in with Email and Password
            return auth.signInWithEmailAndPassword(email, password);
        })
        .then((userCredential) => {
            const user = userCredential.user;
            
            // 2. Fetch the user's account type from Firestore
            return db.collection("users").doc(user.uid).get();
        })
        .then((doc) => {
            if (doc.exists) {
                const accountType = doc.data().accountType;

                // Success: Close modal and redirect
                closeModal('loginModal');
                redirectToDashboard(accountType);
            } else {
                // If profile data is missing, prompt user to contact support
                $('#loginStatus').html('<div class="alert alert-warning mt-2" role="alert"><i class="fas fa-exclamation-circle me-2"></i> Profile data not found. Please contact support.</div>');
                // Force logout since auth succeeded but profile failed
                auth.signOut();
            }
        })
        .catch((error) => {
            // Error handling for login
            const code = error.code;
            let errorMessage = error.message;

            if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password.';
            } else if (code === 'auth/invalid-email') {
                errorMessage = 'The email address format is invalid.';
            } else {
                errorMessage = errorMessage.replace('Firebase: Error (auth/', '').replace(').', '');
            }

            $('#loginStatus').html(`<div class="alert alert-danger mt-2" role="alert"><i class="fas fa-exclamation-triangle me-2"></i> Login Failed: ${errorMessage}</div>`);
            console.error("Login Error:", error);
        });
});

