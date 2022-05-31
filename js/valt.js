
//Globala variabler.
var stepElem; // Används för att skriva ut information i div element.
var fixedCode; // Fixar koden som vi får från start.html
var api_key = "FqZF2ASN"; // Personlig api key.
var resultat = 4; // Hur många resultat vi vill ha
var nerd = []; // array med resultaten från  smapi.
var genElem; // Ett utav extra valen som är generell info om vald plats.
var commentElem; // Används för kommentarer från smapi.
var choiceDivs; // Extra valen som finns i resultat sidan.
var extraElem; // ett div element som skapas för att visa extra information som google maps.
var l = 0;
var o = 0;
var mapElem; // Detta är elementet för google maps.
var sort = "Betyg"; // Variabel som används för att sortera med betyg från smapi.
var toggle = 0;


// array som översätts till val i webbplatsen.
const chosenAct = [
    {urlA:"establishment&types=activity"}, // Controller

    {urlA:"&descriptions=Gokart,Zipline,Bowlinghall,Skateboardpark", urlB:"&descriptions=Nöjespark,Nöjescenter"},

    {urlA:"&price_ranges=100-250,0-25", urlB:"&price_ranges=250-500,1250-5000"},
    
    {urlA:"&outdoors=Y", urlB:"&outdoors=N"},
    
    {urlA:"&provinces=småland", urlB:"&provinces=öland"}

];

// array som översätts till val i webbplatsen.
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
    "Plats",
    "Slumpmässigt"
];



function init() {
    stepElem = document.getElementById("stepElement");
    genElem = document.getElementById("genInfo");
    commentElem = document.getElementById("comment");
    extraElem = document.getElementById("extraInfo");
    choiceDivs = document.querySelectorAll(".lazy");
    mapElem = document.getElementById("map")
    fixedCode = fixCode(window.location.search);
// Denna if sats bestämmer om den ska använda sig av arrayen chosen act eller chosenfood beroende på vad användaren klickar på.
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

function getController(resArray) {
    let controller = [];
   
    for (let i = 0; i < resArray.length; i++) {
        if (fixedCode[i] == 0) controller.push(resArray[i].urlA);
        else if (fixedCode[i] == 1) controller.push(resArray[i].urlB);
        else controller.push(resArray[i].urlC);
    }

    applyController(controller);
}
// Denna request till smapi så läggs filtreringarna som finns i array chosenfood och cosenact i sökmotorn så att vi får ut informationen vi vill ha.
function applyController(xd) {
    let fixIt;
    if (xd[0] == "food") fixIt = "https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=" + xd[0] + "&method=getall&order_by=rating&per_page="+ resultat + xd[1] + xd[2] + xd[3];
    else fixIt = "https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=" + xd[0] + "&method=getall&order_by=rating&per_page="+ resultat + xd[1] + xd[2] + xd[3] + xd[4];
    let request = new XMLHttpRequest(); 
    
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

function foodFix(owo,xd) {
    owo = JSON.parse(owo).payload;

    if (owo.length == 0) {
        addJSON(owo,xd);
        return;
    }

    let quickFix = [];

    for (let i = 0; i < owo.length; i++) {
        quickFix.push(owo[i].id);
    }
// En till smapi request denna gång är det för att få information som finns i establishment.
    quickFix.toString();
    request = new XMLHttpRequest();
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&types=food&method=getall&ids=" + quickFix,true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) addJSON(JSON.parse(request.responseText).payload,xd)
            else stepElem.innerHTML = "<h2>något gick fel</h2>";
    };
}
// En request till Json filerna.
function addJSON(owo,xd) {
    let reasList;
    if (xd[0] == "food") reasList = "restaurang";
    else reasList = "aktivitet";
    let request = new XMLHttpRequest(); // AJAX andropningsvariabel
    request.open("GET","json/"+reasList+".json",true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) whatJSON(owo,request.responseText,xd);
    };
}

function whatJSON(owo,resArray,xd) {
    resArray = JSON.parse(resArray);
    
    let reasList;
    if (xd[0] == "food") {
        reasList = chosenFood;
        
        if (xd[4] == reasList[4].urlB) {
            for (let k = owo.length-1; k >= 0; k--) {
                if (owo[k].province == "Småland") owo.splice(k,1)
            }
        }
    }
    else reasList = chosenAct;
    
    let critCheck = []; // detta är en array som används för filtrering av information som finns i Json filer.

    if (resArray.length != 0) {
        for (let i = 1; i < xd.length; i++) {
            let criteria;
            // I Json filerna finns criterier Y eller N, denna funktion kontrollerar dessa kriterier.
            if (xd[i] == reasList[i].urlA) criteria = "Y";
            else criteria = "N";

            critCheck.push(criteria);
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
    for (let i = 0; i < resArray.length; i++) owo.push(resArray[i]);
    }

    if (owo.length == 0) {
        let errorElem = document.createElement("div");
        errorElem.innerHTML += "<h2>Finns inga resultat</h2>"
        errorElem.classList.add("error");
        stepElem.appendChild(errorElem);
        return;
    }
    
    listAlts(owo);
}

function listAlts(owo) {
    stepElem.innerHTML = "";
    if (sort == "Betyg") owo.sort((a,b) => b.rating - a.rating);
    else if (sort == "Plats") {
        if (owo[0].distance == undefined) getDistance(owo); 
        else if (owo[0].distance != undefined) owo.sort((a,b) => a.distance - b.distance);
    }
    else if (sort == "Slumpmässigt") owo.sort((a, b) => 0.5 - Math.random());
    
    if (o == 0) {
        let btnContainer = document.createElement("div");
        btnContainer.setAttribute("id","sortBtn");
        stepElem.parentElement.appendChild(btnContainer);

        o++;
        for (let i = 0; i < sorts.length; i++) {
            let btn = document.createElement("button");
            btn.innerHTML += sorts[i];
            btn.classList.add("buttonR");
            btn.addEventListener("click", function() {
                sort = sorts[i];
                listAlts(owo);
            })
            btnContainer.appendChild(btn);
        }
    }
    

    nerd = []; // tom array.
   
    // i denna funktion så går vi igenom resultat som är filtrerade resultat från smapi, skapar ett div element där informationen kan visas.
    for (let i = 0; i < resultat; i++) {

        if (owo[i] == undefined) {
            let errorElem = document.createElement("div");
            errorElem.innerHTML += "<h2>Finns inga flera resultat </h2>"
            errorElem.classList.add("error");
            stepElem.appendChild(errorElem);
            break;
        }

        let baby = document.createElement("div");
        let number = document.createElement("h1");
        number.innerHTML = (i+1) + ".";
        if (owo[i].distance != undefined) baby.innerHTML = "<h3>"+ owo[i].name + "</h3><h4>"+ parseInt(owo[i].distance) + " km bort</h4><p>Betyg: " + Math.round(owo[i].rating * 10) /10 +"</p>" + "<p>Pris: " + owo[i].price_range + " kr (per person)</p>";
        else baby.innerHTML = "<h3>"+ owo[i].name +"</h3><p>Betyg: " + Math.round(owo[i].rating * 10) /10 +"</p>" + 
        "<p>Pris: " + owo[i].price_range + " kr (per person)</p>";

        nerd.push(owo[i]);
        baby.setAttribute("data-ix",i);
        baby.addEventListener("click",listResults);
        baby.style.cursor = "pointer";
        
        stepElem.appendChild(baby);
        baby.insertBefore(number, baby.firstChild);
    }
}

function resultToggle() {
    this.classList.toggle("closeDivs");
}

function listResults() { 
    if (window.innerWidth < 600) document.getElementById('extraInfo').scrollIntoView();
    if (this.classList.contains("vald")) return;
    let smapObj = this.getAttribute("data-ix");
    smapObj = nerd[smapObj];

    
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
    let fix = document.querySelectorAll("#stepElement div")
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

                if (request.status == 200) musse(request.responseText,smapObj);
                else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";

        };
    }
    else musse(null,smapObj);
}
// Här så hämtar vi informationen från smapi och skriver ut dom i sidan.
function musse(commentCheck,smapObj) {
    if (smapObj.website != undefined && smapObj.website != "") genElem.innerHTML = "<a href='" + smapObj.website + "' target='ref'><h3>" + smapObj.name + "</h3></a><p>" + smapObj.abstract +"</p><p>" + smapObj.text +"</p>";
    else genElem.innerHTML = "<h3>" + smapObj.name + "</h3><p>" + smapObj.abstract +"</p><p>" + smapObj.text +"</p>";
    

    if (commentCheck == null) { // om det inte finns några kommentarer så får man ett fel meddelande.
        commentElem.innerHTML= "<h4>Finns tyvärr inga recentioner för denna plats.</h4>";
    }
    else {
        resArray = JSON.parse(commentCheck).payload;
        for (let i = 0; i < resArray.length; i++) {
            let comment = document.createElement("div");
            comment.classList.add("comment");
            comment.innerHTML = "<img src='https://pic.onlinewebfonts.com/svg/img_329115.png'><p>" + resArray[i].comment + "</p>";
            commentElem.appendChild(comment);
        }
    }
  
    initMap(smapObj);
};

// Denna funktion så skapar vi google mappen och lägger focus på positonen som vald adress ligger i.
function initMap(smapObj) {
    //const eventLatLng = { lat: 56.90026109693146, lng: 14.55328310345323 };
    let eventLatLng = new google.maps.LatLng( smapObj.lat , smapObj.lng );
    let map = new google.maps.Map(mapElem, {
        zoom: 10,
        center: eventLatLng,
        styles: [
            {featureType:"poi", stylers:[{visibility:"off"}]},  // No points of interest.
            {featureType:"transit.station",stylers:[{visibility:"off"}]}  // No bus stations, etc.
        ]
    });

    let a = new google.maps.Marker({
        position: eventLatLng,
        icon: "http://maps.google.com/mapfiles/kml/paddle/purple-blank.png"
    });
    a.setMap(map);

    mapElem.previousElementSibling.innerHTML = "<p>Adress: "+ smapObj.address +"</p>"; // Skriver ut adress.
    let mapBtn = document.createElement("button");// Skapar en knappp som används för att kunna gemföra avståndet från vald adress till nuvarande position.
    mapBtn.classList.add("buttonR");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(mapBtn); // KOLLA PÅ SEN
    mapBtn.innerHTML = "Visa från min position";
    mapBtn.addEventListener("click", function() { getLocation(smapObj,map) });
    mapElem.previousElementSibling.appendChild(mapBtn);
}

// I denna funktioin så tar den positionen från vald adress och din nuvarande position och lägger den i variabler.
function getLocation(smapObj,map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            let LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);

            let marker = new google.maps.Marker({
                position: LatLng,
                icon: "https://maps.google.com/mapfiles/kml/shapes/man.png"
            });
            marker.setMap(map);
            
                
            const flightPlanCoordinates = [
                {lat:parseFloat(smapObj.lat), lng: parseFloat(smapObj.lng) },
                {lat: p.coords.latitude ,lng:p.coords.longitude},
            ]

            const flightPath = new google.maps.Polyline({
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
// Hämtar ut din nuvarande position.
function getDistance(owo) {
    let mapPromise = new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(function (p) {
            let resArray = [
            lat = p.coords.latitude, 
            lng = p.coords.longitude
            ];
            for (let i = 0; i < owo.length; i++) owo[i].distance = haversineDistance(owo[i],resArray);
            resolve()
        })
    })
    mapPromise.then(() => {
        listAlts(owo);
    })
}



     // Räknar ut avståndet till vald adress.
function haversineDistance(mk1, mk2) {
    var rlat1;
    var rlng1;
    var rlat2;
    var difflon;

    if (mk1.description != undefined) {
        rlat1 = mk1.lat * (Math.PI/180);
        rlng1 = mk1.lng;
        rlat2 = mk2[0] * (Math.PI/180);
    }
    else {
        rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians 
        rlng1 = mk1.position.lng();
        rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
    }
    var rad = 6371.0710; // Radius of the Earth in kms
    
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    if (mk1.description) difflon = (mk2[1]-rlng1) * (Math.PI/180); // Radian difference (longitudes)
    else difflon = (mk2.lng-rlng1) * (Math.PI/180); // Radian difference (longitudes)
   

    var d = 2 * rad * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;
}

//window.addEventListener("load",initMap);