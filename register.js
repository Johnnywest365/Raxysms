// ======================================
// RaxySMS Register
// ======================================

import {
    auth,
    db
} from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const form = document.getElementById("registerForm");
const button = document.getElementById("registerBtn");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    button.disabled = true;
    button.textContent = "Creating Account...";

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name
        });

        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,
            name: name,
            email: email,

            wallet: 0,

            country: "",

            totalOrders: 0,

            createdAt: serverTimestamp()

        });

        alert("Account created successfully!");

        window.location.href = "dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

    button.disabled = false;
    button.textContent = "Create Account";

});
