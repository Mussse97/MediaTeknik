var choiceElem; // Parent till de vi bryr oss om
const chosenAct = [
    {altA:"Aktiv", descA:"Jag vill få aktiva alternativ", altB:"Lugn", descB:"Du vill inte behöva svettas", urlA:"zipline.jpg", urlB:"lugn1.jpg"},

    {altA:"Helst en aktivitet under 250", descA:"Kostnaden överskrider inte 250kr", altB:"Kostnaden spelar ingen roll", descB:"Detta vall så kommer kostnader över 500kr", urlA:"billig.jpg", urlB:"dyr.jpg"},

    {altA:"Utomhus", descA:"Du vill att aktiviteten ska ha utomhus alternativ", altB:"Både inomhus och utomhus", descB:"Det spelar ingen roll för dig", urlA:"utomhus.jpg", urlB:"inomhus.jpg"},

    {altA:"Småland", descA:"Aktiviteter bara i Småland", altB:"Öland", descB:"Aktiviteter bara i Öland", urlA:"småland.jpg", urlB:"öland.jpg"}
];

const chosenRes = [

    {altA:"Fint", descA:"Bara fina restauranger.", altB:"Casual", descB:"Reasturanger med global inspererad mat", altC:"bakeri", descC:"BAKERI", urlA:"fint.jpg", urlB:"casual.jpg", urlC:"bakeri.jpg"}, 

    {altA:"Local", descA:"En bistro är en mindre restaurang eller ett kafé", altB:"A la carte", descB:"Vi vill sitta inne.", urlA:"local.jpg", urlB:"alacarte.jpg"},

    {altA:"Inomhus", descA:"Det ska vara inomhus", altB:"Utomhus", descB:" Det ska finnas utomhusservering",  urlA:"inomhusservering.jpg", urlB:"utomhusservering.jpg"},

    {altA:"Vegitariansk meny", descA:"Det ska finnas vegitarianska alternativ", altB:"Spelar ingen roll", descB:"Du behöver ej det alternativet", urlA:"vegetarisk.jpg", urlB:"kött.jpg"}
];
		// Förslag: Buffe, vegetarisk, alkohol, 
const choices = []; // Vilket alternativ som är valt
var fraga = 0; // Vilken fråga är vi på?
var progressElem; // Bollarna
var chosenThing; // Vad är valt, aktivitet eller restaurang?


// Initiera skit
function init() {
    choiceElem = document.querySelectorAll("#choice div");
	progressElem = document.querySelectorAll("#progress div");

	for (let i = 0; i < progressElem.length; i++) {
		progressElem[i].addEventListener("click",rewind);
		progressElem[i].setAttribute("data-ix",i);
		progressElem[i].style.cursor = "not-allowed"; // Orkar inte kolla upp vad default cursorn heter...
	}

	for (let i = 0; i < choiceElem.length; i++) {
		choiceElem[i].addEventListener("click",tuffing);
		choiceElem[i].setAttribute("data-ix",i);
	}

}

window.addEventListener("load",init);

// Typ allt
function stuff() { 
	if (fraga == 5) { // ändra den här om du lägger till flera frågor
		let x = window.location.href;
		x = x.replace('start.html','');
		x += "valt.html?val=" + choices.toString(); 
		window.location.href = x;
		return;
	}
	
	for (let i = 0; i < progressElem.length; i++) { // Fixar bollarna
		if (i < fraga) {
			progressElem[i].style.cursor = "pointer";
			progressElem[i].style.backgroundColor = "#692323";
		}
		else {
			progressElem[i].style.cursor = "not-allowed";
			progressElem[i].style.backgroundColor = "black";
		}
	}

	if (fraga == 0) { // Ifall man börjar om helt
		choiceElem[0].innerHTML = "<h3> Aktivitet </h3>";
		choiceElem[1].innerHTML = "<h3> Restaurang </h3>";
		choiceElem[2].innerHTML = "";
		choiceElem[2].style.width = "0%"; // Ändrar vi något som t.ex "opacity" så kan man fortfarande klicka på den
		return;
	}

	if (fraga == 1) { // Väljer rätt array 
		if (choices[0] == 0) chosenThing = chosenAct;
		else chosenThing = chosenRes;
	}

	let fr = fraga-1; // :(

	choiceElem[2].style.width = "0%";
	

	choiceElem[0].innerHTML = "<h3>" + chosenThing[fr].altA +"</h3>" + "<p>" + chosenThing[fr].descA +"</p>";
	choiceElem[0].style.backgroundImage = "url(../bilder/"+ chosenThing[fr].urlA +")";
	choiceElem[1].innerHTML = "<h3>" + chosenThing[fr].altB +"</h3>" + "<p>" + chosenThing[fr].descB +"</p>";
	choiceElem[1].style.backgroundImage = "url(../bilder/"+ chosenThing[fr].urlB +")";

	if (chosenThing[fr].altC != undefined) { // Ifall alternativ C finns
		choiceElem[2].innerHTML = "<h3>" + chosenThing[fr].altC +"</h3>" + "<p>" + chosenThing[fr].descC +"</p>";
		choiceElem[2].style.backgroundImage = "url(../bilder/"+ chosenThing[fr].urlC +")";
		choiceElem[2].style.width = "100%";
	}
}

// Bollarna
function rewind() {
	if (fraga >= this.getAttribute("data-ix")) { // Är det OK att klicka på den bollen?
		let reduc = fraga-this.getAttribute("data-ix"); // Hur långt ska jag gå tillbaka? :<
		for (let i = 0; i < reduc; i++) { // Ta bort val om man går tillbaka
			choices.splice(-1,1);
		}
		fraga = this.getAttribute("data-ix"); // Ändrar skiten
		stuff();
	}
}

// Spara valen o nästa fråga
function tuffing() {
	fraga++;
	let k = this.getAttribute("data-ix");
	choices.push(k);
	stuff();
}