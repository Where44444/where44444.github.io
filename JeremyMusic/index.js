
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2HKsO-TrReCH-tC3ATDozuQzaPjIqR0g",
    authDomain: "jeremymusic-c117d.firebaseapp.com",
    projectId: "jeremymusic-c117d",
    storageBucket: "jeremymusic-c117d.firebasestorage.app",
    messagingSenderId: "103099955855",
    appId: "1:103099955855:web:c1bc1a4a36c604945b8efa",
    measurementId: "G-4QEVLNKMVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Import Realtime Database functions
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Initialize Realtime Database
const db = getDatabase(app);

// Newsletter subscription handler
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('.newsletter-submit');
    if (!submitBtn) return;
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const emailInput = document.querySelector('input[type="email"].newsletter-input');
        const phoneInput = document.querySelector('input[type="tel"].newsletter-input');
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        if (!email && !phone) {
            alert('Please enter an email or phone number.');
            return;
        }
        try {
            const subscribersRef = ref(db, 'subscribers');
            const newSubRef = push(subscribersRef);
            await set(newSubRef, { email, phone });
            alert('Thank you for subscribing!');
            if (emailInput) emailInput.value = '';
            if (phoneInput) phoneInput.value = '';
        } catch (err) {
            alert('Subscription failed. Please try again later.');
            console.error(err);
        }
    });
});
