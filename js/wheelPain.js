const val = [11,22,24,215,125,214,211,163,233,777,55,24];
let piece;
let pieceElem;

function init() {
    containElem = document.getElementById("container");

    //pieceElem = document.querySelectorAll("#container div")
    pieceDeg = (360 / val.length);
    let y = 100 - 200;
    let x = 16 - 8;
    let k = y/x;
    k = k*-1;
    x = val.length;
    y = k*x;

    for (let i = 0; i < val.length; i++) {
        // Random färg
        let x = parseInt(Math.random()*999999);
        let l = x;
        if (x < 100000) l = "0" + l;
        if (x < 10000) l = "0" + l;
        if (x < 1000) l = "0" + l;
        if (x < 100) l = "0" + l;
        if (x < 10) l = "0" + l;
        if (x < 1) l = "0" + l;
        l = "#" + l;

        // Skapa bitarna
        let r = document.createElement("div");
        r.innerHTML = val[i];
        r.style.backgroundColor = l;
        r.style.width = y + "px";
        r.style.transform = "rotate(" + pieceDeg*i + "deg)"
        containElem.appendChild(r);
    }
}

window.addEventListener("load",init);