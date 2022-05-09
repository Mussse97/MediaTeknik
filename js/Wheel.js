let containElem;
let timeout = 2;
const val = [11,22,24,215,125,214,211,163,233,777,55,24]; // Lägg i relevant skit här
var api_key = "FqZF2ASN";
let spin;

function init() {
    containElem = document.getElementById("container");
    spin = document.getElementById("spin");
    spin.addEventListener("click",spinny)
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
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=establishment&ids=" + owo + "&method=getall",true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) uwu(request.responseText);
            else alert("Nåt gick fel");
    };
}

function uwu(owo) {
    spin.disabled = false;
    owo = JSON.parse(owo);
    console.log(owo);
    alert(owo.payload[0].name);
}