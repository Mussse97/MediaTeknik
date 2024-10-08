
//Globala variabler.
var stepElem; // Används för att skriva ut information i div element.
var fixedCode; // Fixar koden som vi får från start.html
var api_key = "FqZF2ASN"; // Personlig api key.
var resultat = 4; // Hur många resultat vi vill ha
var showRes = []; // array med resultaten från  smapi.
var genElem; // Ett utav extra valen som är generell info om vald plats.
var commentElem; // Används för kommentarer från smapi.
var choiceDivs; // Extra valen som finns i resultat sidan.
var extraElem; // ett div element som skapas för att visa extra information som google maps.
var l = 0; // Används för att bara köra en funktion 1 gång
var o = 0; // Används för att bara köra en funktion 1 gång
var mapElem; // Detta är elementet för google maps.
var sort = "Betyg"; // Variabel som används för att sortera med betyg från smapi.


// array för alla val som kan göras på start.html.
const chosenAct = [
    {urlA:"establishment&types=activity"}, // Controller

    {urlA:"&descriptions=Gokart,Zipline,Bowlinghall,Skateboardpark", urlB:"&descriptions=Nöjespark,Nöjescenter"},

    {urlA:"&price_ranges=100-250,0-25", urlB:"&price_ranges=250-500,1250-5000"},
    
    {urlA:"&outdoors=Y", urlB:"&outdoors=N"},
    
    {urlA:"&provinces=småland", urlB:"&provinces=öland"}

];

// array för alla val som kan göras på start.html.
const chosenFood = [
    {urlB:"food"}, // Controller

    {urlA:"&types=FINE_DINING&sub_types=A_LA_CARTE,PASTRIES,LOCAL,ASIAN", urlB:"&types=CASUAL&sub_types=A_LA_CARTE,PASTRIES,LOCAL,ASIAN"},

    {urlA:"&outdoor_seating=Y", urlB:"&indoor_seating=Y"},

    {urlA:"&vegetarian_option=Y", urlB:"&vegetarian_option=N"},
    
    {urlA:"&provinces=småland", urlB:"&provinces=öland"} //Provinces finns bara i establshment taggen...
];

// Detta är arrayer som blir extra val i resultat sidan.
const extraInfo2 = [
    "Generell info",
    "Hitta hit",
    "Recensioner"
];
// Detta är nya knapparna som finns i resultatsidan för att kunna filtrera resultaten med betyg och plats.
const sorts = [
    "Betyg",
    "Nära mig"
];



function init() {
    stepElem = document.getElementById("stepElement");
    genElem = document.getElementById("genInfo");
    commentElem = document.getElementById("comment");
    extraElem = document.getElementById("extraInfo");
    choiceDivs = document.querySelectorAll(".generalInfo");
    mapElem = document.getElementById("map");
    fixedCode = fixCode(window.location.search);

    // Denna if sats bestämmer om den ska använda sig av arrayen chosen act eller chosenfood beroende på vad användaren klickar på.
    if (fixedCode[0] == 0) getController(chosenAct);
    else getController(chosenFood);
}

window.addEventListener("load",init);

// Omvandlar texten i länken till en läsbar 'kod'
function fixCode(code) {
    code = code.split('=');
    code = code[1];
    code = code.split(',');
    for (let i = 0; i < code.length; i++) code[i] = parseInt(code[i]);
    return code;
}

// Fixar till smapi-anropet sen kallar på funktionen som utför det.
function getController(resArray) {
    let controller = []; // Filtreringen som skickas till smapi
   
    for (let i = 0; i < resArray.length; i++) {
        if (fixedCode[i] == 0) controller.push(resArray[i].urlA);
        else if (fixedCode[i] == 1) controller.push(resArray[i].urlB);
        else controller.push(resArray[i].urlC);
    }

    applyController(controller);
}

// Denna request till smapi så läggs filtreringarna som finns i array chosenfood och cosenact i sökmotorn så att vi får ut informationen vi vill ha.
function applyController(xd) {
    let fixIt; // Används för att sepperera mellan restaurang och aktivitets anrop.
    if (xd[0] == "food") fixIt = "https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=" + xd[0] + "&method=getall&order_by=rating&per_page="+ resultat + xd[1] + xd[2] + xd[3];
    else fixIt = "https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=" + xd[0] + "&method=getall&order_by=rating&per_page="+ resultat + xd[1] + xd[2] + xd[3] + xd[4];
    let request = new XMLHttpRequest(); // AJAX variabel
    
    request.open("GET",fixIt,true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4) 
            if (request.status == 200) {
                if (xd[0] == "food") foodFix(request.responseText,xd);
                else addJSON(JSON.parse(request.responseText).payload,xd);
            }
        else stepElem.innerHTML = "<h2>något gick fel</h2>";
    };
}

// En till Smapi-request, denna gång är det för att få informationen som finns i establishment.
function foodFix(smapiRes,xd) {
    smapiRes = JSON.parse(smapiRes).payload;

    if (smapiRes.length == 0) {
        addJSON(smapiRes,xd);
        return;
    }

    let quickFix = []; // Används för att göra anropet, fylls med smapi IDs

    for (let i = 0; i < smapiRes.length; i++) {
        quickFix.push(smapiRes[i].id);
    }
    
    quickFix.toString();
    let request = new XMLHttpRequest(); // AJAX variabel
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&types=food&method=getall&ids=" + quickFix,true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) addJSON(JSON.parse(request.responseText).payload,xd);
            else stepElem.innerHTML = "<h2>Något gick fel</h2>";
    };
}
// En request till JSON filerna.
function addJSON(smapiRes,xd) {
    let controllerList; // Används för att kolla om man valt restaurang eller aktivitet
    if (xd[0] == "food") controllerList = "restaurang";
    else controllerList = "aktivitet";
    let request = new XMLHttpRequest(); // AJAX andropningsvariabel
    request.open("GET","json/"+controllerList+".json",true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) whatJSON(smapiRes,request.responseText,xd);
    };
}

// Filtrerar JSON samt smapi om man valt restaurang
function whatJSON(smapiRes,resArray,xd) {
    resArray = JSON.parse(resArray);

    let controllerList; // Används för att filtrera restauranger i Småland/Öland samt JSON i nästa steg
    if (xd[0] == "food") {
        controllerList = chosenFood;
        
        if (xd[4] == controllerList[4].urlB) {
            for (let k = smapiRes.length-1; k >= 0; k--) {
                if (smapiRes[k].province == "Småland") smapiRes.splice(k,1);
            }
        }
    }
    else controllerList = chosenAct;
    
    // Filtrerar JSON arrayen
    if (resArray.length != 0) {
        for (let i = 1; i < xd.length; i++) {
            let criteria; // Om någon väljer första alternativet får denna variabel värdet Y, annars N, används för att filtrera

            if (xd[i] == controllerList[i].urlA) criteria = "Y";
            else criteria = "N";

            for (let k = resArray.length-1; k >= 0; k--) {
                let x = i-1;
                if (xd[0] == "food" && x == 1) { // Om de måste ha uteservering tar vi bort 
                    if (criteria == "Y" && resArray[k].crit[x] != criteria) resArray.splice(k,1);
                }
                else if (xd[0] == "food" && x == 2) {
                    if (criteria == "Y" && resArray[k].crit[x] != criteria) resArray.splice(k,1);
                }
                else if (resArray[k].crit[x] != criteria) resArray.splice(k,1);
            }
        }
    for (let i = 0; i < resArray.length; i++) smapiRes.push(resArray[i]);
    }

    // Felmeddelande då det inte finns några resultat, kommer upp vid en kombination: 0,0,0,1,1. Vi har desperat letat efter aktiva inomhus aktiviteter för under 250 kr på Öland men vi hittade inga.
    if (smapiRes.length == 0) {
        let newDiv = document.createElement("div"); // Felmeddelandets element
        newDiv.innerHTML += "<h2>Finns inga resultat, prova gärna andra val!</h2>";
        extraElem.style.backgroundColor = "transparent";
        newDiv.style.width = "94vw";
        newDiv.classList.add("error");
        stepElem.appendChild(newDiv);
        return;
    }

    listAlts(smapiRes);
}

// Listar alternativen
function listAlts(smapiRes) {
    stepElem.innerHTML = "";

    // Sorterar arrayen då man klickar på en knapp
    if (sort == "Betyg") smapiRes.sort((a,b) => b.rating - a.rating);
    else if (sort == "Nära mig") {
        if (smapiRes[0].distance == undefined) getDistance(smapiRes); 
        else if (smapiRes[0].distance != undefined) smapiRes.sort((a,b) => a.distance - b.distance);
    }
    // else if (sort == "Slumpmässigt") smapiRes.sort((a, b) => 0.5 - Math.random());
    
    // Skapar knapparna första gången funktionen anropas
    if (o == 0) {
        let btnContainer = document.createElement("div"); // Divet knapparna ligger i
        btnContainer.setAttribute("id","sortBtn");
        stepElem.parentElement.appendChild(btnContainer);

        o++;
        for (let i = 0; i < sorts.length; i++) {
            let btn = document.createElement("button"); // Knapparna
            btn.innerHTML += sorts[i];
            btn.classList.add("buttonR");
            btn.addEventListener("click", function() {
                sort = sorts[i];
                listAlts(smapiRes);
            });
            btnContainer.appendChild(btn);
        }
    }
    

    showRes = [];
   
    // i denna funktion så går vi igenom resultat som är filtrerade resultat från smapi, skapar ett div element där informationen kan visas.
    for (let i = 0; i < resultat; i++) {

        if (smapiRes[i] == undefined) { // Avbryt om det inte finns flera resultat
            let newDiv = document.createElement("div"); // Error elementet
            newDiv.innerHTML += "<h2>Finns inga flera resultat </h2>";
            newDiv.classList.add("error");
            stepElem.appendChild(newDiv);
            break;
        }

        let newDiv = document.createElement("div"); // Alterativen
        let number = document.createElement("h1"); // Nummret innan alternativen
        number.innerHTML = (i+1) + ".";
        if (smapiRes[i].distance != undefined) newDiv.innerHTML = "<h3>"+ smapiRes[i].name + "</h3><h4>"+ parseInt(smapiRes[i].distance) + " km bort</h4><p>Betyg: " + Math.round(smapiRes[i].rating * 10) /10 +"</p>" + "<p>Pris: " + smapiRes[i].price_range + " kr (per person)</p>";
        else newDiv.innerHTML = "<h3>"+ smapiRes[i].name +"</h3><p>Betyg: " + Math.round(smapiRes[i].rating * 10) /10 +"</p>" + 
        "<p>Pris: " + smapiRes[i].price_range + " kr (per person)</p>";

        showRes.push(smapiRes[i]);
        newDiv.setAttribute("data-ix",i);
        newDiv.addEventListener("click",listResults);
        newDiv.style.cursor = "pointer";
        
        stepElem.appendChild(newDiv);
        newDiv.insertBefore(number, newDiv.firstChild);
    }

    // Finns det flera alternativ skapas en knapp som gör att man kan se dem.
    if (smapiRes.length > resultat) {
        let btn = document.createElement("button"); // Knappen som visar flera alternativ om det finns
        btn.innerHTML = "Visa flera resultat";
        btn.classList.add("buttonR");
        btn.addEventListener("click", function() {
            resultat = smapiRes.length;
            listAlts(smapiRes);
        })
        stepElem.appendChild(btn);
    }

    listResults.call(stepElem.firstChild); // Väljer första alternativet i listan
}

// Öppnar eller stänger diven som informationen ligger i
function resultToggle() {
    this.classList.toggle("closeDivs");
}

// Visar resultatet man klickar på
function listResults() { 
    if (this.classList.contains("vald")) return; // Klickar man på det valda elementet händer inget
    
    if (window.innerWidth < 600) document.getElementById('extraInfo').scrollIntoView(); // Ifallman klickar på sidan medans den är under 600 pixlar så tas man till #extraInfo, detta för att öka tillgängligheten
    
    let smapObj = this.getAttribute("data-ix"); // Tar fram rätt objekt av alternativen
    smapObj = showRes[smapObj];

    
    if (l == 0) {
        for (let i = 0; i < extraInfo2.length; i++) {
            let newDiv = document.createElement("div");
            newDiv.classList.add("closeDivs");
            newDiv.addEventListener("click",resultToggle);
            newDiv.style.cursor = "pointer";
            newDiv.innerHTML = "<h1>" + extraInfo2[i] + "</h1>";
            extraElem.insertBefore(newDiv,choiceDivs[i]);
        }
        l++;
        genElem.previousElementSibling.classList.toggle("closeDivs");
    }

    // Valda alternativet
    let fix = document.querySelectorAll("#stepElement div");
    for (let i = 0; i < fix.length; i++) fix[i].classList.remove("vald");
    this.classList.add("vald");
    
    commentElem.innerHTML = "";
    
    // ett api request från smapi
    if (smapObj.num_reviews > 0) {
        let request = new XMLHttpRequest(); 
        request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&method=getreviews&id=" + smapObj.id ,true);
        request.send(null); 
        request.onreadystatechange = function () {
            if (request.readyState == 4)


                if (request.status == 200) smapiInfo(request.responseText,smapObj);
                else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";

        };
    }
    else smapiInfo(null,smapObj);
}
// Här så hämtar vi informationen från smapi och skriver ut dom i sidan.
function smapiInfo(commentCheck,smapObj) {
    if (smapObj.website != undefined && smapObj.website != "") genElem.innerHTML = "<a href='" + smapObj.website + "' target='ref'><h3>" + smapObj.name + "</h3></a><p>" + smapObj.abstract +"</p><p>" + smapObj.text +"</p>";
    else genElem.innerHTML = "<h3>" + smapObj.name + "</h3><p>" + smapObj.abstract +"</p><p>" + smapObj.text +"</p>";
    

    if (commentCheck == null) { // Om det inte finns några kommentarer så får står det så.
        commentElem.innerHTML= "<h4>Finns tyvärr inga recentioner för denna plats.</h4>";
    }
    else { // Lägger dit kommentarerna
        resArray = JSON.parse(commentCheck).payload;
        for (let i = 0; i < resArray.length; i++) {
            let comment = document.createElement("div"); // Recensionen
            comment.classList.add("comment");
            comment.innerHTML = "<img src='https://pic.onlinewebfonts.com/svg/img_329115.png'><p>" + resArray[i].comment + "</p>";
            commentElem.appendChild(comment);
        }
    }
  
    initMap(smapObj);
}

// Denna funktion skapar kartan och knappen
function initMap(smapObj) {
    let eventLatLng = new google.maps.LatLng( smapObj.lat , smapObj.lng ); // Positionen för aktiviteten
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

    mapElem.previousElementSibling.innerHTML = "<p>Adress: "+ smapObj.address +"</p>"; // Skriver ut adress.
    let mapBtn = document.createElement("button");// Skapar en knappp som används för att kunna jämföra avståndet från vald adress till nuvarande position.
    mapBtn.classList.add("buttonR");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(mapBtn); // Är slö, därför ser det lite konstigt ut
    mapBtn.innerHTML = "Visa från min position";
    mapBtn.addEventListener("click", function() {  
        getLocation(smapObj,map);
        this.disabled=true; 
    });
    mapElem.previousElementSibling.appendChild(mapBtn);
}

// I denna funktionen så tar vi positionen från vald adress och din nuvarande position för att göra linjen.
function getLocation(smapObj,map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            let LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude); // Din position

            let marker = new google.maps.Marker({ // Markern
                position: LatLng,
                icon: "https://maps.google.com/mapfiles/kml/shapes/man.png"
            });
            marker.setMap(map);
            let distance = haversineDistance(marker, smapObj);
            mapElem.previousElementSibling.innerHTML+= "<p>"+ smapObj.name +" Ligger " + Math.round(distance * 10) /10 + " Km från din nuvarande position" +"</p>";
                
            const flightPlanCoordinates = [ // Positionerna som används för flightPath
                {lat:parseFloat(smapObj.lat), lng: parseFloat(smapObj.lng) },
                {lat: p.coords.latitude ,lng:p.coords.longitude},
            ];

            const flightPath = new google.maps.Polyline({ // Ritar en linje mellan positionerna
                    path: flightPlanCoordinates,
                    geodesic: true,
                    strokeColor: "#000000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
            });
            
            flightPath.setMap(map);
        });
    } 
    
    else alert('Denna funktion är tyvärr inte tillgänglig på din webbläsare.'); // "Geo Location feature is not supported in this browser." stod det först
}


// Hämtar ut din nuvarande position och jämför med alla alternativ och får avståndet i km.
function getDistance(smapiRes) {
    let distanceCheck = new Promise((resolve) => { // Var tvungen att göra ett promise eller callback för den annars gick vidare innan den var klar.
        navigator.geolocation.getCurrentPosition(function (p) {
            let resArray = [ // För att göra harversineDistance smidigare
            lat = p.coords.latitude, 
            lng = p.coords.longitude
            ];
            for (let i = 0; i < smapiRes.length; i++) smapiRes[i].distance = haversineDistance(smapiRes[i],resArray);
            resolve();
        });
    });
    distanceCheck.then(() => {
        listAlts(smapiRes);
    });
}



// Räknar ut avståndet mellan två punkter. Togs från google sedan anpassades om det inte var uppenbart.
function haversineDistance(mk1, mk2) {
    var rlat1; // mk1's lat
    var rlng1; // mk1's lng
    var rlat2; // mk2's lat
    var difflon; // Radianskillnaden.

    if (mk1.description != undefined) { // Används för att se vilken funktion som anropade haversineDistance, 
        rlat1 = mk1.lat * (Math.PI/180); // "PI/180" används för att omvandla grader till radianer
        rlng1 = mk1.lng;
        rlat2 = mk2[0] * (Math.PI/180);
    }
    else {
        rlat1 = mk1.position.lat() * (Math.PI/180); 
        rlng1 = mk1.position.lng();
        rlat2 = mk2.lat * (Math.PI/180); 
    }
    var rad = 6371.0710; // Jordens radie i km
    
    var difflat = rlat2-rlat1; // Radian skillnaden (latitud)
    if (mk1.description) difflon = (mk2[1]-rlng1) * (Math.PI/180); 
    else difflon = (mk2.lng-rlng1) * (Math.PI/180); 
   
    // d = avståndet i km
    var d = 2 * rad * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
}