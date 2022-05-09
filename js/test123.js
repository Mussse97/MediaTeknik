var api_key = "FqZF2ASN";

function xd() {
    let request = new XMLHttpRequest(); 
    request.open("GET","https://smapi.lnu.se/api/?api_key=" + api_key + "&controller=description&method=getall",true);
    request.send(null); 
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200) intePog(request.responseText);
            else console.log("något gick fel");
    };
}

window.addEventListener("click",xd)

function intePog(nerd) {
    nerd = JSON.parse(nerd);
    nerd = nerd.payload;
    for (let i = 0; i < nerd.length; i++) {
        console.log(nerd[i].description)
        
    }
}