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





// ===============================
// GET USERNAME
// ===============================


onAuthStateChanged(auth, async(user)=>{


    if(user){


        username.textContent =
        user.displayName || user.email.split("@")[0];


    }



});







// ===============================
// LOAD SERVICES
// ===============================


async function loadServices() {

    try {

        console.log("Loading services...");

        allServices = [];

        const snapshot = await getDocs(collection(db, "services"));

        console.log("Documents found:", snapshot.size);

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            console.log(data);

            allServices.push({
                id: docSnap.id,
                name: data.name,
                price: Number(data.price)
            });

        });

        console.log("Loaded Services:", allServices);

    } catch (error) {

        console.error("Load Services Error:", error);

    }

}




// ===============================
// SEARCH SERVICES
// ===============================


searchInput.addEventListener("input",()=>{


    const value =
    searchInput.value.toLowerCase();



    serviceResults.innerHTML = "";



    if(value === ""){

        return;

    }



    const filtered =
    allServices.filter(service=>


        service.name
        .toLowerCase()
        .includes(value)


    );




    filtered.forEach(service=>{



        const item =
        document.createElement("div");



        item.className =
        "service-item";



        item.innerHTML = `

        <span>
        ${service.name}
        </span>


        <span>
        ₦${service.price.toLocaleString()}
        </span>

        `;




        item.onclick = ()=>{


            selectedServiceData = service;



            selectedBox.style.display =
            "block";



            selectedService.textContent =

            `${service.name} - ₦${service.price.toLocaleString()}`;



            totalPrice.textContent =

            `₦${service.price.toLocaleString()}`;



            serviceResults.innerHTML = "";

            searchInput.value = service.name;


        };




        serviceResults.appendChild(item);



    });



});








// ===============================
// CONTINUE PURCHASE
// ===============================


continueBtn.addEventListener("click", async () => {

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

        // STEP 1
        // Load latest wallet balance

        const userRef = doc(db, "users", auth.currentUser.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            alert("User not found.");
            return;

        }

        const userData = userSnap.data();

        const wallet = Number(userData.wallet || 0);

        const price = Number(selectedServiceData.price);

        // STEP 2
        // Wallet Check

        if (wallet < price) {

            sessionStorage.setItem(
                "purchaseType",
                "error"
            );

            sessionStorage.setItem(
                "purchaseMessage",
                `Insufficient Balance. Need ₦${price.toLocaleString()}, You have ₦${wallet.toLocaleString()}`
            );

            window.location.href = "dashboard.html";

            return;

        }

        // STEP 3
        // Next:
        // Request number from backend

        alert("Wallet check passed. Backend connection is the next step.");

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}
