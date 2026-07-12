// ======================================
// RaxySMS Dashboard
// ======================================


import {
    auth,
    db
} from "./firebase.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";





const userName = document.getElementById("userName");

const walletBalance = document.getElementById("walletBalance");

const logoutBtn = document.getElementById("logoutBtn");





// =============================
// CHECK USER LOGIN
// =============================


onAuthStateChanged(auth, async (user)=>{


    if(!user){

        window.location.href = "login.html";

        return;

    }



    try{


        const userRef = doc(
            db,
            "users",
            user.uid
        );


        const userSnap = await getDoc(userRef);



        if(userSnap.exists()){


            const data = userSnap.data();



            userName.textContent =
            data.name || "User";



            walletBalance.textContent =
            Number(data.wallet || 0).toFixed(2);



        }



    }

    catch(error){

        console.log(error);

    }



});







// =============================
// LOGOUT
// =============================


logoutBtn.addEventListener("click", async ()=>{


    try{


        await signOut(auth);


        window.location.href =
        "login.html";


    }


    catch(error){


        alert(error.message);


    }



});
