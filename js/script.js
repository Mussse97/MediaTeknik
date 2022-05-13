var choiceElem; // Parent till de vi bryr oss om
const chosenAct = [
<<<<<<< HEAD
	{altA:"Lugn", descA:"Vi vill ha en lugn aktivitet.", altB:"Aktiv", descB:"En aktivitet där man rör på sig passar oss.", urlA:"lugn.jpeg", urlB:"lugn.jpeg"},
	{altA:"Heldagsaktivitet", descA:"Aktiviteter under 500.", altB:"Halvdagsaktivitet", descB:"Aktiviteter övre 500.", altC:"Halv/heldagsaktivitet", descC:"Gratis är gott!", urlA:"lugn.jpeg", urlB:"lugn.jpeg", urlC:"lugn.jpeg"},
	{altA:"Vatten ja", descA:"Det är viktigt att aktiviteten är inomhus.", altB:"Vatten nej", descB:"Vi skulle vilja ha en utomhus aktivitet.", urlA:"lugn.jpeg", urlB:"lugn.jpeg"},
	{altA:"18års gräns", descA:"Visa bara aktiviterer i Småland.", altB:"Ingen 18års gräns", descB:"Visa bara aktiviteter i Öland.", altC:"Båda", descC:"Visa aktiviteter i både Småland och Öland.", urlA:"lugn.jpeg", urlB:"lugn.jpeg", urlC:"lugn.jpeg"}
=======
    {altA:"Aktiv", descA:"Jag vill få aktiva alternativ", altB:"Lugn", descB:"Du vill inte behöva svettas"},

    {altA:"Helst en aktivitet under 250", descA:"Kostnaden överskrider inte 250kr", altB:"Kostnaden spelar ingen roll", descB:"Detta vall så kommer kostnader över 500kr"},

    {altA:"Utomhus", descA:"Du vill att aktiviteten ska ha utomhus alternativ", altB:"Både inomhus och utomhus", descB:"Det spelar ingen roll för dig"},

    {altA:"Småland", descA:"Aktiviteter bara i Småland", altB:"Öland", descB:"Aktiviteter bara i Öland"}
>>>>>>> 8962863327544b8ddeba91ea3f397fae24924bd1
];

const chosenRes = [
<<<<<<< HEAD
	{altA:"Fint", descA:"Bara fina restauranger.", altB:"Vanliga restauranger", descB:"Typ McDonalds HAHA", urlA:"lugn.jpeg", urlB:"lugn.jpeg"},
	{altA:"Uteservering", descA:"Det måste finnas uteservering!", altB:"Inomhus", descB:"Vi vill sitta inne.", urlA:"lugn.jpeg", urlB:"lugn.jpeg"},
	{altA:"Billigt", descA:"Restauranger som går under en 500 lapp.", altB:"Dyrt", descB:"Kostar över 500.", urlA:"lugn.jpeg", urlB:"lugn.jpeg"},
	{altA:"Småland", descA:"Visa bara restauranger i Småland.", altB:"Öland", descB:"Visa bara restauranger i Öland.", altC:"Båda", descC:"Visa restauranger i både Småland och Öland.", urlA:"lugn.jpeg", urlB:"lugn.jpeg", urlC:"lugn.jpeg"}
=======
    {altA:"Fint", descA:"Bara fina restauranger.", altB:"Casual", descB:"Reasturanger med global inspererad mat", altC:"bakeri", descC:"BAKERI"},

    {altA:"Local", descA:"En bistro är en mindre restaurang eller ett kafé", altB:"A la carte", descB:"Vi vill sitta inne."},

    {altA:"Inomhus", descA:"Det ska vara inomhus", altB:"Utomhus", descB:" Det ska finnas utomhusservering"},

    {altA:"Vegitariansk meny", descA:"Det ska finnas vegitarianska alternativ", altB:"Spelar ingen roll", descB:"Du behöver ej det alternativet"}
>>>>>>> 8962863327544b8ddeba91ea3f397fae24924bd1
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
			progressElem[i].style.backgroundColor = "palevioletred";
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
	choiceElem[0].style.backgroundImage = "url(../bilder/lugn.jpg);" //"url('../bilder/"+ chosenThing[fr].urlA +"')";
	choiceElem[1].innerHTML = "<h3>" + chosenThing[fr].altB +"</h3>" + "<p>" + chosenThing[fr].descB +"</p>";

	if (chosenThing[fr].altC != undefined) { // Ifall alternativ C finns
		choiceElem[2].innerHTML = "<h3>" + chosenThing[fr].altC +"</h3>" + "<p>" + chosenThing[fr].descC +"</p>";
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