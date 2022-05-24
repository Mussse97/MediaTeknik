var stepElem;
var fixedCode;
var api_key = "FqZF2ASN";
var resultat = 4; // Hur många resultat vi vill ha
var nerd = [];
var extraElem;
var myMap; 



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
    stepElem = document.getElementById("stepElement");
    infoElem = document.getElementById ("priset");
    fixedCode = fixCode(window.location.search);
    extraElem = document.getElementById("lploss");
   

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
                else listAlts(uwu);
            }
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
        baby.addEventListener("click",lploss);


        stepElem.appendChild(baby);
        stepElem.insertBefore(number, baby);

        if (owo.length == 0) {
            stepElem.innerHTML = "<h2>Finns inga resultat :<</h2>"
            return;
        }
    }
}

function lploss() {
    let wow = this.getAttribute("data-ix");
    wow = nerd[wow];
    // Valda alternativet
    let fix = document.querySelectorAll("#stepElement div")
    for (let i = 0; i < fix.length; i++) fix[i].classList.remove("vald");
    this.classList.add("vald");

    
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

    var a = document.createElement('a');
    a.href = wow.website;
    extraElem.innerHTML = "<h3>"+ wow.name +"</h3>" + "<a><p>"+ "Webbplats: " + wow.website  + "</a>" + "<p>"+ "Antal recentioner: " + wow.num_reviews  + "</p><p>"+ "Adress: " + wow.address + "</p>";

    
    console.log(uwu.comment)
    if (uwu.comment != undefined) {
     extraElem.innerHTML+= "<p>"+ "Recensioner: " + uwu[0].comment +  "</p>";

    }
    else {
        extraElem.innerHTML+= "Finns inga recentioner för denna plats.";
    }
  
  

    initMap(wow);


};

   function initMap(wow) {
    
        //const myLatLng = { lat: 56.90026109693146, lng: 14.55328310345323 };
        let myLatLng = new google.maps.LatLng(  wow.lat , wow.lng);
        let map = new google.maps.Map(document.getElementById("map"), {
          zoom: 11,
          center: myLatLng,
        });
     
        let a = new google.maps.Marker({
          position: myLatLng,
         
        });
a.setMap(map)
        
       if (navigator.geolocation) {
let n ;
         navigator.geolocation.getCurrentPosition(function (p) {
            n=p;
            
              var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
            

              //var map = new google.maps.Map(document.getElementById("map"), mapOptions);
             
              
              var marker = new google.maps.Marker({
                  position: LatLng,
                  label: "Home",
                  title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
              });
              marker.setMap(map)
            
              google.maps.event.addListener(marker, "click", function (e) {
                  var infoWindow = new google.maps.InfoWindow();
                  infoWindow.setContent(marker.title);

                  infoWindow.open(map, marker);
              });
              
              const dinPos = {lat: p.coords.latitude, lng:p.coords.longitude };
             
        
              var mk1 = new google.maps.Marker({position: dinPos, map: map});
              
             let distance = haversineDistance(mk1, wow);
             extraElem.innerHTML+= "<p>"+ wow.name +" Ligger " + Math.round(distance * 10) /10 + " Km från din nuvarande position" +"</p>";
             
            const flightPlanCoordinates = [
                {lat:parseFloat(wow.lat), lng: parseFloat(wow.lng) },
                {lat: p.coords.latitude ,lng:p.coords.longitude},
             ]
             
            /* const flightPlanCoordinates = [
                { lat: 37.772, lng: -122.214 },
                { lat: 21.291, lng: -157.821 },
              
              ];*/
              console.log(flightPlanCoordinates)
              const flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              });
            
              flightPath.setMap(map);
            
              
          });
          
          
      } 
      else {
          alert('Geo Location feature is not supported in this browser.');
      }

      
      }
     
      function haversineDistance(mk1, mk2) {

        var rad = 6371.0710; // Radius of the Earth in kms
        var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
        var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
        var difflat = rlat2-rlat1; // Radian difference (latitudes)
        var difflon = (mk2.lng-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)
    
        var d = 2 * rad * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
        return d;
        
    }

        window.addEventListener("load",initMap);

        

