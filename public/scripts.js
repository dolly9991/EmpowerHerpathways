
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu functionality
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
            // Hide mobile menu when a link is clicked
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });

            // Solutions Tabbed Interface
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => {
                        btn.classList.remove('active-tab');
                        btn.classList.add('inactive-tab');
                    });
                    button.classList.remove('inactive-tab');
                    button.classList.add('active-tab');

                    tabContents.forEach(content => content.classList.add('hidden'));

                    const tabIndex = Array.from(tabButtons).indexOf(button) + 1;
                    const contentToShow = document.getElementById(`content-${tabIndex}`);
                    contentToShow.classList.remove('hidden');
                });
            });

            // Chart.js initialization
            const ctx = document.getElementById('impactChart').getContext('2d');
            const impactChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['For Women', 'For Employers', 'For Society'],
                    datasets: [{
                        label: 'Positive Impact',
                        data: [100, 80, 95], // Placeholder data
                        backgroundColor: [
                            'rgba(126, 34, 206, 0.6)', // purple-600 with opacity
                            'rgba(126, 34, 206, 0.6)', // purple-600 with opacity
                            'rgba(126, 34, 206, 0.6)' // purple-600 with opacity
                        ],
                        borderColor: [
                            'rgb(126, 34, 206)',
                            'rgb(126, 34, 206)',
                            'rgb(126, 34, 206)'
                        ],
                        borderWidth: 1,
                        borderRadius: 10,
                        barPercentage: 0.6,
                        categoryPercentage: 0.7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = '';
                                    if (context.label === 'For Women') {
                                        label = 'Increased confidence, faster job search, higher success rates.';
                                    } else if (context.label === 'For Employers') {
                                        label = 'Access to diverse talent, enhanced DEI, higher retention.';
                                    } else if (context.label === 'For Society') {
                                        label = 'Closes gender pay gap, boosts economic empowerment.';
                                    }
                                    return label.split(', ');
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { display: false }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { font: { size: 14 } }
                        }
                    }
                }
            });
        });

        // Modal functionality
        const signupModalWoman = document.getElementById('signup-modal-woman');
        const signupModalEmployer = document.getElementById('signup-modal-employer');
        const joinWomanBtn = document.getElementById('join-woman-btn');
        const joinEmployerBtn = document.getElementById('join-employer-btn');
        
        // Open correct modal
        joinWomanBtn.addEventListener('click', () => {
            signupModalWoman.classList.remove('hidden');
        });
        joinEmployerBtn.addEventListener('click', () => {
            signupModalEmployer.classList.remove('hidden');
        });
        
        // Close modals
        document.querySelectorAll('.modal-close-button').forEach(btn => {
            btn.addEventListener('click', () => {
                signupModalWoman.classList.add('hidden');
                signupModalEmployer.classList.add('hidden');
            });
        });
        
        // Optional: close modal when clicking outside the modal container
        signupModalWoman.addEventListener('click', (e) => {
            if (e.target === signupModalWoman) {
                signupModalWoman.classList.add('hidden');
            }
        });
        signupModalEmployer.addEventListener('click', (e) => {
            if (e.target === signupModalEmployer) {
                signupModalEmployer.classList.add('hidden');
            }
        });


        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
        import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyARRV-aqwvKNUaI-YA58RWpTFHO-8fIkvk",
            authDomain: "redroses-8852b.firebaseapp.com",
            projectId: "redroses-8852b",
            storageBucket: "redroses-8852b.firebasestorage.app",
            messagingSenderId: "1021207314289",
            appId: "1:1021207314289:web:1b5f063d681e80e84300d0",
            measurementId: "G-FFL6MTL731"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        const db = getFirestore(app);

        document.getElementById('google-signup-woman').addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                alert(`Signed up as: ${result.user.displayName}`);
                signupModalWoman.classList.add('hidden');
                // After Google sign-in in woman modal
                window.location.href = 'dashboard-woman.html';
            } catch (error) {
                alert('Google sign-in failed.');
            }
        });

        document.getElementById('google-signup-employer').addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                alert(`Signed up as: ${result.user.displayName}`);
                signupModalEmployer.classList.add('hidden');
                // After Google sign-in in employer modal
                window.location.href = 'dashboard-employer.html';
            } catch (error) {
                alert('Google sign-in failed.');
            }
        });

        // Woman form sign up
document.getElementById('woman-signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('woman-email').value;
    const password = document.getElementById('woman-password').value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save role to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            role: "woman",
            name: document.getElementById('woman-name').value,
            email: email
        });
        window.location.href = 'dashboard-woman.html';
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

        const signinModal = document.getElementById('signin-modal');
        const closeSigninModal = document.getElementById('close-signin-modal');

        // Open sign in modal from either sign up modal
        document.getElementById('open-signin-woman').addEventListener('click', () => {
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
                    if (role === "woman") {
                        window.location.href = 'dashboard-woman.html';
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