// scripts.js
// =========================================================================
// This file contains JavaScript code for handling UI interactions,
// including mobile menu toggling, tabbed interfaces, and Chart.js initialization.
// It also manages modal dialogs for user and employer sign-ups.
// Note: Firebase initialization and authentication logic are handled in a separate file (firebase.js).
// =========================================================================

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
const signupModalUser = document.getElementById('signup-modal-user');
const signupModalEmployer = document.getElementById('signup-modal-employer');
const joinUserBtn = document.getElementById('join-user-btn');
const joinEmployerBtn = document.getElementById('join-employer-btn');

// Open correct modal
joinUserBtn.addEventListener('click', () => {
    signupModalUser.classList.remove('hidden');
});
joinEmployerBtn.addEventListener('click', () => {
    signupModalEmployer.classList.remove('hidden');
});

// Close modals
document.querySelectorAll('.modal-close-button').forEach(btn => {
    btn.addEventListener('click', () => {
        signupModalUser.classList.add('hidden');
        signupModalEmployer.classList.add('hidden');
    });
});

// Optional: close modal when clicking outside the modal container
signupModalUser.addEventListener('click', (e) => {
    if (e.target === signupModalUser) {
        signupModalUser.classList.add('hidden');
    }
});
signupModalEmployer.addEventListener('click', (e) => {
    if (e.target === signupModalEmployer) {
        signupModalEmployer.classList.add('hidden');
    }
});

