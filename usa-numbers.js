/* ==========================================================
   RAXYSMS
   USA NUMBERS
   PART 1/5
   ========================================================== */

import { app } from "./firebase.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* ==========================================================
   FIREBASE
========================================================== */

const auth = getAuth(app);
const db = getFirestore(app);

/* ==========================================================
   GLOBAL VARIABLES
========================================================== */

let currentUser = null;

let walletBalance = 0;

let selectedService = null;

let popularServices = [];

let otherServices = [];

let allServices = [];

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const searchInput =
document.getElementById("searchInput");

const popularContainer =
document.getElementById("popularServices");

const otherContainer =
document.getElementById("otherServices");

const walletBalanceElement =
document.getElementById("walletBalance");

const logoutBtn =
document.getElementById("logoutBtn");

/* ==========================================================
   FORMAT PRICE
========================================================== */

function formatPrice(price){

    return "₦" + Number(price).toLocaleString();

}

/* ==========================================================
   LOAD USER WALLET
========================================================== */

async function loadWallet(){

    if(!currentUser) return;

    try{

        const userRef =
        doc(db,"users",currentUser.uid);

        const userSnap =
        await getDoc(userRef);

        if(userSnap.exists()){

            const data =
            userSnap.data();

            walletBalance =
            data.wallet || 0;

        }else{

            walletBalance = 0;

        }

        if(walletBalanceElement){

            walletBalanceElement.textContent =
            formatPrice(walletBalance);

        }

    }catch(error){

        console.error(
            "Wallet Error:",
            error
        );

    }

}

/* ==========================================================
   AUTH STATE
========================================================== */

onAuthStateChanged(
    auth,
    async(user)=>{

        if(!user){

            window.location.href =
            "login.html";

            return;

        }

        currentUser = user;

        await loadWallet();

        initializePage();

    }
);

/* ==========================================================
   LOGOUT
========================================================== */

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        async()=>{

            await signOut(auth);

            window.location.href =
            "login.html";

        }
    );

}

/* ==========================================================
   INITIALIZE PAGE
========================================================== */

function initializePage(){

    console.log(
        "USA Numbers Loaded"
    );

}

/* ==========================================================
   SERVICES DATA
   PART 2/5
========================================================== */

/* ===========================
   ⭐ POPULAR SERVICES
=========================== */

popularServices = [

{
    id:"whatsapp",
    name:"WhatsApp",
    price:3500,
    active:true
},

{
    id:"telegram",
    name:"Telegram",
    price:2700,
    active:true
},

{
    id:"signal",
    name:"Signal",
    price:1600,
    active:true
},

{
    id:"viber",
    name:"Viber",
    price:900,
    active:true
},

{
    id:"venmo",
    name:"Venmo",
    price:1600,
    active:true
},

{
    id:"chime",
    name:"Chime",
    price:2700,
    active:true
},

{
    id:"instagram",
    name:"Instagram",
    price:1600,
    active:true
},

{
    id:"match",
    name:"Match.com",
    price:1650,
    active:true
},

{
    id:"pof",
    name:"Plenty of Fish",
    price:2700,
    active:true
},

{
    id:"facebook",
    name:"Facebook",
    price:2700,
    active:true
},

{
    id:"googlevoice",
    name:"Google Voice",
    price:3200,
    active:true
},

{
    id:"twitterx",
    name:"Twitter (X)",
    price:1600,
    active:true
},

{
    id:"yahoo",
    name:"Yahoo",
    price:1600,
    active:true
},

{
    id:"gmail",
    name:"Gmail",
    price:2700,
    active:true
},

{
    id:"skout",
    name:"SKout",
    price:2700,
    active:true
},

{
    id:"paypal",
    name:"PayPal",
    price:1600,
    active:true
}

/* More popular services can be added here later */

];


/* ===========================
   🚀 ALL OTHER SERVICES
=========================== */

otherServices = [

{
id:"apple",
name:"Apple",
price:2300,
active:true
},

{
id:"badoo",
name:"Badoo",
price:1900,
active:true
},

{
id:"bankofamerica",
name:"Bank of America",
price:2400,
active:true
},

{
id:"bankofhawaii",
name:"Bank of Hawaii",
price:2100,
active:true
},

{
id:"bankofwashington",
name:"Bank of Washington",
price:2200,
active:true
},

{
id:"bereal",
name:"BeReal",
price:1700,
active:true
},

{
id:"bestbuy",
name:"Best Buy",
price:2000,
active:true
},

{
id:"bet365",
name:"Bet365",
price:2500,
active:true
},

{
id:"bigolive",
name:"Bigo Live",
price:1800,
active:true
},

{
id:"binance",
name:"Binance",
price:2400,
active:true
},

{
id:"bitcoinatm",
name:"Bitcoin ATM",
price:2300,
active:true
},

{
id:"bitcoinira",
name:"Bitcoin IRA",
price:2200,
active:true
},

{
id:"blockchain",
name:"Blockchain",
price:2100,
active:true
},

{
id:"bmoharris",
name:"BMO Harris",
price:2000,
active:true
},

{
id:"bolt",
name:"Bolt",
price:1800,
active:true
},

{
id:"bonchat",
name:"BonChat",
price:1900,
active:true
},

{
id:"booking",
name:"Booking.com",
price:2400,
active:true
},

{
id:"boo",
name:"Boo",
price:1700,
active:true
},

{
id:"bumble",
name:"Bumble",
price:2300,
active:true
},

{
id:"bump",
name:"Bump",
price:1600,
active:true
},

{
id:"bunky",
name:"Bunky",
price:1700,
active:true
},

{
id:"burner",
name:"Burner",
price:2200,
active:true
},

{
id:"burstsms",
name:"BurstSMS",
price:2000,
active:true
},

{
id:"call",
name:"Call",
price:1500,
active:true
},

{
id:"callapp",
name:"CallApp",
price:1800,
active:true
},

{
id:"callfire",
name:"CallFire",
price:2000,
active:true
},

{
id:"capitalone",
name:"Capital One",
price:2500,
active:true
},

{
id:"card",
name:"CARD.com",
price:2100,
active:true
},

{
id:"cashapp",
name:"Cash App",
price:2500,
active:true
},

{
id:"chatdate",
name:"Chat Date",
price:1900,
active:true
},

{
id:"chime2",
name:"Chime",
price:2300,
active:true
},

{
id:"chispa",
name:"Chispa",
price:2000,
active:true
}

/* Remaining services continue in Part 3 */

];

/* ==========================================================
   SERVICES DATA
   PART 3/5
========================================================== */

otherServices.push(

{
id:"citibank",
name:"Citibank",
price:2400,
active:true
},

{
id:"clapper",
name:"Clapper",
price:1900,
active:true
},

{
id:"coinme",
name:"Coinme",
price:2200,
active:true
},

{
id:"cryptodotcom",
name:"Crypto.com",
price:2400,
active:true
},

{
id:"cvs",
name:"CVS",
price:1800,
active:true
},

{
id:"dave",
name:"Dave",
price:2100,
active:true
},

{
id:"discord",
name:"Discord",
price:2200,
active:true
},

{
id:"dollargeneral",
name:"Dollar General",
price:1900,
active:true
},

{
id:"doordash",
name:"DoorDash",
price:2400,
active:true
},

{
id:"douyin",
name:"Douyin",
price:2000,
active:true
},

{
id:"duet",
name:"Duet",
price:1700,
active:true
},

{
id:"ebay",
name:"eBay",
price:2300,
active:true
},

{
id:"facebook2",
name:"Facebook",
price:2700,
active:true
},

{
id:"fiverr",
name:"Fiverr",
price:2400,
active:true
},

{
id:"gateio",
name:"Gate.io",
price:2300,
active:true
},

{
id:"gemini",
name:"Gemini",
price:2100,
active:true
},

{
id:"gemiplay",
name:"Gemiplay",
price:1800,
active:true
},

{
id:"github",
name:"GitHub",
price:2200,
active:true
},

{
id:"gmail2",
name:"Gmail",
price:1500,
active:true
},

{
id:"glovo",
name:"Glovo",
price:2000,
active:true
},

{
id:"google",
name:"Google",
price:2300,
active:true
},

{
id:"googlevoice2",
name:"Google Voice",
price:3000,
active:true
},

{
id:"got2go",
name:"Got2Go",
price:1900,
active:true
},

{
id:"greendot",
name:"Green Dot",
price:2200,
active:true
},

{
id:"hily",
name:"Hily",
price:2000,
active:true
},

{
id:"hinge",
name:"Hinge",
price:2300,
active:true
},

{
id:"hotmail",
name:"Hotmail",
price:1800,
active:true
},

{
id:"idme",
name:"ID.me",
price:2500,
active:true
},

{
id:"imo",
name:"Imo",
price:1700,
active:true
},

{
id:"imoney",
name:"iMoney",
price:2100,
active:true
},

{
id:"index",
name:"Index",
price:1500,
active:true
}

/* Add future services here */

);

/* ==========================================================
   SORT SERVICES (A-Z)
========================================================== */

otherServices.sort((a,b)=>
    a.name.localeCompare(b.name)
);

/* ==========================================================
   MERGE SERVICES
========================================================== */

allServices = [
    ...popularServices,
    ...otherServices
];

/* ==========================================================
   SERVICE CARD
========================================================== */

function createServiceCard(service){

    return `

    <div class="service-card">

        <div class="service-name">
            ${service.name}
        </div>

        <div class="service-price">
            ${formatPrice(service.price)}
        </div>

        <button
            class="buy-btn"
            data-id="${service.id}">
            Buy
        </button>

    </div>

    `;

}

/* ==========================================================
   RENDER POPULAR
========================================================== */

function renderPopular(){

    if(!popularContainer) return;

    popularContainer.innerHTML =
    popularServices
    .map(createServiceCard)
    .join("");

}

/* ==========================================================
   RENDER OTHER
========================================================== */

function renderOthers(){

    if(!otherContainer) return;

    otherContainer.innerHTML =
    otherServices
    .map(createServiceCard)
    .join("");

}
