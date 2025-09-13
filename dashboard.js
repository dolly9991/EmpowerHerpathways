import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Use your existing Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyARRV-aqwvKNUaI-YA58RWpTFHO-8fIkvk",
    authDomain: "redroses-8852b.firebaseapp.com",
    projectId: "redroses-8852b",
    storageBucket: "redroses-8852b.firebasestorage.app",
    messagingSenderId: "1021207314289",
    appId: "1:1021207314289:web:1b5f063d681e80e84300d0",
    measurementId: "G-FFL6MTL731"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('logout-btn').addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "index.html";
});