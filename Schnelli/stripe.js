/* global firebase, firebaseui, Stripe */

/**
 * Replace with your publishable key from the Stripe Dashboard
 * https://dashboard.stripe.com/apikeys
 */
const STRIPE_PUBLISHABLE_KEY = "pk_live_51MHwbAKT5WXr31EWu7P5ROZ9hndpPofBbcY78GndcwKnYcirfHHoE9tyaQ7AUxAuIM1x0Abszi4pfKSuu5RF3Kbs00TZhfIfVV";

/**
 * Your Firebase config from the Firebase console
 * https://firebase.google.com/docs/web/setup#config-object */


var firebaseConfig = {
  apiKey: "AIzaSyBiHDF9LJepi4QyOhHeayZT_etKN5AjlGs",
  authDomain: "appliance-parts-f45cd.firebaseapp.com",
  databaseURL: "https://appliance-parts-f45cd.firebaseio.com",
  projectId: "appliance-parts-f45cd",
  storageBucket: "appliance-parts-f45cd.appspot.com",
  messagingSenderId: "671454569102",
  appId: "1:671454569102:web:479b1d3a11bedf601c1fdf"
};

/**
 * Initialize Firebase
 */
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
let currentUser;


document.getElementById("firebaseui-auth-container").style.display = "none";
document.getElementById("start_buttons").style.display = "none";

function signIn() {
  var ele = document.getElementsByClassName("firebaseui-title")[0];
  if (ele != null) {
    document.getElementById("firebaseui-auth-container").style.display = "";
    document.getElementById("start_buttons").style.display = "none";
    ele.innerHTML = "Sign in";
  }
}

function newAccount() {
  var ele = document.getElementsByClassName("firebaseui-title")[0];
  if (ele != null) {
    document.getElementById("firebaseui-auth-container").style.display = "";
    document.getElementById("start_buttons").style.display = "none";
    ele.innerHTML = "Create account";
  }
}

function accountBack() {
  document.getElementById("firebaseui-auth-container").style.display = "none";
  document.getElementById("start_buttons").style.display = "";
  firebaseUI.start('#firebaseui-auth-container', firebaseUiConfig);
}

/**
 * Firebase Authentication configuration
 */
const firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
const firebaseUiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    },
    uiShown: () => {
      document.querySelector('#loader').style.display = 'none';
      var ele = document.getElementsByClassName("firebaseui-id-name")[0];
      if (ele != null) {
        console.log(ele.value);
      }
    },
  },
  signInFlow: 'popup',
  // signInSuccessUrl: '/',
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  // Your terms of service url.
  tosUrl: './EULA.html',
  // Your privacy policy url.
  privacyPolicyUrl: './Privacy_Policy.html',
};

firebase.auth().onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    // console.log("Logged in");
    document.querySelector('#loader').style.display = 'none';
    document.getElementById("loader0").style.display = "";
    document.getElementById("start_buttons").style.display = "none";
    document.getElementById("firebaseui-auth-container").style.display = "none";
    document.querySelector('main').style.display = "block";
    document.querySelector(".products").innerHTML = "";
    document.querySelector("#my-subscription").style.display = "none";
    document.querySelector("#subscribe").style.display = "none";
    currentUser = firebaseUser.uid;
    showInfoForm(firebaseUser);
  } else {
    // console.log("Logged out");
    document.getElementById("loader0").style.display = "none";
    document.getElementById("start_buttons").style.display = "";
    document.querySelector('main').style.display = 'none';
    firebaseUI.start('#firebaseui-auth-container', firebaseUiConfig);
  }
});


function showInfoForm(firebaseUser) {
  // console.log(firebaseUser.displayName);
  // console.log(firebaseUser.email);
  var now = new Date();
  var date = new Date(Number(firebaseUser.metadata.a));
  if (now.getTime() - date.getTime() < 30000) {
    document.getElementById("info-form").style.display = "";
    document.getElementById("loader0").style.display = "none";

    document.getElementById("form_name").value = firebaseUser.displayName;
    document.getElementById("form_email").value = firebaseUser.email;
  }
  else {
    startDataListeners();
    document.getElementById("loader0").style.display = "";
  }
}

function saveInfoForm() {
  var valid = true;
  document.getElementById("field_error_name").style.display = "none";
  document.getElementById("field_error_email").style.display = "none";
  document.getElementById("field_error_phone").style.display = "none";
  document.getElementById("field_error_company").style.display = "none";

  var ele = document.getElementById("form_name");
  if (ele.value == "") {
    document.getElementById("field_error_name").style.display = "block";
    valid = false;
  }
  ele = document.getElementById("form_email");
  if (ele.value == "") {
    document.getElementById("field_error_email").style.display = "block";
    valid = false;
  }
  ele = document.getElementById("form_phone");
  if (ele.value == "") {
    document.getElementById("field_error_phone").style.display = "block";
    valid = false;
  }
  ele = document.getElementById("form_company");
  if (ele.value == "") {
    document.getElementById("field_error_company").style.display = "block";
    valid = false;
  }

  if (valid) {
    db.collection("new_customers").doc(currentUser).set({
      name: document.getElementById("form_name").value,
      email: document.getElementById("form_email").value,
      phone: document.getElementById("form_phone").value,
      company: document.getElementById("form_company").value,
      message: document.getElementById("form_message").value
    }).then(() => {
    })

    document.getElementById("info-form").style.display = "none";
    document.getElementById("loader0").style.display = "";
    startDataListeners();
  }
}

/**
 * Data listeners
 */
function startDataListeners() {
  // Get all our products and render them to the page
  const products = document.querySelector(".products");
  const template = document.querySelector("#product");
  const template2 = document.querySelector("#product2");

  db.collection("products")
    .where("active", "==", true)
    .get()
    .then(function (querySnapshot) {
      products.innerHTML = "";
      document.getElementById("loader0").style.display = "none";

      const container = template2.content.cloneNode(true);
      container.querySelector("h2").innerText = "Free Trial (No Payment Method Required)";
      container.querySelector(".description").innerText = "Allows access to massive database of Appliance parts for Model Numbers, Manufacturers, Equivalencies, and Descriptions. (14-Day Free Trial)";
      products.appendChild(container);

      querySnapshot.forEach(async function (doc) {
        const priceSnap = await doc.ref
          .collection("prices")
          .orderBy("unit_amount")
          .get();
        if (!"content" in document.createElement("template")) {
          console.error("Your browser doesn't support HTML template elements.");
          return;
        }

        const product = doc.data();
        const container = template.content.cloneNode(true);

        container.querySelector("h2").innerText = product.name;
        container.querySelector(".description").innerText =
          product.description || "";
        // Prices dropdown
        var content0 = "";
        var i = 0;
        priceSnap.docs.forEach((doc) => {
          ++i;
          if (i == 1) {
            const priceId = doc.id;
            const priceData = doc.data();
            const content = document.createTextNode(
              `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: priceData.currency
              }).format((priceData.unit_amount / 100).toFixed(2))} per ${priceData.interval
              }`
            );
            content0 = content;
            const option = document.createElement("option");
            option.value = priceId;
            option.appendChild(content);
            container.querySelector("#price").appendChild(option);
          }
        });
        container.querySelector("#price").style.display = "none";
        container.querySelector("#price_div").innerHTML = content0.textContent;

        if (product.images.length) {
          const img = container.querySelector("img");
          img.src = product.images[0];
          img.alt = product.name;
        }

        const form = container.querySelector("form");
        form.addEventListener("submit", subscribe);

        products.appendChild(container);
      });
    });

  db.collection("customers")
    .doc(currentUser)
    .collection("subscriptions")
    .where("status", "in", ["trialing", "active"])
    .onSnapshot(async (snapshot) => {
      if (snapshot.empty) {
        // Show products
        document.querySelector("#my-subscription").style.display = "none";
        document.querySelector("#subscribe").style.display = "block";
        return;
      }
      document.querySelector("#my-subscription").style.display = "block";
      document.querySelector("#subscribe").style.display = "none";
      // In this implementation we only expect one Subscription to exist
      const subscription = snapshot.docs[0].data();
      const priceData = (await subscription.price.get()).data();
      document.querySelector(
        "#my-subscription p"
      ).textContent = `You are paying ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: priceData.currency
      }).format((priceData.unit_amount / 100).toFixed(2))} per ${priceData.interval
        }`;
    });
}

function subscribeFreeTrial() {
  db.collection("free_trials").doc(currentUser).set({
    free_trial: true
  }).then(() => {
  })

  window.alert("Your free trial is now processing, try waiting 1-2 minutes before logging in");
  var windowReference = window.open();
  windowReference.location = "http://partscouter.org";
}

/**
 * Event listeners
 */
document
  .getElementById("signout")
  .addEventListener("click", () => firebase.auth().signOut());

// Checkout handler
async function subscribe(event) {
  document.getElementById("loader0").style.display = "";
  event.preventDefault();
  document.querySelectorAll('button').forEach((b) => (b.disabled = true));
  const formData = new FormData(event.target);

  const docRef = await db
    .collection("customers")
    .doc(currentUser)
    .collection("checkout_sessions")
    .add({
      price: formData.get("price"),
      allow_promotion_codes: true,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
      payment_method_types: ["card"]
    });

  // Wait for the CheckoutSession to get attached by the extension
  docRef.onSnapshot((snap) => {
    const { sessionId } = snap.data();
    if (sessionId) {
      // We have a session, let's redirect to Checkout
      const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
      stripe.redirectToCheckout({ sessionId });
      document.getElementById("loader0").style.display = "none";
    }
  });
}

// Billing portal handler
const functionLocation = "us-central1"; // us-central1, for example
document
  .querySelector("#billing-portal-button")
  .addEventListener("click", async (event) => {
    document.getElementById("loader0").style.display = "";
    document.querySelectorAll('button').forEach((b) => (b.disabled = true));

    // Call billing portal function
    const functionRef = firebase
      .app()
      .functions(functionLocation)
      .httpsCallable("ext-firestore-stripe-payments-createPortalLink");
    // .httpsCallable("ext-firestore-stripe-subscriptions-createPortalLink");
    var windowReference = window.open();
    const { data } = await functionRef({ returnUrl: "http://www.partscouter.org/stripe" });
    // window.location.assign(data.url);
    console.log("Recieved url");
    windowReference.location = data.url;
    // window.open(data.url);
    document.getElementById("loader0").style.display = "none";
    document.querySelectorAll('button').forEach((b) => (b.disabled = false));
  });

showSignUp();

function showSignUp() {
  document.getElementById("sign_up").style.display = "";
  document.getElementById("about").style.display = "none";

  document.getElementById("sign_up_button").style.backgroundColor = "white";
  document.getElementById("sign_up_button").style.color = "black";
  document.getElementById("about_button").style.backgroundColor = "#70A2FF";
  document.getElementById("about_button").style.color = "white";
}

function showAbout() {
  document.getElementById("sign_up").style.display = "none";
  document.getElementById("about").style.display = "";

  document.getElementById("about_button").style.backgroundColor = "white";
  document.getElementById("about_button").style.color = "black";
  document.getElementById("sign_up_button").style.backgroundColor = "#70A2FF";
  document.getElementById("sign_up_button").style.color = "white";
}