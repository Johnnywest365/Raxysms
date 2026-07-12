import { 
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import { app } from "./firebase.js";


const auth = getAuth(app);



const loginBtn = document.getElementById("loginBtn");


loginBtn.addEventListener("click", async ()=>{


    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;



    if(!email || !password){

        alert("Please enter email and password");

        return;

    }



    loginBtn.innerText = "Logging in...";

    loginBtn.disabled = true;



    try{


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        alert("Login successful");


        window.location.href = "dashboard.html";



    }catch(error){


        alert(error.message);


        loginBtn.innerText = "Login";

        loginBtn.disabled = false;


    }



});





// SHOW / HIDE PASSWORD

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");



togglePassword.addEventListener("click", ()=>{


    if(passwordInput.type === "password"){


        passwordInput.type = "text";

        togglePassword.textContent = "🙈";


    }else{


        passwordInput.type = "password";

        togglePassword.textContent = "👁";


    }


});
