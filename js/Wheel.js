const val = [11,22,24,215,125,214,211,163,233,777,55,24];
let piece;

function init() {
    
    piece = (360 / val.length);

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
        
    }
}

window.addEventListener("load",init);