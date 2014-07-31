(function(){

// todo:
// DONT ADD ERRORS/WARNINGS TO ARRAYS JUST BUILD STRING AT ONCE
// check for missing td valign && align attributes
// check for missing target attributes on a-tags (?)
// check for single line cells with line-height differing from font-size

// wip:
// check for phone numbers without style='text-decoration:none;' (broken)

var db = document.body;
var defBg = 'bg.jpg';
var bgVal = getBgVal(defBg);

db.style.backgroundImage     = bgVal;
db.style.backgroundRepeat    = "no-repeat";
db.style.backgroundPositionX = "50%";
db.style.backgroundPositionY = "0px";

var html = "";
html += "<h1>Html email tester</h1>";
html += "<label for='url'>Bg url:</label><br />";
html += "<input style='background-color:#0f0;' type='text' name='url' id='url' value='bg.jpg'></input><br />";
html += "<button id='up'>&#8593;</button>";
html += "<button id='down'>&#8595;</button>";
html += "<br />";
html += "<button id='reset'>Reset bg</button>";
html += "<br />";
html += "<button id='hide'>Hide bg</button>";
html += "<br />";
html += "<button id='check'>Check html</button>";
html += "<h2>Legend <span style='font-size:50%;'>(These cells will break in Outlook)</span></h2>";
html += "<p style='background-color:#f00;border:1px solid #000;'>Cell is too low in height</p>";
html += "<p style='background-color:#FFFF00;border:1px solid #000;'>Cell is on single line with line-height differing from font-size</p>";
html += "<p style='background-color:#00f;border:1px solid #000;color:#fff'>Cell is missing valign or align-attribute</p>";

var formDiv = document.createElement("div");
var css = {
	position: 'fixed',
	top: '20px',
	left: '20px'
};

for(var rule in css)
	formDiv.style[rule] = css[rule];

formDiv.innerHTML = html;

db.insertBefore(formDiv, db.childNodes[0]);

var upBtn    = document.getElementById("up");
var downBtn  = document.getElementById("down");
var hideBtn  = document.getElementById("hide");
var checkBtn = document.getElementById("check");
var resetBtn = document.getElementById("reset");
var urlBox   = document.getElementById("url");

var bgHidden = false;
var bgPos = parseInt(db.style.backgroundPositionY);
var checkBtnWidth = checkBtn.offsetWidth;

hideBtn.style.width = checkBtnWidth + "px";
resetBtn.style.width = checkBtnWidth + "px";

hideBtn.addEventListener('click', function(){
	if (bgHidden) {
		db.style.backgroundImage = bgVal;
		bgHidden = false;
		hideBtn.innerText = "Hide bg";
	} else {
		db.style.backgroundImage = "";
		bgHidden = true;
		hideBtn.innerText = "Show bg";
	}
}, false);

upBtn.addEventListener('click', function(){
	db.style.backgroundPositionY = --bgPos + "px";
}, false);

downBtn.addEventListener('click', function(){
	db.style.backgroundPositionY = ++bgPos + "px";
}, false);

checkBtn.addEventListener('click', function(){
	checkHTML();
}, false);

resetBtn.addEventListener('click', function(){
	db.style.backgroundPositionY = "0px";
}, false);

urlBox.addEventListener('change', function(){
	testImage(urlBox.value);
}, false);

// helper functions
function testImage(URL) {
	var tester=new Image();
	tester.onload=imageFound;
	tester.onerror=imageNotFound;
	tester.src=URL;
	console.log(URL);
}

function imageFound() {
	db.style.backgroundImage = getBgVal(urlBox.value);
	urlBox.style.backgroundColor = "#0f0";
	alert(getImgMsg() + " loaded as background");
}

function imageNotFound() {
	db.style.backgroundImage = "";
	urlBox.style.backgroundColor = "#f00";
	alert(getImgMsg() + " cannot be found");
}

function getImgMsg(){
	return "Image with src: '" + urlBox.value;
}

function getBgVal(bgUrl){
	return "url('"+bgUrl+"')";
}

function checkHTML(){
	var tds  = document.getElementsByTagName("td");
	var imgs = document.getElementsByTagName("img");
	var as   = document.getElementsByTagName("a");

	var td  = "";
	var img = "";
	var a   = "";

	var emptyAlts     = [];
	var missingAlts   = [];
	var heightTooLow  = [];
	var missingSnoobi = [];
	var unstyledPhonenumbers = [];

	var errors = false;
	var warnings = false;

	var snoobiRegex = /.+\?(newsletter|ad)=.+/;
	var ignoreRegex = /.+\.(pdf|docx?|pptx?|xslx?)\??.*/;
	var phoneRegex = /(\+|0[45]0{0,2}).+/;
	var phoneRegexMatched = false;

	function setError(){
		if (!errors) 
			errors = true;
	}

	function setWarning(){
		if(!warnings)
			warnings = true;
	}

	function getImgName(img){
		return img.src.substring(img.src.lastIndexOf("/")+1);
	}

	function getInnerText(el) {
		return el.innerText;
	}

	// check tds
	for(var i=0;i<tds.length;i++){
		td = tds[i];
		if(td.offsetHeight<19 && !td.hasAttribute("height")){
			td.style.border = "1px solid #000";
			td.style.backgroundColor="#f00";
			heightTooLow.push(td);
			setError();
		}

		phoneRegexMatched = td.innerText.match(phoneRegex);

		// todo fix this, currently matching the td containing other tds
		// and not a single td with a phone number
		if (phoneRegexMatched && unstyledPhonenumbers.indexOf(phoneRegexMatched[0]) == -1 /*&& !td.hasAttribute("style")*/) {
			console.log(td);
			unstyledPhonenumbers.push(phoneRegexMatched[0]);
			setWarning();
		}
	}

	// check imgs
	for (var i = 0; i < imgs.length; i++) {
		img = imgs[i];
		if (!img.hasAttribute("alt")) {
			missingAlts.push(img);
			setError();
		} else { 
			if(img.getAttribute("alt") == "") {
				emptyAlts.push(img);
				setWarning();
			}
		}
	}

	// check as
	var as = document.getElementsByTagName("a");
	for (var i = 0; i < as.length; i++) {
		href = as[i].href;
		if (ignoreRegex.test(href)) 
			continue;

		if (!snoobiRegex.test(href)) {
			missingSnoobi.push(href);
			setError();
		}

	}

	if(!errors && !warnings) {
		alert("HTML passed");
	} else { // print errors & warnings
		if(errors) {
			var missingAltsString = "";
			var heightTooLowString = "";
			var missingSnoobiString = "";

			var errorMsg = "ERRORS\n---------\n"; 

			for (var i = 0; i < missingAlts.length; i++) {
				missingAltsString += getImgName(missingAlts[i]) + "\n";
			}
			for (var i = 0; i < heightTooLow.length; i++) {
				heightTooLowString += getInnerText(heightTooLow[i]) + "\n";
			}
			for (var i = 0; i < missingSnoobi.length; i++) {
				missingSnoobiString += missingSnoobi[i] + "\n";
			};

			if(heightTooLowString) {
				errorMsg += "Found elements with too low height:\n" + heightTooLowString;
			}

			if (missingAltsString) {
				if (errorMsg.length > errorMsg.length) 
					errorMsg += "\n";

				errorMsg += "Found missing alt attributes for images:\n" + missingAltsString;
			}
			if (missingSnoobiString) {
				if (errorMsg.length > errorMsg.length) 
					errorMsg += "\n";

				errorMsg += "Found links with missing/broken snoobi tags:\n" + missingSnoobiString;
			}

			alert(errorMsg);
		}
		if(warnings) {
			var emptyAltsString = "";
			var unstyledPhonenumbersString = "";
			var warningMsg = "WARNINGS\n------------\n";

			for (var i = 0; i < emptyAlts.length; i++) {
				emptyAltsString += getImgName(emptyAlts[i]) + "\n";
			}

			for (var i = 0; i < unstyledPhonenumbers.length; i++) {
				unstyledPhonenumbersString += unstyledPhonenumbers[i] + "\n";
			}

			if (emptyAltsString) {
				warningMsg += "Found empty alt text (alt=\"\") for images:\n" + emptyAltsString;
			}

			if (unstyledPhonenumbersString) {
				warningMsg += "Found unstyledPhonenumbers:\n" + unstyledPhonenumbersString;
			}

			alert(warningMsg);
		}
	}
}

}());