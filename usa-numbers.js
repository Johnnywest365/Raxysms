// =====================================
// RAXYSMS USA NUMBERS
// PART 1/5
// =====================================

import { app } from "./firebase.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let walletBalance = 0;

const searchInput = document.getElementById("searchInput");

const buyButtons = document.querySelectorAll(".buy-btn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

        const data = userSnap.data();

        walletBalance = data.balance || 0;

    }

});
// =====================================
// RAXYSMS USA NUMBERS
// PART 2/5
// =====================================

// Popular Services

const popularServices = [

    { name: "WhatsApp", price: 3500 },
    { name: "Telegram", price: 2700 },
    { name: "Signal", price: 1600 },
    { name: "Viber", price: 900 },
    { name: "Venmo", price: 1600 },
    { name: "Chime", price: 2700 },
    { name: "Instagram", price: 1600 },
    { name: "Match.com", price: 1650 },
    { name: "Plenty of Fish", price: 2700 },
    { name: "Facebook", price: 2700 },
    { name: "Google Voice", price: 3200 },
    { name: "Twitter (X)", price: 1600 },
    { name: "Yahoo", price: 1600 },
    { name: "Gmail", price: 2700 },
    { name: "SKout", price: 2700 },
    { name: "PayPal", price: 1600 }

];


// Other Services

const otherServices = [

 const otherServices = [

    { name: "Amazon", price: 2600 },
    { name: "Apple ID", price: 2800 },
    { name: "Discord", price: 1700 },
    { name: "LinkedIn", price: 2200 },
    { name: "Lyft", price: 2200 },
    { name: "Microsoft", price: 2500 },
    { name: "Netflix", price: 2400 },
    { name: "Reddit", price: 1800 },
    { name: "Snapchat", price: 2100 },
    { name: "Steam", price: 1800 },
    { name: "TikTok", price: 2400 },
    { name: "Uber", price: 2200 }

];

const popularContainer = document.getElementById("popularServices");
const otherContainer = document.getElementById("otherServices");


function createServiceCard(service) {

    return `

        <div class="service-card">

            <div class="service-name">
                ${service.name}
            </div>

            <div class="service-price">
                ₦${service.price.toLocaleString()}
            </div>

            <button
                class="buy-btn"
                data-service="${service.name}"
                data-price="${service.price}">
                Buy
            </button>

        </div>

    `;

}


function renderServices() {

    popularContainer.innerHTML =
        popularServices.map(createServiceCard).join("");

    otherContainer.innerHTML =
        otherServices.map(createServiceCard).join("");

}

renderServices();
