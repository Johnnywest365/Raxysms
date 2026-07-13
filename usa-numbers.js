/* ==========================================
   RAXYSMS USA NUMBERS PAGE
   STEP 1 - SERVICE SEARCH & SELECTION
========================================== */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

/* ==========================================
   DEBUG
========================================== */

console.log("✅ usa-numbers.js loaded");

/* ==========================================
   DOM ELEMENTS
========================================== */

const username = document.getElementById("username");

const searchInput = document.getElementById("searchServices");

const serviceResults = document.getElementById("serviceResults");

const selectedBox = document.getElementById("selectedServiceBox");

const selectedService = document.getElementById("selectedService");

const totalPrice = document.getElementById("totalPrice");

const continueBtn = document.getElementById("continuePurchase");

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let allServices = [];

let selectedServiceData = null;

console.log("Search Input:", searchInput);
console.log("Service Results:", serviceResults);
console.log("Continue Button:", continueBtn);

/* ==========================================
   AUTH STATE
========================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    username.textContent =
        user.displayName ||
        user.email.split("@")[0];

    await loadServices();

});

/* ==========================================
   LOAD SERVICES
========================================== */

async function loadServices() {

    try {

        console.log("✅ Loading services...");

        allServices = [];

        const snapshot = await getDocs(collection(db, "services"));

        console.log("📦 Documents found:", snapshot.size);

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            allServices.push({

                id: docSnap.id,
                name: data.name,
                price: Number(data.price)

            });

        });

        allServices.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        console.log("✅ Services Loaded:", allServices);

    } catch (error) {

        console.error("❌ Load Services Error:", error);

        serviceResults.innerHTML = `
            <div class="service-empty">
                Failed to load services.
            </div>
        `;

    }

}

/* ==========================================
   SEARCH SERVICES
========================================== */

searchInput.addEventListener("input", () => {

    const value = searchInput.value.trim().toLowerCase();

    serviceResults.innerHTML = "";

    if (value === "") {
        return;
    }

    const filtered = allServices.filter(service =>
        service.name.toLowerCase().includes(value)
    );

    if (filtered.length === 0) {

        serviceResults.innerHTML = `
            <div class="service-empty">
                No matching service found.
            </div>
        `;

        return;

    }

    filtered.forEach(service => {

        const item = document.createElement("div");

        item.className = "service-item";

        item.innerHTML = `

            <span>${service.name}</span>

            <span>₦${service.price.toLocaleString()}</span>

        `;

        item.onclick = () => {

            document
                .querySelectorAll(".service-item")
                .forEach(el => el.classList.remove("active"));

            item.classList.add("active");

            selectedServiceData = service;

            selectedBox.style.display = "block";

            selectedService.textContent =
                `${service.name} - ₦${service.price.toLocaleString()}`;

            totalPrice.textContent =
                `₦${service.price.toLocaleString()}`;

            searchInput.value = service.name;

            serviceResults.innerHTML = "";

        };

        serviceResults.appendChild(item);

    });

});

/* ==========================================
   CONTINUE PURCHASE
========================================== */

continueBtn.addEventListener("click", async () => {

    if (continueBtn.disabled) return;

    if (!selectedServiceData) {

        alert("Please select a service first.");
        return;

    }

    continueBtn.disabled = true;

    continueBtn.textContent = "Processing...";

    await startPurchase();

    continueBtn.disabled = false;

    continueBtn.textContent = "Continue Purchase Number";

});

/* ==========================================
   START PURCHASE
========================================== */

async function startPurchase() {

    try {

        const userRef = doc(
            db,
            "users",
            auth.currentUser.uid
        );

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User account not found.");
            return;

        }

        const userData = userSnap.data();

        const wallet = Number(userData.wallet || 0);

        const price = Number(selectedServiceData.price);

        /* ==========================
           WALLET CHECK
        ========================== */

        if (wallet < price) {

            sessionStorage.setItem(
                "purchaseType",
                "error"
            );

            sessionStorage.setItem(
                "purchaseMessage",
                `Insufficient Balance. You need ₦${price.toLocaleString()} but your wallet balance is ₦${wallet.toLocaleString()}.`
            );

            window.location.href = "dashboard.html";

            return;

        }

        /* ==========================
           BACKEND STEP
        ========================== */

        alert(
            "Wallet check passed.\n\nNext step: Connect securely to the TextVerified backend to rent a USA number."
        );

    } catch (error) {

        console.error("Purchase Error:", error);

        alert(error.message);

    }

}
