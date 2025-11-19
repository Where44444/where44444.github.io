
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
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

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

    // Testimonials: read and write to Realtime Database under 'testimonials'

    const listEl = document.getElementById('testimonials-list');
    const nameInput = document.getElementById('testimonial-name');
    const commentInput = document.getElementById('testimonial-comment');
    if (!listEl || !nameInput || !commentInput) return;

    const testimonialsRef = ref(db, 'testimonials');

    function escapeHtml(str = '') {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderSnapshot(snapshot) {
        listEl.innerHTML = '';
        const entries = [];
        snapshot.forEach((child) => {
            entries.push(child.val());
        });
        // show newest first
        entries.reverse();
        entries.forEach((data) => {
            const item = document.createElement('div');
            item.className = 'testimonial-item';
            item.style.padding = '8px 0';
            item.innerHTML = `\n                <div style="font-weight:600">${escapeHtml(data.name || 'Anonymous')}</div>\n                <div style="font-size:12px; color:#666">${escapeHtml(data.date || '')}</div>\n                <div style="margin-top:6px">${escapeHtml(data.comment || '')}</div>\n            `;
            listEl.appendChild(item);
        });
    }

    // listen for changes
    onValue(testimonialsRef, (snapshot) => {
        renderSnapshot(snapshot);
    }, (err) => console.error('Failed to read testimonials', err));

    const testimonialsRef2 = ref(db, 'testimonialsPending');
    let submitButton = document.getElementById("testimonialSubmit");
    submitButton.addEventListener("click", async function () {
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();
        if (!comment) {
            alert('Please enter a comment.');
            return;
        }
        const d = new Date();
        const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
        try {
            const newRef = push(testimonialsRef2);
            await set(newRef, { name, date: dateStr, comment });
            nameInput.value = '';
            commentInput.value = '';
            alert("Thank you for posting! Your testimonial will be reviewed.")
        } catch (err) {
            console.error('Failed to post testimonial', err);
            alert('Failed to post testimonial. Please try again later.');
        }
    });
});



// Slideshow initialization
function initSlideshows() {
    const carousels = document.querySelectorAll('.slideshow');
    carousels.forEach((el) => {
        const slides = Array.from(el.querySelectorAll('.slide'));
        if (!slides.length) return;

        const indicators = el.querySelector('.sl-indicators');
        const prevBtn = el.querySelector('.sl-prev');
        const nextBtn = el.querySelector('.sl-next');
        const playBtn = el.querySelector('.sl-play');
        const pauseBtn = el.querySelector('.sl-pause');
        const autoplayAttr = el.dataset.autoplay === 'true';
        const interval = parseInt(el.dataset.interval || '4000', 10);

        let current = 0;
        let timer = null;

        // build indicators
        slides.forEach((s, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            btn.title = `Slide ${i + 1}`;
            btn.addEventListener('click', () => { show(i); pause(); });
            indicators.appendChild(btn);
        });

        function updateIndicators() {
            const nodes = indicators.querySelectorAll('button');
            nodes.forEach((b, idx) => b.setAttribute('aria-selected', idx === current ? 'true' : 'false'));
        }

        function show(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            slides.forEach((s, i) => {
                s.classList.toggle('active', i === index);
            });
            current = index;
            updateIndicators();
        }

        function next() { show(current + 1); }
        function prev() { show(current - 1); }

        function play() {
            if (timer) return;
            timer = setInterval(next, interval);
            el.classList.add('playing');
        }

        function pause() {
            if (!timer) return;
            clearInterval(timer);
            timer = null;
            el.classList.remove('playing');
        }

        // attach controls
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); pause(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); pause(); });
        if (playBtn) playBtn.addEventListener('click', () => play());
        if (pauseBtn) pauseBtn.addEventListener('click', () => pause());

        // keyboard support
        el.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); pause(); }
            if (e.key === 'ArrowRight') { next(); pause(); }
            if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); timer ? pause() : play(); }
        });

        // pause on hover
        el.addEventListener('mouseenter', () => pause());
        el.addEventListener('mouseleave', () => { if (autoplayAttr) play(); });

        // show first slide
        show(0);
        if (autoplayAttr) play();
    });
}

// Initialize when DOM ready
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSlideshows);
else initSlideshows();
