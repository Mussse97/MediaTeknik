var stepElem;
var fixedCode;
var api_key = "FqZF2ASN";
var resultat = 3; // Hur många resultat vi vill ha
const chosenAct = [
    {urlA:"establishment&types=activity"},

    {urlA:"&description=Gokart,Zipline,Bowlinghall,Skateboardpark", urlB:"&description=Nöjespark,Nöjescenter"},

    {urlA:"&price_ranges=100-250", urlB:""},

    {urlA:"&outdoors=Y", urlB:""},

    {urlA:"&provinces=småland", urlB:"&provinces=öland"},

];
const chosenFood = [
    {urlB:"food"},
    {urlA:"&types=FINE_DINING", urlB:"&types=CASUAL", urlC:"&sub_types=PASTRIES"},
    {urlA:"&sub_types=LOCAL", urlB:"&sub_types=A_LA_CARTE"},
    {urlA:"&outdoor_seating=Y", urlB:"&indoor_seating=Y"},
    {urlA:"&vegetarian_option=N", urlB:"  "} //Provinces finns bara i establshment taggen...
];

//{altA:"Fint", descA:"Bara fina restauranger.", altB:"Snabbmat", descB:"Typ McDonalds HAHA", altC:"Exotiskt", descC:"Exotiska restauranger"},
//{altA:"Uteservering", descA:"Det måste finnas uteservering!", altB:"Inomhus", descB:"Vi vill sitta inne."},
//{altA:"Billigt", descA:"Restauranger som går under en 500 lapp.", altB:"Dyrt", descB:"Kostar över 500."},
//{altA:"Småland", descA:"Visa bara aktiviterer i Småland.", altB:"Öland", descB:"Visa bara aktiviteter i Öland.", altC:"Båda", descC:"Visa aktiviteter i både Småland och Öland."}

function init() {
    stepElem = document.getElementById("stepElement");
    
    fixedCode = fixCode(window.location.search);

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

    //request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=" + xd[0] + "&method=getall&order_by=rating" + xd[1] + xd[2] + xd[3],true);
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=" + xd[0] + "&method=getall&order_by=rating" + xd[1] + xd[2],true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) listAlts(request.responseText);
            else stepElem.innerHTML = "Nåt gick fel";
    };
}

function listAlts(owo) {
    owo = JSON.parse(owo);
    owo = owo.payload;

    for (let i = 0; i < owo.length; i++) {
        if (owo[i].description == "Simhall") {
            owo.splice(i,1);
            i--;
        }
        else if (owo[i].description == "Golfbana") {
            owo.splice(i,1);
            i--;
        }
        else if (owo[i].description == "Nattklubb") {
            owo.splice(i,1);
            i--;
        }
        else if (owo[i].description == "Lekland") {
            owo.splice(i,1);
            i--;
        };
        //if (owo[i].description == "") owo.splice(i,1);
        
        if (owo.length == 0) {
            stepElem.innerHTML = "Finns inga resultat :<"
            return;
        }
    }
    
    console.log(owo);

    for (let i = 0; i < resultat; i++) {
        stepElem.innerHTML += "<h3>" + owo[i].name + "</h3>"
    }
}