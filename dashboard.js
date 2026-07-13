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
    getDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit
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
    await loadActivations();
    await loadActiveNumbers();
    showDashboardMessage();

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

/* ==========================================
   PART 3/4
   LOAD RECENT ACTIVATIONS
========================================== */

async function loadActivations() {

    if (!currentUser) return;

    activationTable.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;padding:20px;">
                Loading...
            </td>
        </tr>
    `;

    try {

        const activationsRef = collection(db, "activations");

        const q = query(
            activationsRef,
            where("uid", "==", currentUser.uid),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        const snapshot = await getDocs(q);

        activationTable.innerHTML = "";

        if (snapshot.empty) {

            activationTable.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:20px;color:#999;">
                        No activations yet
                    </td>
                </tr>
            `;

            return;
        }

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            const date =
                data.createdAt
                    ? data.createdAt.toDate().toLocaleDateString()
                    : "-";

            activationTable.innerHTML += `
                <tr>
                    <td>${data.service || "-"}</td>
                    <td>${data.phoneNumber || "-"}</td>
                    <td>${data.smsCode || "Waiting..."}</td>
                    <td>₦${Number(data.price || 0).toLocaleString()}</td>
                    <td>${data.status || "Waiting"}</td>
                    <td>${date}</td>
                </tr>
            `;
        });

    } catch (error) {

        console.error("Activation Error:", error);

        activationTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;padding:20px;">
                    Failed to load activations
                </td>
            </tr>
        `;

    }

}

/* ==========================================
   REFRESH ACTIVATIONS
========================================== */

if (refreshBtn) {

    refreshBtn.addEventListener("click", async () => {

        refreshBtn.disabled = true;
        refreshBtn.textContent = "Loading...";

        await loadActivations();

        refreshBtn.disabled = false;
        refreshBtn.textContent = "🔄 Refresh";

    });

}

/* ==========================================
   PART 4/4
   FINAL SETUP
========================================== */

/* ==========================================
   UPDATE WALLET BALANCE
========================================== */

async function refreshWallet() {

    try {

        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) return;

        const data = snap.data();

        wallet = Number(data.wallet || 0);

        walletBalance.textContent =
            "₦" + wallet.toLocaleString();

    } catch (error) {

        console.error("Wallet Error:", error);

    }

}

/* ==========================================
   DASHBOARD REFRESH
========================================== */

async function refreshDashboard() {

    await refreshWallet();
    await loadActivations();

}

/* ==========================================
   AUTO REFRESH EVERY 30 SECONDS
========================================== */

setInterval(() => {

    if (currentUser) {

        refreshDashboard();

    }

}, 30000);

/* ==========================================
   HELPER FUNCTIONS
========================================== */

function formatPrice(price) {

    return "₦" + Number(price || 0).toLocaleString();

}

function formatStatus(status) {

    switch (status) {

        case "Received":
            return "✅ Received";

        case "Waiting":
            return "⏳ Waiting";

        case "Cancelled":
            return "❌ Cancelled";

        case "Expired":
            return "⌛ Expired";

        default:
            return status || "-";

    }

}

/* ==========================================
   DASHBOARD READY
========================================== */

console.log("✅ RaxySMS Dashboard Loaded Successfully");

/* ==========================================
   DASHBOARD MESSAGE
========================================== */

function showDashboardMessage() {

    const messageBox = document.getElementById("dashboardMessage");
    const messageText = document.getElementById("dashboardMessageText");

    if (!messageBox || !messageText) return;

    const type = sessionStorage.getItem("purchaseType");
    const message = sessionStorage.getItem("purchaseMessage");

    if (!type || !message) return;

    messageBox.style.display = "block";
    messageBox.className = "dashboard-message " + type;
    messageText.textContent = message;

    sessionStorage.removeItem("purchaseType");
    sessionStorage.removeItem("purchaseMessage");

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 5000);

}


/* ==========================================
   LOAD ACTIVE NUMBERS
========================================== */

async function loadActiveNumbers() {

    const container = document.getElementById("activeNumbers");

    if (!container || !currentUser) return;

    container.innerHTML = "";

    try {

        const q = query(
            collection(db, "activations"),
            where("uid", "==", currentUser.uid),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            container.innerHTML = `
                <div class="active-card">
                    <h3>📱 Active Numbers</h3>
                    <p>No active numbers.</p>
                </div>
            `;

            return;
        }

        snapshot.forEach(docSnap => {

            const data = docSnap.data();

            let badge = "status-waiting";

            if (data.status === "Received") {
                badge = "status-success";
            }

            if (data.status === "Expired") {
                badge = "status-expired";
            }

            container.innerHTML += `
                <div class="active-card">

                    <h3>${data.service || "-"}</h3>

                    <p><strong>Number:</strong> ${data.phoneNumber || "-"}</p>

                    <p><strong>SMS:</strong> ${data.smsCode || "Waiting for SMS..."}</p>

                    <span class="status-badge ${badge}">
                        ${data.status || "Waiting"}
                    </span>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}
