var containElem; // Elementet med hjulet
var val = []; // Möjliga valen för hjulet
const blacklist = ["Paintballcenter","Simhall","Temapark","Älgpark","Gatukök","Hamburgerkedja","Lekland","Golfbana", "Pizzeria"]; // Alla descriptions vi vill sortera bort
var timeout = 2.1; // Hur länge hjulet ska snurra i sekunder
var api_key = "FqZF2ASN"; // Vår api nyckel
var spin; // Används för att stänga av hjulet efter man snurrat
var Wtext; // Elementet där resultaten läggs
var sound = new Audio('ljud/wheel_01.mp3'); // Ljudet då hjulet snurrar

// Initierar variablar och lägger till händelsehanterare
function init() {
    containElem = document.querySelector("#container div");
    spin = document.getElementById("spin");
    Wtext = document.getElementById("wheelText");
    
    let request = new XMLHttpRequest(); // AJAX variabel
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&types=food,activity&method=getall",true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) fixList(request.responseText);
            else alert("Nåt gick fel");
    };;

    spin.addEventListener("click",spinny) 
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
        listRes()
    }, timeout*1000); // *1000 för att omvandla till sekunder
}



// Lägger upp resultatet
function listRes() {
    let ix = Math.floor(Math.random()*val.length) // Väljer ett slumpmässigt ID i listan val
    let smapiRes = val[ix];
    val.splice(ix,1);

    spin.disabled = false;
    
    let svar = document.createElement("div"); // Hjulets resultat läggs i denna variabel och den läggs sedan i Wtext
    svar.innerHTML += "<h2>" + smapiRes.name + "</h2>" + "<p>" + smapiRes.abstract + "</p>";
    Wtext.insertBefore(svar,Wtext.firstChild);
    if (val.length == 0) {
        spin.disabled = true;
        spin.style.cursor = "not-allowed"
    }
}

function fixList(code) {
    code = JSON.parse(code).payload;
    for (i = code.length; i > 0; i--) {
        let j = i-1;
        let u = true;
        for (k = 0; k < blacklist.length; k++) {
            if (code[j].description == blacklist[k] || code[j].text == " " || code[j].text == null) {
                if (u == true) {
                    code.splice(j,1);
                    u = false;
                } 
            }         
        }
    }
    val = code;
}