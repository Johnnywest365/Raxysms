/* ==========================================
   RAXYSMS USA NUMBERS
   PART 1/5
========================================== */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* ==========================================
   DOM ELEMENTS
========================================== */

const searchInput = document.getElementById("searchInput");

const popularServices = document.getElementById("popularServices");
const otherServices = document.getElementById("otherServices");

const walletBalance = document.getElementById("walletBalance");

const logoutBtn = document.getElementById("logoutBtn");

/* ==========================================
   BALANCE MODAL
========================================== */

const balanceModal = document.getElementById("balanceModal");

const walletAmount = document.getElementById("walletAmount");
const serviceAmount = document.getElementById("serviceAmount");

const closeBalanceModal =
    document.getElementById("closeBalanceModal");

const fundWalletBtn =
    document.getElementById("fundWalletBtn");

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let currentUser = null;
let wallet = 0;

let services = [];

/* ==========================================
   BALANCE MODAL FUNCTIONS
========================================== */

function showBalanceModal(servicePrice) {

    walletAmount.textContent =
        "₦" + wallet.toLocaleString();

    serviceAmount.textContent =
        "₦" + Number(servicePrice).toLocaleString();

    balanceModal.style.display = "flex";

}

function hideBalanceModal() {

    balanceModal.style.display = "none";

}

closeBalanceModal.onclick = hideBalanceModal;

fundWalletBtn.onclick = () => {

    window.location.href = "fund-wallet.html";

};

/* ==========================================
   AUTH CHECK
========================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    await loadWallet();
    await loadServices();

});

/* ==========================================
   LOAD USER WALLET
========================================== */

async function loadWallet() {

    try {

        const userRef = doc(db, "users", currentUser.uid);

        const snap = await getDoc(userRef);

        if (!snap.exists()) {

            alert("User account not found.");
            return;

        }

        const data = snap.data();

        wallet = Number(data.wallet || 0);

        walletBalance.textContent =
            "₦" + wallet.toLocaleString();

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}

/* ==========================================
   LOAD SERVICES
========================================== */

async function loadServices() {

    try {

        services = [];

        const querySnapshot = await getDocs(
            collection(db, "services")
        );

        querySnapshot.forEach((doc) => {

            services.push({
                id: doc.id,
                ...doc.data()
            });

        });

        popular = services.filter(service => service.popular === true);

        others = services.filter(service => service.popular !== true);

        others.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        renderPopular(popular);
        renderOthers(others);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 2/5
========================================== */

/* ==========================================
   RENDER POPULAR SERVICES
========================================== */

function renderPopular(list) {

    popularServices.innerHTML = "";

    if (list.length === 0) {

        popularServices.innerHTML = `
            <div class="empty">
                No popular services available.
            </div>
        `;

        return;

    }

    list.forEach(service => {

        popularServices.innerHTML += `

        <div class="service-row">

            <div class="service-name">
                ${service.name}
            </div>

            <div class="service-price">
                ₦${Number(service.price).toLocaleString()}
            </div>

            <button
                class="buy-btn"
                data-id="${service.id}">
                Buy
            </button>

        </div>

        `;

    });

    attachBuyButtons();

}

/* ==========================================
   RENDER OTHER SERVICES
========================================== */

function renderOthers(list) {

    otherServices.innerHTML = "";

    if (list.length === 0) {

        otherServices.innerHTML = `
            <div class="empty">
                No services found.
            </div>
        `;

        return;

    }

    list.forEach(service => {

        otherServices.innerHTML += `

        <div class="service-row">

            <div class="service-name">
                ${service.name}
            </div>

            <div class="service-price">
                ₦${Number(service.price).toLocaleString()}
            </div>

            <button
                class="buy-btn"
                data-id="${service.id}">
                Buy
            </button>

        </div>

        `;

    });

    attachBuyButtons();

}

/* ==========================================
   SEARCH SERVICES
========================================== */

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderPopular(popular);
        renderOthers(others);

        return;

    }

    const popularResult = popular.filter(service =>
        service.name.toLowerCase().includes(keyword)
    );

    const otherResult = others.filter(service =>
        service.name.toLowerCase().includes(keyword)
    );

    renderPopular(popularResult);
    renderOthers(otherResult);

});

/* ==========================================
   BUY BUTTON EVENTS
========================================== */

function attachBuyButtons() {

    document
        .querySelectorAll(".buy-btn")
        .forEach(button => {

            button.onclick = () => {

                const service = services.find(
                    item => item.id === button.dataset.id
                );

                if (!service) return;

                openPurchase(service);

            };

        });

}

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 3/5
========================================== */

import {
    addDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* ==========================================
   PURCHASE POPUP
========================================== */

async function openPurchase(service) {

    if (!service) return;

    if (wallet < Number(service.price)) {

    showBalanceModal(service.price);

    return;

}

    const confirmBuy = confirm(
`🇺🇸 Buy USA Number

Service: ${service.name}

Price: ₦${Number(service.price).toLocaleString()}

Wallet Balance: ₦${wallet.toLocaleString()}

Do you want to continue?`
    );

    if (!confirmBuy) return;

    await buyNumber(service);

}

/* ==========================================
   BUY NUMBER
========================================== */

async function buyNumber(service) {

    try {

        const phoneNumber =
            "+1" +
            Math.floor(
                2000000000 + Math.random() * 7000000000
            );

        const activation = {

            uid: currentUser.uid,

            service: service.name,

            country: "USA",

            phoneNumber: phoneNumber,

            smsCode: "",

            price: Number(service.price),

            status: "Waiting",

            createdAt: serverTimestamp()

        };

        await addDoc(
            collection(db, "activations"),
            activation
        );

        wallet -= Number(service.price);

        await updateDoc(
            doc(db, "users", currentUser.uid),
            {
                wallet: wallet
            }
        );

        alert(
            "Number purchased successfully!\n\nRedirecting to Dashboard..."
        );

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 4/5
========================================== */

import {
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* ==========================================
   REFRESH WALLET
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

        console.error(error);

    }

}

/* ==========================================
   LOGOUT
========================================== */

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const logout = confirm(
            "Are you sure you want to logout?"
        );

        if (!logout) return;

        try {

            await auth.signOut();

            window.location.href = "login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}

/* ==========================================
   AUTO REFRESH WALLET
========================================== */

setInterval(() => {

    if (currentUser) {

        refreshWallet();

    }

}, 30000);

/* ==========================================
   HELPER FUNCTIONS
========================================== */

function formatMoney(amount) {

    return "₦" + Number(amount).toLocaleString();

}

function generateActivationId() {

    return "RAXY-" +
        Date.now().toString().slice(-8);

}

/* ==========================================
   PAGE READY
========================================== */

console.log("✅ USA Numbers Ready");

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 5/5
========================================== */

/* ==========================================
   PURCHASE LOCK
========================================== */

let purchaseInProgress = false;

/* ==========================================
   SAFE BUY NUMBER
========================================== */

async function startPurchase(service) {

    if (purchaseInProgress) {
        return;
    }

    purchaseInProgress = true;

    try {

        await buyNumber(service);

    } finally {

        purchaseInProgress = false;

    }

}

/* ==========================================
   UPDATE BUY BUTTONS
========================================== */

function setButtonsLoading(loading = false) {

    document.querySelectorAll(".buy-btn").forEach(btn => {

        btn.disabled = loading;

        if (loading) {

            btn.textContent = "Buying...";

        } else {

            btn.textContent = "Buy";

        }

    });

}

/* ==========================================
   OVERRIDE PURCHASE
========================================== */

async function openPurchase(service) {

    if (!service) return;

    if (wallet < Number(service.price)) {

        alert(
            "Insufficient wallet balance.\n\nPlease fund your wallet first."
        );

        return;

    }

    const confirmed = confirm(

`🇺🇸 USA Number Purchase

Service:
${service.name}

Price:
₦${Number(service.price).toLocaleString()}

Wallet:
₦${wallet.toLocaleString()}

Continue with this purchase?`

    );

    if (!confirmed) return;

    setButtonsLoading(true);

    try {

        await startPurchase(service);

    } finally {

        setButtonsLoading(false);

    }

}

/* ==========================================
   SEARCH PLACEHOLDER
========================================== */

if (searchInput) {

    searchInput.placeholder =
        "Search USA services...";

}

/* ==========================================
   PAGE LOADED
========================================== */

window.addEventListener("load", () => {

    console.log("=================================");
    console.log("RAXYSMS USA NUMBERS READY");
    console.log("Firebase Connected");
    console.log("Wallet Ready");
    console.log("Services Ready");
    console.log("Purchase System Ready");
    console.log("=================================");

});
