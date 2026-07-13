/* ==========================================
   RAXYSMS ADMIN PANEL
   PART 3/6
========================================== */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const serviceName = document.getElementById("serviceName");
const servicePrice = document.getElementById("servicePrice");

const addServiceBtn = document.getElementById("addServiceBtn");
const servicesList = document.getElementById("servicesList");

const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadServices();

});

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});

addServiceBtn.addEventListener("click", async () => {

    const name = serviceName.value.trim();
    const price = Number(servicePrice.value);

    if (!name || !price) {
        alert("Enter service name and price.");
        return;
    }

    addServiceBtn.disabled = true;
    addServiceBtn.textContent = "Adding...";

    try {

        await addDoc(collection(db, "services"), {

            name,
            price,
            createdAt: Date.now()

        });

        serviceName.value = "";
        servicePrice.value = "";

        loadServices();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

    addServiceBtn.disabled = false;
    addServiceBtn.textContent = "Add Service";

});

async function loadServices() {

    servicesList.innerHTML = `
        <p class="loading">
            Loading services...
        </p>
    `;

    try {

        const q = query(
            collection(db, "services"),
            orderBy("name")
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            servicesList.innerHTML = `
                <p class="loading">
                    No services found.
                </p>
            `;

            return;

        }

        let html = "";

        snapshot.forEach(doc => {

            const service = doc.data();

            html += `
                <div class="service-item">

                    <div class="service-info">

                        <h3>${service.name}</h3>

                        <p>₦${Number(service.price).toLocaleString()}</p>

                    </div>

                    <div class="actions">

                        <button
                            class="edit-btn"
                            data-id="${doc.id}">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            data-id="${doc.id}">
                            Delete
                        </button>

                    </div>

                </div>
            `;

        });

        servicesList.innerHTML = html;

    } catch (error) {

        console.error(error);

        servicesList.innerHTML = `
            <p class="loading">
                Failed to load services.
            </p>
        `;

    }

}

/* ==========================================
   DELETE SERVICE
========================================== */

servicesList.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("delete-btn")) return;

    const serviceId = e.target.dataset.id;

    const confirmed = confirm(
        "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {

        await deleteDoc(doc(db, "services", serviceId));

        loadServices();

        alert("Service deleted successfully.");

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});
