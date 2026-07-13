/* ==========================================
   RAXYSMS USA NUMBERS
   usa-numbers.js
   PART 1/5
   Firebase • Auth • Wallet • Services
========================================== */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================
   DOM ELEMENTS
========================== */

const walletBalance = document.getElementById("walletBalance");
const searchInput = document.getElementById("searchInput");
const servicesContainer = document.getElementById("servicesContainer");
const logoutBtn = document.getElementById("logoutBtn");

/* ==========================
   APP STATE
========================== */

let currentUser = null;
let wallet = 0;
let filteredServices = [];

/* ==========================
   FIXED USA SERVICES
========================== */

const services = [
    { id: 1, name: "WhatsApp", price: 3500 },
    { id: 2, name: "Telegram", price: 2700 },
    { id: 3, name: "Signal", price: 1600 },
    { id: 4, name: "Viber", price: 900 },
    { id: 5, name: "Venmo", price: 1600 },
    { id: 6, name: "Chime", price: 2500 },
    { id: 7, name: "Cash App", price: 3200 },
    { id: 8, name: "Google Voice", price: 2800 },
    { id: 9, name: "Gmail", price: 1500 },
    { id: 10, name: "Google", price: 1500 },
    { id: 11, name: "Facebook", price: 2500 },
    { id: 12, name: "Instagram", price: 2500 },
    { id: 13, name: "TikTok", price: 2400 },
    { id: 14, name: "Snapchat", price: 2100 },
    { id: 15, name: "Discord", price: 1800 },
    { id: 16, name: "Uber", price: 3000 },
    { id: 17, name: "Lyft", price: 3000 },
    { id: 18, name: "Amazon", price: 2800 }
];

filteredServices = [...services];

/* ==========================
   FORMAT MONEY
========================== */

function formatMoney(amount) {
    return "₦" + Number(amount).toLocaleString("en-NG");
}

/* ==========================
   LOAD WALLET
========================== */

async function loadWallet() {

    if (!currentUser) return;

    try {

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            wallet = 0;
        } else {
            wallet = Number(userSnap.data().wallet || 0);
        }

        walletBalance.textContent = formatMoney(wallet);

    } catch (error) {

        console.error("Wallet Error:", error);

        wallet = 0;
        walletBalance.textContent = formatMoney(0);

    }

}

/* ==========================
   RENDER SERVICES
========================== */

function renderServices(list) {

    servicesContainer.innerHTML = "";

    if (!list.length) {

        servicesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No services found</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }

    list.forEach(service => {

        servicesContainer.innerHTML += `
            <div class="service-row">

                <div class="service-name">
                    <span class="flag">🇺🇸</span>
                    ${service.name}
                </div>

                <div class="service-price">
                    ${formatMoney(service.price)}
                </div>

                <div class="service-action">
                    <button
                        class="buy-btn"
                        data-id="${service.id}">
                        Buy
                    </button>
                </div>

            </div>
        `;

    });

}

/* ==========================
   AUTH CHECK
========================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    await loadWallet();

    renderServices(filteredServices);

    console.log("USA Numbers Ready");

});

/* ==========================================
   RAXYSMS USA NUMBERS
   usa-numbers.js
   PART 2/5
   Search • Buy Events • Confirmation • Overlays
========================================== */

/* ==========================
   DOM - OVERLAYS
========================== */

const loadingOverlay = document.getElementById("loadingOverlay");
const successOverlay = document.getElementById("successOverlay");
const failedOverlay = document.getElementById("failedOverlay");
const stockOverlay = document.getElementById("stockOverlay");

const confirmOverlay = document.getElementById("confirmOverlay");
const confirmService = document.getElementById("confirmService");
const confirmCountry = document.getElementById("confirmCountry");
const confirmPrice = document.getElementById("confirmPrice");

const confirmBuyBtn = document.getElementById("confirmBuyBtn");
const cancelBuyBtn = document.getElementById("cancelBuyBtn");

/* Success Overlay */
const successService = document.getElementById("successService");
const successPrice = document.getElementById("successPrice");

/* Rental Failed Overlay */
const failedWallet = document.getElementById("failedWallet");
const failedNeeded = document.getElementById("failedNeeded");

/* ==========================
   APP STATE
========================== */

let selectedService = null;
let purchaseLocked = false;

/* ==========================
   OVERLAY HELPERS
========================== */

function hideAllOverlays() {

    [
        loadingOverlay,
        successOverlay,
        failedOverlay,
        stockOverlay,
        confirmOverlay
    ].forEach(overlay => {

        if (overlay) {
            overlay.classList.remove("active");
        }

    });

}

function showOverlay(overlay) {

    hideAllOverlays();

    if (overlay) {
        overlay.classList.add("active");
    }

}

/* ==========================
   SEARCH
========================== */

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(keyword)
    );

    renderServices(filteredServices);

});

/* ==========================
   BUY BUTTON EVENTS
========================== */

servicesContainer.addEventListener("click", (event) => {

    const button = event.target.closest(".buy-btn");

    if (!button) return;

    const id = Number(button.dataset.id);

    selectedService = services.find(
        service => service.id === id
    );

    if (!selectedService) return;

    confirmService.textContent = selectedService.name;
    confirmCountry.textContent = "USA 🇺🇸";
    confirmPrice.textContent = formatMoney(selectedService.price);

    showOverlay(confirmOverlay);

});

/* ==========================
   CONFIRM PURCHASE
========================== */

confirmBuyBtn.addEventListener("click", () => {

    if (!selectedService) return;

    if (purchaseLocked) return;

    hideAllOverlays();

    buyNumber(selectedService);

});

/* ==========================
   CANCEL PURCHASE
========================== */

cancelBuyBtn.addEventListener("click", () => {

    selectedService = null;

    hideAllOverlays();

});

/* ==========================
   CLOSE MODAL ON BACKDROP
========================== */

confirmOverlay.addEventListener("click", (event) => {

    if (event.target === confirmOverlay) {

        selectedService = null;

        hideAllOverlays();

    }

});

/* ==========================================
   RAXYSMS USA NUMBERS
   usa-numbers.js
   PART 3/5
   Purchase Flow • Firestore • Wallet Update
========================================== */

import {
    doc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================
   BUY NUMBER
========================== */

async function buyNumber(service) {

    if (purchaseLocked) return;

    purchaseLocked = true;

    showOverlay(loadingOverlay);

    try {

        /* Small delay for smoother UX */
        await new Promise(resolve => setTimeout(resolve, 900));

        /* ==========================
           WALLET CHECK
        ========================== */

        if (wallet < service.price) {

            failedWallet.textContent = formatMoney(wallet);
            failedNeeded.textContent = formatMoney(service.price);

            showOverlay(failedOverlay);

            purchaseLocked = false;

            setTimeout(() => {
                window.location.href = "fund-wallet.html";
            }, 1200);

            return;
        }

        /* ==========================
           NUMBER AVAILABILITY
           (Temporary simulation)
        ========================== */

        const numberAvailable = Math.random() > 0.15;

        if (!numberAvailable) {

            showOverlay(stockOverlay);

            purchaseLocked = false;

            setTimeout(() => {
                hideAllOverlays();
            }, 1200);

            return;
        }

        /* ==========================
           DEDUCT WALLET
        ========================== */

        wallet -= service.price;

        await updateDoc(
            doc(db, "users", currentUser.uid),
            {
                wallet: wallet
            }
        );

        walletBalance.textContent = formatMoney(wallet);

        /* ==========================
           GENERATED NUMBER
           (Temporary until API)
        ========================== */

        const generatedNumber =
            "+1" +
            Math.floor(
                2000000000 + Math.random() * 7000000000
            );

        /* ==========================
           CREATE ACTIVATION
        ========================== */

        await addDoc(
            collection(db, "activations"),
            {
                userId: currentUser.uid,
                email: currentUser.email,
                country: "USA",
                service: service.name,
                phoneNumber: generatedNumber,
                price: service.price,
                status: "Waiting for SMS",
                smsCode: "",
                createdAt: serverTimestamp()
            }
        );

        /* ==========================
           SUCCESS
        ========================== */

        successService.textContent = service.name;
        successPrice.textContent = formatMoney(service.price);

        showOverlay(successOverlay);

        purchaseLocked = false;

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);

    } catch (error) {

        console.error(error);

        purchaseLocked = false;

        alert("Something went wrong.");

    }

}

/* ==========================================
   RAXYSMS USA NUMBERS
   usa-numbers.js
   PART 4/5
   Logout • Wallet Refresh • Final Events
========================================== */

/* ==========================
   LOGOUT
========================== */

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }

});


/* ==========================
   AUTO REFRESH WALLET
   EVERY 30 SECONDS
========================== */

setInterval(async () => {

    if (currentUser) {

        await loadWallet();

        console.log(
            "Wallet refreshed"
        );

    }

}, 30000);


/* ==========================
   OVERLAY BACKDROP CLOSE
========================== */

[
    successOverlay,
    failedOverlay,
    stockOverlay,
    loadingOverlay
].forEach(overlay => {

    if (!overlay) return;

    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target === overlay &&
                overlay !== loadingOverlay
            ){

                overlay.classList.remove(
                    "active"
                );

            }

        }
    );

});


/* ==========================
   PAGE READY
========================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "RaxySMS USA Numbers Loaded"
        );

    }
);

/* ==========================================
   RAXYSMS USA NUMBERS
   usa-numbers.js
   PART 5/5
   Final Cleanup • Safety Checks • Production Ready
========================================== */


/* ==========================
   ELEMENT SAFETY CHECK
========================== */

const requiredElements = [
    walletBalance,
    searchInput,
    servicesContainer,
    logoutBtn
];

requiredElements.forEach(element => {

    if (!element) {

        console.error(
            "Missing HTML element:",
            element
        );

    }

});


/* ==========================
   RESET PURCHASE STATE
========================== */

function resetPurchaseState(){

    selectedService = null;

    purchaseLocked = false;

}


/* ==========================
   GLOBAL ERROR HANDLING
========================== */

window.addEventListener(
    "unhandledrejection",
    (event)=>{

        console.error(
            "Unhandled Error:",
            event.reason
        );

        purchaseLocked = false;

    }
);


/* ==========================
   CLEAN EXIT
========================== */

window.addEventListener(
    "beforeunload",
    ()=>{

        resetPurchaseState();

    }
);


/* ==========================
   INITIAL STARTUP CHECK
========================== */

async function initializeUSA Numbers(){

    try{

        console.log(
            "Initializing RaxySMS USA Numbers..."
        );


        if(currentUser){

            await loadWallet();

            renderServices(
                services
            );

        }


        console.log(
            "USA Numbers Ready ✅"
        );


    }catch(error){

        console.error(
            "Initialization Error:",
            error
        );

    }

}


/* ==========================
   START APP
========================== */

console.log(
    "RaxySMS usa-numbers.js loaded"
);
