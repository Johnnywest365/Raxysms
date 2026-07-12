/* ==========================================
   RAXYSMS DASHBOARD
   PART 1/5
========================================== */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* ==========================================
   DOM ELEMENTS
========================================== */

const userName = document.getElementById("userName");
const walletBalance = document.getElementById("walletBalance");
const profileImage = document.getElementById("profileImage");

const addFundsBtn = document.getElementById("addFundsBtn");
const historyBtn = document.getElementById("historyBtn");
const supportBtn = document.getElementById("supportBtn");

const usaBtn = document.getElementById("usaBtn");
const countriesBtn = document.getElementById("countriesBtn");

const refreshBtn = document.getElementById("refreshBtn");
const activationTable = document.getElementById("activationTable");

const accountsBtn = document.getElementById("accountsBtn");
const historyBottomBtn = document.getElementById("historyBottomBtn");
const apiBtn = document.getElementById("apiBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let currentUser = null;
let wallet = 0;

/* ==========================================
   AUTH CHECK
========================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    await loadUser();

});

/* ==========================================
   LOAD USER DATA
========================================== */

async function loadUser() {

    try {

        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            alert("User profile not found in Firestore.");
            return;
        }

        const data = snap.data();

        userName.textContent =
            data.name ||
            currentUser.displayName ||
            currentUser.email ||
            "User";

        wallet = Number(data.wallet || 0);

        walletBalance.textContent =
            "₦" + wallet.toLocaleString();

        if (data.photoURL) {
            profileImage.src = data.photoURL;
        }

    } catch (error) {

        console.error("Dashboard Error:", error);
        alert(error.message);

    }

}

/* ==========================================
   PART 2/5
   BUTTONS & NAVIGATION
========================================== */

// Add Funds
if (addFundsBtn) {
    addFundsBtn.addEventListener("click", () => {
        window.location.href = "fund-wallet.html";
    });
}

// History Button (Top)
if (historyBtn) {
    historyBtn.addEventListener("click", () => {
        window.location.href = "history.html";
    });
}

// Support
if (supportBtn) {
    supportBtn.addEventListener("click", () => {
        window.open("https://t.me/RaxySMS", "_blank");
    });
}

// Buy USA Number
if (usaBtn) {
    usaBtn.addEventListener("click", () => {
        window.location.href = "usa-numbers.html";
    });
}

// Buy All Countries
if (countriesBtn) {
    countriesBtn.addEventListener("click", () => {
        window.location.href = "countries.html";
    });
}

// Refresh
if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
        location.reload();
    });
}

/* ==========================================
   BOTTOM NAVIGATION
========================================== */

// Buy Account
if (accountsBtn) {
    accountsBtn.addEventListener("click", () => {
        window.location.href = "buy-account.html";
    });
}

// History
if (historyBottomBtn) {
    historyBottomBtn.addEventListener("click", () => {
        window.location.href = "history.html";
    });
}

// Home
const homeBtn = document.getElementById("homeBtn");

if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}

// API
if (apiBtn) {
    apiBtn.addEventListener("click", () => {
        window.location.href = "api.html";
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        try {

            await signOut(auth);
            window.location.href = "login.html";

        } catch (error) {

            console.error(error);
            alert(error.message);

        }

    });
}
