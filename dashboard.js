/* ==========================================
   RAXYSMS DASHBOARD
   PART 1/4
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

const username = document.getElementById("username");
const walletBalance = document.getElementById("walletBalance");

const settingsBtn = document.getElementById("settingsBtn");

const fundWalletBtn = document.getElementById("fundWalletBtn");
const historyBtn = document.getElementById("historyBtn");
const supportBtn = document.getElementById("supportBtn");

const usaNumbersBtn = document.getElementById("usaNumbersBtn");
const allCountriesBtn = document.getElementById("allCountriesBtn");

const refreshBtn = document.getElementById("refreshBtn");
const activationsTable = document.getElementById("activationsTable");

const buyAccountBtn = document.getElementById("buyAccountBtn");
const historyNavBtn = document.getElementById("historyNavBtn");
const homeNavBtn = document.getElementById("homeNavBtn");
const apiBtn = document.getElementById("apiBtn");
const logoutBtn = document.getElementById("logoutBtn");

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let currentUser = null;
let currentWallet = 0;

/* ==========================================
   AUTH STATE
========================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    await loadUser();

    await loadActivations();

    showDashboardMessage();

});

/* ==========================================
   LOAD USER
========================================== */

async function loadUser() {

    try {

        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User account not found.");
            return;

        }

        const userData = userSnap.data();

        username.textContent =
            userData.name ||
            currentUser.displayName ||
            currentUser.email.split("@")[0];

        currentWallet = Number(userData.wallet || 0);

        walletBalance.textContent =
            "₦" + currentWallet.toLocaleString();

    }

    catch (error) {

        console.error("Load User Error:", error);

        alert(error.message);

    }

}

console.log("✅ Dashboard Part 1 Loaded");

/* ==========================================
   RAXYSMS DASHBOARD
   PART 2/4
   NAVIGATION & BUTTONS
========================================== */

/* ==========================================
   SETTINGS
========================================== */

if (settingsBtn) {

    settingsBtn.addEventListener("click", () => {

        window.location.href = "settings.html";

    });

}

/* ==========================================
   ADD FUNDS
========================================== */

if (fundWalletBtn) {

    fundWalletBtn.addEventListener("click", () => {

        window.location.href = "fund-wallet.html";

    });

}

/* ==========================================
   HISTORY
========================================== */

if (historyBtn) {

    historyBtn.addEventListener("click", () => {

        window.location.href = "history.html";

    });

}

/* ==========================================
   SUPPORT
========================================== */

if (supportBtn) {

    supportBtn.addEventListener("click", () => {

        window.open(
            "https://t.me/RaxySMS",
            "_blank"
        );

    });

}

/* ==========================================
   USA NUMBERS
========================================== */

if (usaNumbersBtn) {

    usaNumbersBtn.addEventListener("click", () => {

        window.location.href = "usa-numbers.html";

    });

}

/* ==========================================
   ALL COUNTRIES
========================================== */

if (allCountriesBtn) {

    allCountriesBtn.addEventListener("click", () => {

        window.location.href = "countries.html";

    });

}

/* ==========================================
   REFRESH
========================================== */

if (refreshBtn) {

    refreshBtn.addEventListener("click", async () => {

        refreshBtn.disabled = true;

        refreshBtn.innerHTML =
            `<i class="fas fa-spinner fa-spin"></i> Refreshing`;

        await loadUser();

        await loadActivations();

        refreshBtn.disabled = false;

        refreshBtn.innerHTML =
            `<i class="fas fa-rotate-right"></i> Refresh`;

    });

}

/* ==========================================
   BOTTOM NAVIGATION
========================================== */

// Buy Account

if (buyAccountBtn) {

    buyAccountBtn.addEventListener("click", () => {

        window.location.href = "buy-account.html";

    });

}

// History

if (historyNavBtn) {

    historyNavBtn.addEventListener("click", () => {

        window.location.href = "history.html";

    });

}

// Home

if (homeNavBtn) {

    homeNavBtn.addEventListener("click", () => {

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

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        try {

            await signOut(auth);

            window.location.href = "login.html";

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    });

}

console.log("✅ Dashboard Part 2 Loaded");

/* ==========================================
   RAXYSMS DASHBOARD
   PART 3/4
   LOAD RECENT ACTIVATIONS
========================================== */

async function loadActivations() {

    if (!currentUser || !activationsTable) return;

    activationsTable.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">
                Loading activations...
            </td>
        </tr>
    `;

    try {

        const q = query(
            collection(db, "activations"),
            where("uid", "==", currentUser.uid),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        const snapshot = await getDocs(q);

        activationsTable.innerHTML = "";

        if (snapshot.empty) {

            activationsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        No recent activations.
                    </td>
                </tr>
            `;

            return;

        }

        snapshot.forEach(docSnap => {

            const data = docSnap.data();

            let statusClass = "status-waiting";

            if (data.status === "Complete") {
                statusClass = "status-complete";
            }

            if (data.status === "Cancelled") {
                statusClass = "status-cancelled";
            }

            const date = data.createdAt
                ? data.createdAt.toDate().toLocaleDateString()
                : "-";

            activationsTable.innerHTML += `
                <tr>

                    <td>${data.service || "-"}</td>

                    <td>${data.phoneNumber || "-"}</td>

                    <td>${data.smsCode || "Waiting..."}</td>

                    <td>
                        ₦${Number(data.price || 0).toLocaleString()}
                    </td>

                    <td>
                        <span class="${statusClass}">
                            ${data.status || "Waiting"}
                        </span>
                    </td>

                    <td>${date}</td>

                </tr>
            `;

        });

    }

    catch (error) {

        console.error(error);

        activationsTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Failed to load activations.
                </td>
            </tr>
        `;

    }

}

/* ==========================================
   AUTO REFRESH
========================================== */

setInterval(async () => {

    if (!currentUser) return;

    await loadUser();

    await loadActivations();

}, 15000);

console.log("✅ Dashboard Part 3 Loaded");

/* ==========================================
   RAXYSMS DASHBOARD
   PART 4/4
   HELPERS + MESSAGE DISPLAY + INIT
========================================== */

function formatCurrency(amount) {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2
    }).format(value);
}

function formatDate(timestamp) {

    if (!timestamp) return "-";

    try {

        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);

        return date.toLocaleString("en-NG", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    } catch (error) {

        return "-";

    }

}

function getStatusBadge(status) {

    const value = (status || "waiting").toLowerCase();

    switch (value) {

        case "complete":
        case "completed":
        case "success":
            return `<span class="status complete">Complete</span>`;

        case "cancelled":
        case "canceled":
            return `<span class="status cancelled">Cancelled</span>`;

        default:
            return `<span class="status waiting">Waiting</span>`;

    }

}

/* ==========================================
   DASHBOARD MESSAGE
========================================== */

function showDashboardMessage(message, type = "success") {

    let box = document.getElementById("dashboardMessage");

    if (!box) {

        box = document.createElement("div");
        box.id = "dashboardMessage";
        box.className = "dashboard-message";

        document.body.appendChild(box);

    }

    box.className = `dashboard-message ${type}`;
    box.textContent = message;
    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 4000);

}

/* ==========================================
   SESSION MESSAGE
========================================== */

const savedMessage = sessionStorage.getItem("dashboardMessage");
const savedType = sessionStorage.getItem("dashboardMessageType");

if (savedMessage) {

    showDashboardMessage(
        savedMessage,
        savedType || "success"
    );

    sessionStorage.removeItem("dashboardMessage");
    sessionStorage.removeItem("dashboardMessageType");

}

/* ==========================================
   INITIAL LOAD
========================================== */

window.addEventListener("load", () => {

    console.log("✅ Dashboard Loaded");

    loadUser();
    loadActivations();

});

/* ==========================================
   MAKE HELPERS GLOBAL
========================================== */

window.showDashboardMessage = showDashboardMessage;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.getStatusBadge = getStatusBadge;

console.log("✅ dashboard.js fully loaded.");
