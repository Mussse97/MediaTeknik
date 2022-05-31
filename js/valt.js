var stepElem;
var fixedCode;
var api_key = "FqZF2ASN";
var resultat = 4; // Hur många resultat vi vill ha
var nerd = [];
var genElem;
var commentElem;
var choiceDivs;
var extraElem;
var l = 0;
var mapElem;
var sort = "Betyg";
var toggle = 0;



const chosenAct = [
    {urlA:"establishment&types=activity"}, // Controller

    {urlA:"&descriptions=Gokart,Zipline,Bowlinghall,Skateboardpark", urlB:"&descriptions=Nöjespark,Nöjescenter"},

    {urlA:"&price_ranges=100-250,0-25", urlB:"&price_ranges=250-500,1250-5000"},
    
    {urlA:"&outdoors=Y", urlB:"&outdoors=N"},
    
    {urlA:"&provinces=småland", urlB:"&provinces=öland"}

];
const chosenFood = [
    {urlB:"food"}, // Controller

    {urlA:"&types=FINE_DINING&sub_types=A_LA_CARTE,PASTRIES,LOCAL,ASIAN", urlB:"&types=CASUAL&sub_types=A_LA_CARTE,PASTRIES,LOCAL,ASIAN"},

    {urlA:"&outdoor_seating=Y", urlB:"&indoor_seating=Y"},

    {urlA:"&vegetarian_option=Y", urlB:"&vegetarian_option=N"},
    
    {urlA:"&provinces=småland", urlB:"&provinces=öland"} //Provinces finns bara i establshment taggen...
];

const hatarAllt = [
    "Generell info",
    "Hitta hit",
    "Recensioner"
];

const sorts = [
    "Betyg",
    "Plats",
    "Slumpmässigt"
];



function init() {
    stepElem = document.getElementById("stepElement");
    infoElem = document.getElementById ("priset");
    genElem = document.getElementById("genInfo");
    commentElem = document.getElementById("comment");
    extraElem = document.getElementById("extraInfo");
    choiceDivs = document.querySelectorAll(".lazy");
    mapElem = document.getElementById("map")
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
        else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";
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

    quickFix.toString();
    request = new XMLHttpRequest();
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&types=food&method=getall&ids=" + quickFix,true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) addJSON(JSON.parse(request.responseText).payload,xd)
            else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";
    };
}

function addJSON(owo,xd) {
    let najs;
    if (xd[0] == "food") najs = "restaurang";
    else najs = "aktivitet";
    let request = new XMLHttpRequest(); // AJAX andropningsvariabel
    request.open("GET","json/"+najs+".json",true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) whatJSON(owo,request.responseText,xd);
    };
}

function whatJSON(owo,uwu,xd) {
    uwu = JSON.parse(uwu);
    
    let najs;
    if (xd[0] == "food") {
        najs = chosenFood;
        
        if (xd[4] == najs[4].urlB) {
            for (let k = owo.length-1; k >= 0; k--) {
                if (owo[k].province == "Småland") owo.splice(k,1)
            }
        }
    }
    else najs = chosenAct;
    
    let critCheck = [];

    if (uwu.length != 0) {
        for (let i = 1; i < xd.length; i++) {
            let criteria;
            
            if (xd[i] == najs[i].urlA) criteria = "Y";
            else criteria = "N";

            critCheck.push(criteria);
            for (let k = uwu.length-1; k >= 0; k--) {
                let x = i-1;
                if (xd[0] == "food" && x == 1) { // Om de måste ha uteservering tar vi bort 
                    if (criteria == "Y" && uwu[k].crit[x] != criteria) uwu.splice(k,1);
                }
                else if (xd[0] == "food" && x == 2) {
                    if (criteria == "Y" && uwu[k].crit[x] != criteria) uwu.splice(k,1);
                }
                else if (uwu[k].crit[x] != criteria) uwu.splice(k,1);
            }
        }
    for (let i = 0; i < uwu.length; i++) owo.push(uwu[i]);
    }

    if (owo.length == 0) {
        let girlPower = document.createElement("div");
        girlPower.innerHTML += "<h2>Finns inga resultat :<</h2>"
        girlPower.classList.add("error");
        stepElem.appendChild(girlPower);
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
    
    let gamerGirlWaterContainer = document.createElement("div");
    stepElem.appendChild(gamerGirlWaterContainer);

    for (let i = 0; i < sorts.length; i++) {
        let gamerGirlWater = document.createElement("button");
        gamerGirlWater.innerHTML += sorts[i];
        gamerGirlWater.classList.add("buttonR");
        gamerGirlWaterContainer.classList.add("GamerGirlsDefyGravity");
        gamerGirlWater.addEventListener("click", function() {
            sort = sorts[i];
            listAlts(owo);
        })
        gamerGirlWaterContainer.appendChild(gamerGirlWater);
    }

    nerd = [];
    
    for (let i = 0; i < resultat; i++) {

        if (owo[i] == undefined) {
            let girlPower = document.createElement("div");
            girlPower.innerHTML += "<h2>Finns inga flera resultat :<</h2>"
            girlPower.classList.add("error");
            stepElem.appendChild(girlPower);
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
        baby.addEventListener("click",lploss);
        baby.style.cursor = "pointer";

        stepElem.appendChild(baby);
        stepElem.insertBefore(number, baby);
    }
}

function svante() {
    this.classList.toggle("sexmaskinenSigvardFjante");
}

function lploss() { 
    if (this.classList.contains("vald")) return;
    let wow = this.getAttribute("data-ix");
    wow = nerd[wow];

    
    if (l == 0) {
        for (let i = 0; i < hatarAllt.length; i++) {
            let sixten = document.createElement("div");
            sixten.classList.add("sexmaskinenSigvardFjante");
            sixten.addEventListener("click",svante);
            sixten.style.cursor = "pointer";
            sixten.innerHTML = "<h1>" + hatarAllt[i] + "</h1>";
            extraElem.insertBefore(sixten,choiceDivs[i]);
        }
        l++;
        genElem.previousElementSibling.classList.toggle("sexmaskinenSigvardFjante");
    }

    // Valda alternativet
    let fix = document.querySelectorAll("#stepElement div")
    for (let i = 0; i < fix.length; i++) fix[i].classList.remove("vald");
    this.classList.add("vald");
    
    commentElem.innerHTML = "";
    
    if (wow.num_reviews > 0) {
        let request = new XMLHttpRequest(); 
        request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&method=getreviews&id=" + wow.id ,true);
        request.send(null); 
        request.onreadystatechange = function () {
            if (request.readyState == 4)
                if (request.status == 200) musse(request.responseText,wow);
                else stepElem.innerHTML = "<h2>Nåt gick fel</h2>";
        };
    }
    else musse(null,wow);
}

function musse(lol,wow) {
    genElem.innerHTML = "<a href='" + wow.website + "'><h3>" + wow.name + "</h3></a><p>" + wow.abstract +"</p><p>" + wow.text +"</p>";

    if (lol == null) {
        commentElem.innerHTML= "<h4>Finns inga tyvärr recentioner för denna plats.</h4>";
    }
    else {
        uwu = JSON.parse(lol).payload;
        for (let i = 0; i < uwu.length; i++) {
            let comment = document.createElement("div");
            comment.classList.add("comment");
            comment.innerHTML = "<img src='https://pic.onlinewebfonts.com/svg/img_329115.png'><p>" + uwu[i].comment + "</p>";
            commentElem.appendChild(comment);
        }
        
        //genElem.innerHTML += "<p> Recensioner: " + uwu[0].comment +  "</p>";
    }
  
    initMap(wow);
};

function initMap(wow) {
    //const eventLatLng = { lat: 56.90026109693146, lng: 14.55328310345323 };
    let eventLatLng = new google.maps.LatLng( wow.lat , wow.lng );
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
        icon: "https://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png"
    });
    a.setMap(map);

    mapElem.previousElementSibling.innerHTML = "<p>Adress: "+ wow.address +"</p>"
    let minion = document.createElement("button");
    minion.classList.add("buttonR");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(minion); // KOLLA PÅ SEN
    minion.innerHTML = "Visa från min position";
    minion.addEventListener("click", function() { getLocation(wow,map) });
    mapElem.previousElementSibling.appendChild(minion);
}

function getLocation(wow,map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            let LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);

            let marker = new google.maps.Marker({
                position: LatLng,
                //label: "Home",
                icon: "https://maps.google.com/mapfiles/kml/shapes/man.png"
            });
            marker.setMap(map);
            
            let distance = haversineDistance(marker, wow);
            mapElem.previousElementSibling.innerHTML+= "<p>"+ wow.name +" Ligger " + Math.round(distance * 10) /10 + " Km från din nuvarande position" +"</p>";
                
            const flightPlanCoordinates = [
                {lat:parseFloat(wow.lat), lng: parseFloat(wow.lng) },
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

function getDistance(owo) {
    let hugeAnimeTiddies = new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(function (p) {
            let uwu = [
            lat = p.coords.latitude, 
            lng = p.coords.longitude
            ];
            for (let i = 0; i < owo.length; i++) owo[i].distance = haversineDistance(owo[i],uwu);
            resolve()
        })
    })
    hugeAnimeTiddies.then(() => {
        listAlts(owo);
    })
}

function callbackDistance() {
    
}
     
function haversineDistance(mk1, mk2) {
    var rlat1;
    var rlng1;
    var rlat2;
    var difflon;

    if (typeof mk1.description != undefined) {
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