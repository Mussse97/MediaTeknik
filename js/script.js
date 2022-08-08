// Array som koppplas till den i valt.js, Här så kopplas en del av smapi länken till en text och bild i aktiviteter
const chosenAct = [
    {altA:"Aktiv", descA:"Vi vill röra oss mycket på dejten", altB:"Lugn", descB:"Ni behöver inte svettas", urlA:"zipline1.jpg", urlB:"lugn1.jpg"},

    {altA:"Under 250", descA:"Helst en aktivitet under 250kr", altB:"Över 250", descB:"Vi är ute efter en dyr aktivitet", urlA:"billig1.jpg", urlB:"dyr1.jpg"},

    {altA:"Utomhus", descA:"En utomhusaktivitet låter bra", altB:"Inomhus", descB:"Vi skulle vilja ha en inomhusaktivitet", urlA:"utomhus1.jpg", urlB:"inomhus1.jpg"},

    {altA:"Småland", descA:"Aktiviteter bara i Småland", altB:"Öland", descB:"Aktiviteter bara på Öland", urlA:"småland1.jpg", urlB:"öland1.jpg"}
];
// Array som koppplas till den i valt.js, Här så kopplas en del av smapi länken till en text och bild i reasturanger.
const chosenRes = [

    {altA:"Fint", descA:"Bara fina restauranger.", altB:"Casual", descB:"Reasturanger med global inspererad mat", urlA:"fint1.jpg", urlB:"casual3.jpg"}, 

    {altB:"Inomhus", descB:"Det ska vara inomhus", altA:"Utomhus", descA:" Det ska finnas utomhusservering", urlB:"inomhusservering1.jpg", urlA:"utomhusservering1.jpg"},


    {altA:"Vegetarisk meny", descA:"Det ska finnas vegetariska alternativ", altB:"Spelar ingen roll", descB:"Du behöver ej det alternativet", urlA:"vegetarisk1.jpg", urlB:"kött1.jpg"},
	
	{altA:"Småland", descA:"Aktiviteter bara i Småland", altB:"Öland", descB:"Aktiviteter bara i Öland", urlA:"småland1.jpg", urlB:"öland1.jpg"}
];
		
const choices = []; // Vilket alternativ som är valt
var fraga = 0; // Detta håller koll på vilken fråga användaren är på.
var progressElem; // Detta hanterar bollarna som indikerar vilken fråga man är på.
var chosenThing; // Vad som är valt, aktivitet eller restaurang.
var choiceElem; // Div-element till "chosenThing".


function init() {
    choiceElem = document.querySelectorAll("#choice div");
	progressElem = document.querySelectorAll("#progress div");

	for (let i = 0; i < progressElem.length; i++) {
		progressElem[i].addEventListener("click",rewind);
		progressElem[i].setAttribute("data-ix",i);
		progressElem[i].style.cursor = "not-allowed"; 
	}

	for (let i = 0; i < choiceElem.length; i++) {
		choiceElem[i].addEventListener("click",proceed);
		choiceElem[i].setAttribute("data-ix",i);
	}
}

window.addEventListener("load", init);

// I denna funktion så kollar programmet om frågan man är på är lika med 5 (alltså sista frågan) då kommer man vidare till resultatsidan där man får en blandning av det man valt.
function kontroller() { 
	if (fraga == 5) { 
		let x = window.location.href;
		x = x.replace('start.html','');
		x += "valt.html?val=" + choices.toString(); 
		window.location.href = x;
		return;
	}
	
	for (let i = 0; i < progressElem.length; i++) { 
		if (i < fraga) {
			progressElem[i].style.cursor = "pointer";
			progressElem[i].style.backgroundColor = "#692323";
		}
		else {
			progressElem[i].style.cursor = "not-allowed";
			progressElem[i].style.backgroundColor = "black";
		}
	}
// Om fraga är 0 vilket betyder att användaren inte gjort ett val så ska sidan visa de två första alternativen som är "aktivitet" eller "restaurang"
	if (fraga == 0) { 
		choiceElem[0].innerHTML = "<h3> Aktivitet </h3>";
		choiceElem[0].style.backgroundImage = "linear-gradient(	rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),  url(../bilder/nöjespark.jpg)";
		choiceElem[1].innerHTML = "<h3> Restaurang </h3>";
		choiceElem[1].style.backgroundImage = "linear-gradient(	rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),  url(../bilder/restaurang.jpg)";
		choiceElem[2].innerHTML = "";
		choiceElem[2].style.width = "0%"; 
		return;
	}
// I denna if-sats så kontrollerar programmet om användaren valt aktiviteter eller restauranger.
	if (fraga == 1) { 
		if (choices[0] == 0) chosenThing = chosenAct;
		else chosenThing = chosenRes;
	}

	let fr = fraga-1; 

	choiceElem[2].style.width = "0%";
	
// Koden nedan kontrollerar vad som är valt av användaren och ger den rätt beskrivning samt bild.
	choiceElem[0].innerHTML = "<h3>" + chosenThing[fr].altA +"</h3>" + "<p>" + chosenThing[fr].descA +"</p>";
	choiceElem[0].style.backgroundImage =  "linear-gradient( rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(../bilder/"+ chosenThing[fr].urlA +")";
	choiceElem[1].innerHTML = "<h3>" + chosenThing[fr].altB +"</h3>" + "<p>" + chosenThing[fr].descB +"</p>";
	choiceElem[1].style.backgroundImage = "linear-gradient(	rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(../bilder/"+ chosenThing[fr].urlB +")";

	if (chosenThing[fr].altC != undefined) { // Ifall alternativ C finns
		choiceElem[2].innerHTML = "<h3>" + chosenThing[fr].altC +"</h3>" + "<p>" + chosenThing[fr].descC +"</p>";
		choiceElem[2].style.backgroundImage = "linear-gradient(	rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),  url(../bilder/"+ chosenThing[fr].urlC +")";
		choiceElem[2].style.width = "100%";
	}
}

// Denna funktion hanterar bollarna som befinner sig längst ner i sidan och som används för användaren som kontroll på hur många frågor som är kvar och vilken fråga de är på just nu.
function rewind() {
	if (fraga >= this.getAttribute("data-ix")) { // Är det OK att klicka på den bollen?
		let reduc = fraga-this.getAttribute("data-ix"); // Hur långt ska jag gå tillbaka? :<
		for (let i = 0; i < reduc; i++) { // Ta bort val om man går tillbaka
			choices.splice(-1,1);
		}
		fraga = this.getAttribute("data-ix"); 
		kontroller();
	}
}

// Sparar valen och går vidare till nästa fråga.
function proceed() {
	fraga++;
	let k = this.getAttribute("data-ix");
	choices.push(k);
	kontroller();
}