(function(){

// todo:
// BACKGROUND CENTERING
// check for single line cells with line-height differing from font-size

var db = document.body;
var defBg = 'bg.jpg';
var defOutline = "1px solid #000";
var bgVal = getBgUrl(defBg);

db.style.backgroundImage = bgVal;
db.style.backgroundRepeat    = "no-repeat";
db.style.backgroundPositionX = "505px";//...
db.style.backgroundPositionY = "0px";

/*
need to init image with current document background and get its width
then set backgroundPositionX to (document.clientWidth-backgroundImage.width)/2 (IN PIXELS!)
var imgg = new Image();
imgg.src = getCurrentBg();	
console.log(getCurrentBg());
cant get image/image size like this for some reason (not loaded yet??)
console.log(imgg);
*/

var html = "";
html += "<div id='hideContainer'>";
html += "<span>[<a id='hideTester' href='#'>hide tester</a>]</span>";
html += "</div>";
html += "<div id='htmlTester'>";
html += "<h1>Html email tester</h1>";
html += "<label for='url'>Bg url:</label><br />";
html += "<input style='background-color:#0f0;' type='text' name='url' id='url' value='bg.jpg'></input><br />";
html += "<button id='up'>&#8593;</button>";
html += "<button id='down'>&#8595;</button>"; 
html += "<br />";
html += "<button id='left'>&#8592;</button>"; 
html += "<button id='right'>&#8594;</button>"; 
html += "<br />";
html += "<button id='reset'>Reset bg</button>";
html += "<br />";
html += "<button id='hide'>Hide bg</button>";
html += "<br />";
html += "<button id='html'>Hide html</button>";
html += "<br />";
html += "<button id='borders'>Show borders</button>";
html += "<br />";
html += "<button id='check'>Check html</button>";
html += "<h3>These cells will break in Outlook</span></h3>";
html += "<p style='background-color:#f00;border:1px solid #000;'>Cell is too low in height</p>";
html += "<h3>These cells could cause problems in Outlook</span></h3>";
html += "<p style='background-color:#00f;border:1px solid #000;color:#fff'>Cell is missing valign or align-attribute</p>";
html += "<h3>Unsemantic markup</span></h3>";
html += "<p style='background-color:hotpink;border:1px solid #000;color:#fff'>Image is missing alt attribute or has empty alt text (alt=\"\")</p>";
html += "</div>"

var formDiv = document.createElement("div");
var css = {
	position: 'fixed',
	top: '20px',
	left: '20px',
	border: '1px solid #000',
	padding: '20px',
	backgroundColor: "#fff"
};

for(var rule in css)
	formDiv.style[rule] = css[rule];

formDiv.setAttribute("id", "container");
formDiv.innerHTML = html;

db.insertBefore(formDiv, db.childNodes[0]);

var upBtn    = document.getElementById("up");
var downBtn  = document.getElementById("down");
var leftBtn  = document.getElementById("left");
var rightBtn  = document.getElementById("right");
var hideBtn  = document.getElementById("hide");
var checkBtn = document.getElementById("check");
var resetBtn = document.getElementById("reset");
var urlBox   = document.getElementById("url");
var hideTesterBtn = document.getElementById("hideTester");
var borderBtn = document.getElementById("borders");
var htmlBtn = document.getElementById("html");

var testerHidden = false;
var bgHidden = false;
var htmlHidden = false;
var bordersOn = false;

var bgPosY = parseInt(db.style.backgroundPositionY);
var bgPosX = parseInt(db.style.backgroundPositionX);
var borderBtnWidth = borderBtn.offsetWidth;
var allBtns = document.getElementsByTagName("button");
var widestBtnLen = allBtns[0].clientWidth;

for (var i = 1; i < allBtns.length; i++) {
	if (allBtns[i].clientWidth > widestBtnLen) {
		widestBtnLen = allBtns[i].clientWidth;
	} 
}

for (var i = 0; i < allBtns.length; i++) {
	console.log("setting", allBtns[i], "to", widestBtnLen + "px");
	allBtns[i].style.width = widestBtnLen + "px";
}

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

hideTesterBtn.addEventListener('click', function(){
	if (testerHidden) {
		testerHidden = false;
		hideTesterBtn.innerText = "hide tester";
		document.getElementById("htmlTester").style.display="block";
	} else {
		testerHidden = true;
		hideTesterBtn.innerText = "show tester";
		document.getElementById("htmlTester").style.display="none";
	}
}, false);

htmlBtn.addEventListener('click', function(){
	if(htmlHidden){
		htmlHidden = false;
		htmlBtn.innerText = "Hide html";
		document.getElementsByTagName("table")[0].style.display = "table";
	} else {
		htmlHidden = true;
		htmlBtn.innerText = "Show html";
		document.getElementsByTagName("table")[0].style.display = "none";
	}
},false);

borderBtn.addEventListener('click', function(){
	if (bordersOn) {
		bordersOn = false;
		borderBtn.innerText = "Show borders";
		setBorders(0);
	} else {
		bordersOn = true;
		borderBtn.innerText = "Hide borders";
		setBorders(1);
	}
}, false);

upBtn.addEventListener('click', function(){
	db.style.backgroundPositionY = --bgPosY + "px";
}, false);

downBtn.addEventListener('click', function(){
	db.style.backgroundPositionY = ++bgPosY + "px";
}, false);

leftBtn.addEventListener('click', function(){
	db.style.backgroundPositionX = --bgPosX + "px";
}, false);

rightBtn.addEventListener('click', function(){
	db.style.backgroundPositionX = ++bgPosX + "px";
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
	db.style.backgroundImage = getBgUrl(urlBox.value);
	urlBox.style.backgroundColor = "#0f0";
	alert(getImgMsg() + " loaded as background");
}

function imageNotFound() {
	db.style.backgroundImage = "";
	urlBox.style.backgroundColor = "#f00";
	alert(getImgMsg() + " cannot be found");
}

function setBorders(bool){
	var tbl = document.getElementsByTagName("table")[0];
	var subTbls = tbl.getElementsByTagName("table");
	var subTblTds;

	tbl.style.outline = getOutline(bool);
	var tblTds = tbl.getElementsByTagName("td");

	for (var i = 0; i < tblTds.length; i++) {
		tblTds[i].style.outline = getOutline(bool);
	}


	for (var i = 0; i < subTbls.length; i++) {
		subTbls[i].style.outline = getOutline(bool);

		subTblTds = subTbls[i].getElementsByTagName("td");
		for (var i = 0; i < subTblTds.length; i++) {
			subTblTds[i].style.outline = getOutline(bool);
		}
	}
}

function getOutline(bool){
	if (bool){
		return bool + "px solid #000";
	}

	return "none";
}

function getCurrentBg(){
	return db.style.backgroundImage.match(/url\(([^\)]+)/)[1];;
}

function getImgMsg(){
	return "Image with src: '" + urlBox.value;
}

function getBgUrl(bgUrl){
	return "url('"+bgUrl+"')";
}

function checkHTML(){
	var table = document.getElementsByTagName("table")[0];
	var tds   = table.getElementsByTagName("td");
	var imgs  = table.getElementsByTagName("img");
	var as    = table.getElementsByTagName("a");

	var td  = "";
	var img = "";
	var a   = "";

	var emptyAlts     = [];
	var missingAlts   = [];
	var heightTooLow  = [];
	var missingSnoobi = [];

	var errors = false;
	var warnings = false;

	var snoobiRegex = /.+\?(newsletter|ad)=.+/;
	var ignoreLinkRegex = /.+\.(pdf|docx?|pptx?|xslx?)\??.*|#/;

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
		return el.innerText.length ? el.innerText : false;
	}

	// check tds
	var hasHeight = false;
	for(var i=0;i<tds.length;i++){
		td = tds[i];
		hasHeight = td.hasAttribute("height");
		if((td.offsetHeight < 19 && !hasHeight)){
			td.style.outline = defOutline; // using outline because it doesnt increase element height/width
			td.style.backgroundColor="#f00";
			setError();
		} 

		if (!td.hasAttribute("valign") || !td.hasAttribute("valign")) {
			td.style.outline = defOutline;
			td.style.backgroundColor = "#00f";
			setError();
		}
	}

	// check imgs
	for (var i = 0; i < imgs.length; i++) {
		img = imgs[i];
		if (!img.hasAttribute("alt") || img.getAttribute("alt") == "") {
			img.style.outline = "1px solid hotpink";
			setError();
		} 
	}

	// check as
	for (var i = 0; i < as.length; i++) {
		href = as[i].href;
		if (ignoreLinkRegex.test(href)) 
			continue;

		if (!snoobiRegex.test(href)) {
			missingSnoobi.push(href);
			setError();
		}

	}

	if(missingSnoobi.length) {
		var missingSnoobiString = "";
		var errorMsg = "";

		for (var i = 0; i < missingSnoobi.length; i++) {
			missingSnoobiString += missingSnoobi[i] + "\n";
		}

		if (missingSnoobiString) {
			errorMsg += "Found links with missing/broken snoobi tags:\n" + missingSnoobiString;
		}

		alert(errorMsg);
	} else if(!errors) { 
		alert("HTML passed! ;-)");
	}
}

}());
