var containElem; // Elementet med hjulet
var val = []; // Möjliga valen för hjulet
const blacklist = ["Paintballcenter","Simhall","Temapark","Älgpark","Gatukök","Hamburgerkedja","Lekland","Golfbana", "Pizzeria"]; // Alla descriptions vi vill sortera bort
var timeout = 2.1; // Hur länge hjulet ska snurra i sekunder
var api_key = "FqZF2ASN"; // Vår api nyckel
var spin; // Används för att stänga av hjulet efter man snurrat
var Wtext; // Elementet där resultaten läggs
var sound = new Audio('ljud/wheel_01.mp3'); // Ljudet då hjulet snurrar
var enlargeElem; // Elementet som "mer info" visas i.
var closeBtn; // Knappen som stänger enlargeElem

// Initierar variablar och lägger till händelsehanterare
function init() {
    containElem = document.querySelector("#container div");
    spin = document.getElementById("spin");
    Wtext = document.getElementById("wheelText");
    enlargeElem = document.getElementById("enlarge");
    closeBtn = document.getElementById("closeEnlarge");
    
    let request = new XMLHttpRequest(); // AJAX variabel
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&types=food,activity&method=getall",true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) fixList(request.responseText);
            else alert("Nåt gick fel");
    };;

    spin.addEventListener("click",spinny);
}
window.addEventListener("load",init);

// Snurrar hjulet sen stänger av det en stund
function spinny() {
    spin.disabled = true;
    sound.play();
    containElem.style.transition = timeout + "s";
    let l = Math.random()*9000 // Väljer ett slumpmässigt nummer som hjulet sedan roterar till, står i grader
    containElem.style.webkitTransform = "rotate(" + l + "deg)";
    setTimeout(() => {
        listRes();
    }, timeout*1000); // *1000 för att omvandla till sekunder
}

// Lägger upp resultatet
function listRes() {
    let ix = Math.floor(Math.random()*val.length) // Väljer slumpmässigt ett alternativ i listan val
    let smapiRes = val[ix]; // Valda alternativet
    val.splice(ix,1);

    spin.disabled = false;
    
    let svar = document.createElement("div"); // Hjulets resultat läggs i denna variabel och den läggs sedan i Wtext
    svar.innerHTML += "<h2>" + smapiRes.name + "</h2></p><button>Mer info</button>";
    
    Wtext.insertBefore(svar,Wtext.firstChild);
    document.querySelector("#wheelText button:first-of-type").classList.add("buttonR");
    document.querySelector("#wheelText button:first-of-type").addEventListener("click",function(){
        enlargeRes(smapiRes);
    });
    if (val.length == 0) {
        spin.disabled = true;
        spin.style.cursor = "not-allowed";
    }
}

// Sorterar resultaten och tar bort de som finns på blacklisten
function fixList(code) {
    code = JSON.parse(code).payload;
    for (i = code.length; i > 0; i--) {
        let j = i-1; // Används för loopen går baklänges, vi vill åt i-1 inte i.
        for (k = 0; k < blacklist.length; k++) {
            if (code[j].description == blacklist[k]) {
                code.splice(j,1);
                break;
            }         
        }
    }
    val = code;
}

// Fyller ett element med mera information om den valda aktiviteten, gömmer listan med alternativ 
function enlargeRes(obj) {
    enlargeElem.style.transition = timeout + "s";
    closeBtn.style.transition = timeout + "s";

    closeBtn.addEventListener("click",close);
    closeBtn.style.opacity = "100";
    closeBtn.style.cursor = "pointer";
    enlargeElem.style.zIndex = "100";
    enlargeElem.style.opacity = "100";
    containElem.style.opacity = "0";
    spin.style.opacity = "0";
    

    if (obj.abstract == "" || obj.abstract == " ") enlargeElem.innerHTML = "<h2>" + obj.name + "</h2><p>" + obj.text +"</p>";
    else enlargeElem.innerHTML = "<h2>" + obj.name + "</h2><p>" + obj.abstract +"</p>";
    
    if (obj.type == "food") enlargeElem.innerHTML += "<h4>Pris: " + obj.price_range + "kr <br><br>Uteservering: " + obj.outdoors + "<br><br>Adress: " + obj.address + " ("+ obj.city +")</h4>";
    else enlargeElem.innerHTML += "<h4>Pris: " + obj.price_range + "<br><br>Adress: " + obj.address + " ("+ obj.city +")</h4>";
    
    initMap(obj);

    let commentCheck; // Om det finns recensioner skapas en knapp som visar dem, annars så skapas en text där det står att det inte finns några recensioner.
    if (obj.num_reviews == 0){ 
        commentCheck = document.createElement("p");
        commentCheck.innerHTML = "Finns inga recensioner";}
    else {
        commentCheck = document.createElement("button");
        commentCheck.style.fontSize = "x-large"
        commentCheck.innerHTML = "Visa recensioner"
        commentCheck.classList.add("buttonR");
        commentCheck.addEventListener("click",function() {
            let request = new XMLHttpRequest(); // AJAX variabel
            request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&method=getreviews&id=" + obj.id ,true);
            request.send(null); 
            request.onreadystatechange = function () {
                if (request.readyState == 4)
                    if (request.status == 200) showRev(request.responseText);
                    else alert("Nåt gick fel");
            };;
        })
    }
    enlargeElem.appendChild(commentCheck);
}   

// Visar recensionerna
function showRev(obj) {
    resArray = JSON.parse(obj).payload;
    for (let i = 0; i < resArray.length; i++) {
        let comment = document.createElement("div"); // Recensionen
        comment.classList.add("comment");
        comment.innerHTML = "<img src='https://pic.onlinewebfonts.com/svg/img_329115.png' style='filter:invert(100%);'><p>" + resArray[i].comment + "</p>"; // "invert" gör att bilden blir vit
        enlargeElem.appendChild(comment);
    }
}

// Stänger enlarge 
function close() {
    this.style.opacity = "0";
    this.style.cursor = "unset";
    enlargeElem.style.zIndex = "-10";
    enlargeElem.style.opacity = "0";
    
    containElem.style.opacity = "100";
    spin.style.opacity = "100";
    closeBtn.removeEventListener("click",close);
}


// Denna funktion skapar kartan och en marker, sedan skapar den en knapp som frågar om man vill ladda kommentarer om det finns några
function initMap(obj) {
    let mapElem = document.createElement("div"); // Elementet med kartan
    mapElem.setAttribute("id",'smallMap')
    enlargeElem.appendChild(mapElem);
    let eventLatLng = new google.maps.LatLng( obj.lat , obj.lng ); // Positionen för aktiviteten
    let map = new google.maps.Map(mapElem, { // Kartan
        zoom: 10,
        center: eventLatLng,
        styles: [
            {featureType:"poi", stylers:[{visibility:"off"}]},  // No points of interest.
            {featureType:"transit.station",stylers:[{visibility:"off"}]}  // No bus stations, etc.
        ]
    });

    let a = new google.maps.Marker({ // Markern 
        position: eventLatLng,
        icon: "http://maps.google.com/mapfiles/kml/paddle/purple-blank.png"
    });
    a.setMap(map);
}