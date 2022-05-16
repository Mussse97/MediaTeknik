var stepElem;
var fixedCode;
var api_key = "FqZF2ASN";
var resultat = 3; // Hur många resultat vi vill ha
var nerd = [];
var extraElem;
var myMap; 
var mapLocationElem; // Element för utskrift av koordinater
var myApiKey = "DIN-API-KEY"; // Ersätt DIN-API-KEY med din egen Flickr API key

const chosenAct = [
    {urlA:"establishment&types=activity"}, // Controller

    {urlA:"&description=Gokart,Zipline,Bowlinghall,Skateboardpark", urlB:"&description=Nöjespark,Nöjescenter"},

    {urlA:"&price_ranges=100-250", urlB:""},
    {urlA:"&outdoors=Y", urlB:""},
    {urlA:"&provinces=småland", urlB:"&provinces=öland"},

];
const chosenFood = [
    {urlB:"food"}, // Controller

    {urlA:"&types=FINE_DINING", urlB:"&types=CASUAL", urlC:"&sub_types=PASTRIES"},

    {urlA:"&sub_types=LOCAL", urlB:"&sub_types=A_LA_CARTE"},

    {urlA:"&outdoor_seating=Y", urlB:"&indoor_seating=Y"},

    {urlA:"&vegetarian_option=N", urlB:"&vegetarian_option=Y"} //Provinces finns bara i establshment taggen...
];


function init() {
    extraElem = document.getElementById("extraInfo");
    stepElem = document.getElementById("stepElement");
    infoElem = document.getElementById ("priset");
    fixedCode = fixCode(window.location.search);
    extraElem = document.getElementById("extraInfo");
   

    if (fixedCode[0] == 0) getController(chosenAct);
    else getController(chosenFood);
}

window.addEventListener("load",init);

function fixCode(code) {
    code = code.split('=');
    code = code[1];
    code = code.split(',');
    for (let i = 0; i < code.length; i++) code[i] = parseInt(code[i]);
    return code;
}

function getController(uwu) {
    let controller = [];
   
    for (let i = 0; i < uwu.length; i++) {
        if (fixedCode[i] == 0) controller.push(uwu[i].urlA);
        else if (fixedCode[i] == 1) controller.push(uwu[i].urlB);
        else controller.push(uwu[i].urlC);
    }

    applyController(controller);
}

function applyController(xd) {
    let request = new XMLHttpRequest(); 
    
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=" + xd[0] + "&method=getall&order_by=rating&per_page=3" + xd[1] + xd[2] + xd[3] + xd[4],true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) {
                let uwu = request.responseText;
                if (xd[0] == "food") {
                    let owo = JSON.parse(uwu).payload;
                    let quickFix = [];
                    for (let i = 0; i < owo.length; i++) {
                        quickFix.push(owo[i].id);
                    }
                    quickFix.toString();
                    request = new XMLHttpRequest();
                    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&types=food&method=getall&id=" + quickFix,true);
                    request.send(null); 
                    request.onreadystatechange = function () {
                        if (request.readyState == 4)
                            if (request.status == 200) listAlts(request.responseText)
                            else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";
                    };
                }
            }
            else listAlts(uwu);
        else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";
    };
}

function listAlts(owo) {
    owo = JSON.parse(owo).payload;
    

    let bad = ["Simhall","Golfbana","Nattklubb","Lekland"]; // Descriptions att ta bort

    console.log(owo);

    if (owo.length == 0) {
        stepElem.innerHTML = "<h2>Finns inga resultat :<</h2>"
        return;
    }

    // Gör inget just nu
    for (let i = 0; i < owo.length; i++) {
        for (let k = 0; k < bad.length; k++) {
            if (owo[i].description == bad[k]) {
                owo.splice(i,1);
                i--;
                break;
            }
        }
        


        if (owo.length == 0) {
            stepElem.innerHTML = "<h2>Finns inga resultat :<</h2>"
            return;
        }
    }
    
    nerd = [];

    for (let i = 0; i < resultat; i++) {

        let baby = document.createElement("div");
        let number = document.createElement("h1");
        number.innerHTML = (i+1) + ".";
        baby.innerHTML = "<h3>"+ owo[i].name +"</h3><p>" + owo[i].abstract +"</p><p>Betyg: " + Math.round(owo[i].rating * 10) /10 +"</p>" + 
        "<p>Pris:" + owo[i].price_range + "kr" +"</p>";

        nerd.push(owo[i]);
        baby.setAttribute("data-ix",i);
        baby.addEventListener("click",extraInfo);

        stepElem.appendChild(baby);
        stepElem.insertBefore(number, baby);

        if (owo.length == 0) {
            stepElem.innerHTML = "<h2>Finns inga resultat :<</h2>"
            return;
        }
    }
}

function extraInfo() {
    let wow = this.getAttribute("data-ix");
    wow = nerd[wow];
    
    // Valda alternativet
    let fix = document.querySelectorAll("#stepElement div")
    for (let i = 0; i < fix.length; i++) fix[i].style.outline = "thick solid black";
    this.style.outline = "thick solid red";
    
    
    let request = new XMLHttpRequest(); 
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&method=getreviews&id=" + wow.id ,true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) musse(request.responseText,wow);
            else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";
    };
}

function musse(lol,wow) {
    uwu = JSON.parse(lol).payload;

   console.log(uwu)
    
    var a = document.createElement('a');
    a.href = wow.website;
    extraElem.innerHTML = "<h3>"+ wow.name +"</h3>" + "<a><p>"+ "Webbplats: " + wow.website  + "</a>" + "<p>"+ "Antal recentioner: " + wow.num_reviews + "</p><p>"+ "Adress:" + wow.address + "</p>";
    if (uwu[0].comment != undefined) {
     extraElem.innerHTML+= "<p>"+ "Recensioner: " + uwu[0].comment + "</p>"

    }
    else {
        extraElem.innerHTML+= "Finns inga recentioner för denna plats.";
    }
};
