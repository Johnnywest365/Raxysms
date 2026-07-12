/* ==========================================
   RAXYSMS USA NUMBERS JAVASCRIPT
========================================== */


// ================= SERVICES LIST =================

const popularServices = [
    {
        name:"WhatsApp",
        price:4500
    },
    {
        name:"Telegram",
        price:3500
    },
    {
        name:"Snapchat",
        price:2100
    },
    {
        name:"Facebook",
        price:2700
    },
    {
        name:"TikTok",
        price:2400
    },
    {
        name:"Instagram",
        price:2500
    }
];



const otherServices = [

    {
        name:"Adobe",
        price:2000
    },
    {
        name:"Amazon",
        price:2500
    },
    {
        name:"Apple",
        price:3000
    },
    {
        name:"Discord",
        price:1800
    },
    {
        name:"Google",
        price:2500
    },
    {
        name:"Microsoft",
        price:2200
    },
    {
        name:"Netflix",
        price:3000
    },
    {
        name:"PayPal",
        price:3500
    },
    {
        name:"Pinterest",
        price:2000
    },
    {
        name:"Reddit",
        price:2200
    },
    {
        name:"Twitter / X",
        price:2800
    },
    {
        name:"Uber",
        price:2500
    },
    {
        name:"Yahoo",
        price:2000
    }

];


// Sort Others Alphabetically

otherServices.sort((a,b)=>
    a.name.localeCompare(b.name)
);



const allServices = [
    ...popularServices,
    ...otherServices
];



// ================= ELEMENTS =================

const popularContainer =
document.getElementById("popularServices");


const otherContainer =
document.getElementById("otherServices");


const searchInput =
document.getElementById("searchNumbers");




// ================= CREATE CARD =================


function createServiceCard(service){

    return `

    <div class="service-card">

        <div class="service-info">

            <h3>${service.name}</h3>

            <p>USA Virtual Number</p>

            <div class="service-price">
                ₦${service.price.toLocaleString()}
            </div>

        </div>


        <button 
        class="buy-btn"
        onclick="buyNumber('${service.name}',${service.price})">

            Buy

        </button>


    </div>

    `;

}



// ================= LOAD SERVICES =================


function loadServices(){

    popularContainer.innerHTML="";

    otherContainer.innerHTML="";


    popularServices.forEach(service=>{

        popularContainer.innerHTML += 
        createServiceCard(service);

    });



    otherServices.forEach(service=>{

        otherContainer.innerHTML +=
        createServiceCard(service);

    });

}



loadServices();




// ================= SEARCH =================


searchInput.addEventListener("input",()=>{


    const value =
    searchInput.value.toLowerCase();


    popularContainer.innerHTML="";
    otherContainer.innerHTML="";


    allServices
    .filter(service =>
        service.name
        .toLowerCase()
        .includes(value)
    )
    .forEach(service=>{


        if(
            popularServices
            .some(item=>item.name===service.name)
        ){

            popularContainer.innerHTML +=
            createServiceCard(service);

        }
        else{

            otherContainer.innerHTML +=
            createServiceCard(service);

        }


    });


});





// ================= BUY BUTTON =================


function buyNumber(name,price){


    alert(
        `${name} USA number selected.\nPrice: ₦${price.toLocaleString()}`
    );


    /*
    
    NEXT STEP:

    1. Check Firebase wallet balance
    2. Deduct amount
    3. Create order in Firestore
    4. Send request to SMS provider API

    */

}
