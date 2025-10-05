// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Modal Variables for Open/Close Buttons ---
    const signupModalUser = document.getElementById('signup-modal-user');
    const signupModalEmployer = document.getElementById('signup-modal-employer');
    const joinUserBtn = document.getElementById('join-user-btn');
    const joinEmployerBtn = document.getElementById('join-employer-btn');
    
    // --- Mobile Menu Functionality ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- Solutions Tabbed Interface ---
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

    // --- Chart.js Initialization ---
    const ctx = document.getElementById('impactChart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['For Women', 'For Employers', 'For Society'],
                datasets: [/* ... chart data ... */]
            },
            options: {
                // ... chart options ...
            }
        });
    }

    // --- Modal Control Logic (Open/Close Buttons) ---
    
    // Open correct modal
    joinUserBtn?.addEventListener('click', () => {
        signupModalUser?.classList.remove('hidden');
    });
    joinEmployerBtn?.addEventListener('click', () => {
        signupModalEmployer?.classList.remove('hidden');
    });

    // Close modals using the X button
    document.querySelectorAll('.modal-close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            signupModalUser?.classList.add('hidden');
            signupModalEmployer?.classList.add('hidden');
        });
    });

    // Close modal when clicking outside
    signupModalUser?.addEventListener('click', (e) => {
        if (e.target === signupModalUser) {
            signupModalUser.classList.add('hidden');
        }
    });
    signupModalEmployer?.addEventListener('click', (e) => {
        if (e.target === signupModalEmployer) {
            signupModalEmployer.classList.add('hidden');
        }
    });
});