/* ==========================================
   RAXYSMS USA NUMBERS
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

const walletBalance = document.getElementById("walletBalance");
const searchInput = document.getElementById("searchInput");
const servicesList = document.getElementById("servicesList");

const logoutBtn = document.getElementById("logoutBtn");

/* Purchase Modal */

const purchaseModal =
    document.getElementById("purchaseModal");

const modalService =
    document.getElementById("modalService");

const modalPrice =
    document.getElementById("modalPrice");

const cancelPurchase =
    document.getElementById("cancelPurchase");

const confirmPurchase =
    document.getElementById("confirmPurchase");

/* Balance Modal */

const balanceModal =
    document.getElementById("balanceModal");

const walletAmount =
    document.getElementById("walletAmount");

const serviceAmount =
    document.getElementById("serviceAmount");

const closeBalanceModal =
    document.getElementById("closeBalanceModal");

const fundWalletBtn =
    document.getElementById("fundWalletBtn");

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let currentUser = null;
let wallet = 0;
let selectedService = null;

/* ==========================================
   USA SERVICES
========================================== */

const services = [

    { name:"WhatsApp", price:3500 },

    { name:"Google Voice", price:3200 },

    { name:"Telegram", price:2700 },

    { name:"Facebook", price:2700 },

    { name:"Gmail", price:2700 },

    { name:"Chime", price:2700 },

    { name:"Plenty of Fish", price:2700 },

    { name:"Service Not Listed", price:2500 },

    { name:"Walmart", price:1860 },

    { name:"Match.com", price:1650 },

    { name:"Instagram", price:1600 },

    { name:"PayPal", price:1600 },

    { name:"Signal", price:1600 },

    { name:"Venmo", price:1600 },

    { name:"Yahoo", price:1600 },

    { name:"X", price:1600 },

    { name:"Snapchat", price:1200 },

    { name:"Viber", price:900 }

];

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

});

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 2/5
========================================== */

import {
    collection,
    addDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* ==========================================
   LOAD WALLET
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

        renderServices(services);

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

/* ==========================================
   RENDER SERVICES
========================================== */

function renderServices(list) {

    servicesList.innerHTML = "";

    if (list.length === 0) {

        servicesList.innerHTML = `

        <div class="empty">

            No services found.

        </div>

        `;

        return;

    }

    list.forEach((service, index) => {

        servicesList.innerHTML += `

        <div class="service-row">

            <div class="service-name">

                ${service.name}

            </div>

            <div class="service-price">

                ₦${service.price.toLocaleString()}

            </div>

            <button
                class="buy-btn"
                data-index="${index}">

                Buy

            </button>

        </div>

        `;

    });

    attachBuyEvents();

}

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 3/5
========================================== */

/* ==========================================
   SEARCH SERVICES
========================================== */

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value
        .trim()
        .toLowerCase();

    if (keyword === "") {

        renderServices(services);
        return;

    }

    const filtered = services.filter(service =>

        service.name
            .toLowerCase()
            .includes(keyword)

    );

    renderServices(filtered);

});

/* ==========================================
   BUY BUTTON EVENTS
========================================== */

function attachBuyEvents() {

    document
        .querySelectorAll(".buy-btn")
        .forEach(button => {

            button.onclick = () => {

                const index =
                    Number(button.dataset.index);

                selectedService =
                    services[index];

                if (!selectedService) return;

                modalService.textContent =
                    selectedService.name;

                modalPrice.textContent =
                    selectedService.price.toLocaleString();

                purchaseModal.style.display = "flex";

            };

        });

}

/* ==========================================
   PURCHASE MODAL
========================================== */

cancelPurchase.onclick = () => {

    purchaseModal.style.display = "none";

    selectedService = null;

};

confirmPurchase.onclick = async () => {

    purchaseModal.style.display = "none";

    if (!selectedService) return;

    if (wallet < selectedService.price) {

        walletAmount.textContent =
            "₦" + wallet.toLocaleString();

        serviceAmount.textContent =
            "₦" + selectedService.price.toLocaleString();

        balanceModal.style.display = "flex";

        return;

    }

    await buyNumber(selectedService);

};

/* ==========================================
   BALANCE MODAL
========================================== */

closeBalanceModal.onclick = () => {

    balanceModal.style.display = "none";

};

fundWalletBtn.onclick = () => {

    window.location.href =
        "fund-wallet.html";

};

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 4/5
========================================== */

/* ==========================================
   PURCHASE LOCK
========================================== */

let purchaseInProgress = false;

/* ==========================================
   BUY USA NUMBER
========================================== */

async function buyNumber(service) {

    if (purchaseInProgress) return;

    purchaseInProgress = true;

    confirmPurchase.disabled = true;
    confirmPurchase.textContent = "Processing...";

    try {

        wallet -= service.price;

        await updateDoc(

            doc(db, "users", currentUser.uid),

            {
                wallet: wallet
            }

        );

        walletBalance.textContent =
            "₦" + wallet.toLocaleString();

        const activation = {

            uid: currentUser.uid,

            service: service.name,

            country: "USA",

            phoneNumber: "",

            activationId: "",

            smsCode: "",

            price: service.price,

            status: "Waiting",

            provider: "TextVerified",

            createdAt: serverTimestamp()

        };

        await addDoc(

            collection(db, "activations"),

            activation

        );

        alert(
            "Purchase successful.\n\nRedirecting to Dashboard..."
        );

        window.location.href =
            "dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    finally {

        purchaseInProgress = false;

        confirmPurchase.disabled = false;

        confirmPurchase.textContent =
            "Confirm Purchase";

    }

}

/* ==========================================
   RAXYSMS USA NUMBERS
   PART 5/5
========================================== */

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

            await signOut(auth);

            window.location.href = "login.html";

        }

        catch (error) {

            alert(error.message);

        }

    });

}

/* ==========================================
   REFRESH WALLET
========================================== */

async function refreshWallet() {

    if (!currentUser) return;

    try {

        const snap = await getDoc(
            doc(db, "users", currentUser.uid)
        );

        if (!snap.exists()) return;

        wallet = Number(snap.data().wallet || 0);

        walletBalance.textContent =
            "₦" + wallet.toLocaleString();

    }

    catch (error) {

        console.error(error);

    }

}

setInterval(refreshWallet, 30000);

/* ==========================================
   CLOSE MODALS WHEN CLICKING BACKDROP
========================================== */

window.addEventListener("click", (event) => {

    if (event.target === purchaseModal) {

        purchaseModal.style.display = "none";

    }

    if (event.target === balanceModal) {

        balanceModal.style.display = "none";

    }

});

/* ==========================================
   PAGE READY
========================================== */

console.log("=================================");
console.log("RAXYSMS USA NUMBERS READY");
console.log("Firebase Connected");
console.log("Wallet Loaded");
console.log("Services Loaded");
console.log("Purchase Flow Ready");
console.log("=================================");
