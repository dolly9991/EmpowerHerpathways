// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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