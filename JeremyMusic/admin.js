// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDatabase, ref as dbRef, onValue as dbOnValue, off as dbOff } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Firebase config (same as index.js)
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
const auth = getAuth(app);
const db = getDatabase(app);
let subscribersRef = null;
let subscribersListener = null;

// Login form handler and auth state listener
document.addEventListener('DOMContentLoaded', () => {
	const loginContainer = document.querySelector('.login-container');
	const adminDashboard = document.getElementById('adminDashboard');
	const loginForm = document.getElementById('loginForm');
	const loginError = document.getElementById('loginError');
	const logoutBtn = document.getElementById('logoutBtn');

	// Attach login submit handler if the form exists on the page
	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			if (loginError) loginError.textContent = '';
			const email = document.getElementById('email').value.trim();
			const password = document.getElementById('password').value;
			try {
				await signInWithEmailAndPassword(auth, email, password);
				// No redirect: onAuthStateChanged will toggle the UI
			} catch (err) {
				if (loginError) loginError.textContent = err.message || 'Login failed.';
			}
		});
	}

	// Logout button handler (optional)
	if (logoutBtn) {
		logoutBtn.addEventListener('click', async () => {
			try {
				await signOut(auth);
			} catch (err) {
				console.error('Sign out error:', err);
			}
		});
	}

	// Listen for auth state changes and toggle UI
	onAuthStateChanged(auth, (user) => {
		if (user) {
			// Show admin UI
			if (loginContainer) loginContainer.style.display = 'none';
			if (adminDashboard) adminDashboard.style.display = 'block';

			// Attach realtime listener to /subscribers
			try {
				subscribersRef = dbRef(db, 'subscribers');
				subscribersListener = (snapshot) => {
					const tbody = document.querySelector('#subscribersTable tbody');
					if (!tbody) return;
					tbody.innerHTML = '';
					let subscribersFound = false;
					if (snapshot && snapshot.exists()) {
						snapshot.forEach((childSnap) => {
							const data = childSnap.val() || {};
							const tr = document.createElement('tr');
							const phoneTd = document.createElement('td');
							const emailTd = document.createElement('td');
							phoneTd.textContent = data.phone || '';
							emailTd.textContent = data.email || '';
							tr.appendChild(phoneTd);
							tr.appendChild(emailTd);
							tbody.appendChild(tr);
							subscribersFound = true;
						});
					}

					if (!subscribersFound) {
						const tr = document.createElement('tr');
						const td = document.createElement('td');
						td.setAttribute('colspan', '2');
						td.textContent = 'No subscribers.';
						tr.appendChild(td);
						tbody.appendChild(tr);
					}
				};
				// Start listening
				dbOnValue(subscribersRef, subscribersListener);
			} catch (err) {
				console.error('Failed to attach subscribers listener:', err);
			}
		} else {
			// Show login UI
			if (loginContainer) loginContainer.style.display = 'block';
			if (adminDashboard) adminDashboard.style.display = 'none';

			// Detach realtime listener if attached
			try {
				if (subscribersRef && subscribersListener) {
					dbOff(subscribersRef, 'value', subscribersListener);
					subscribersRef = null;
					subscribersListener = null;
				}
				// Clear table body
				const tbody = document.querySelector('#subscribersTable tbody');
				if (tbody) tbody.innerHTML = '';
			} catch (err) {
				console.error('Failed to detach subscribers listener:', err);
			}
		}
	});
});
