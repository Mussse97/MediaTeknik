var containElem;
var timeout = 2; // Hur länge hjulet ska snurra
const val = [30,32,40,46,99,106,113,452,478,541]; // Lägg i relevant skit här 99-112 är bowlinghallar
var api_key = "FqZF2ASN";
var spin;
var mom;

function init() {
    containElem = document.getElementById("container");
    spin = document.getElementById("spin");
    mom = document.getElementById("wheelText");

    spin.addEventListener("click",spinny);
}

window.addEventListener("load",init);

function spinny() {
    spin.disabled = true;
    containElem.style.transition = timeout + "s";
    let l = Math.random()*9000
    containElem.style.transform = "rotate(" + l + "deg)";
    setTimeout(() => {
        work()
    }, timeout*1000);
}

function work() {
    let owo = Math.floor(Math.random()*val.length)
    let request = new XMLHttpRequest(); 
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&ids=" + val[owo] + "&method=getall",true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) uwu(request.responseText,owo);
            else alert("Nåt gick fel");
    };
}

function uwu(owo,hej) {
    val.splice(hej,1);
    spin.disabled = false;
    owo = JSON.parse(owo).payload[0];
    let hjul = document.createElement("div")
    hjul.innerHTML += "<h2>" + owo.name + "</h2>" + "<p>" + owo.abstract + "</p>";
    mom.insertBefore(hjul,mom.firstChild);
}