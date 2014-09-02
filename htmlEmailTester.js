(function(){
	'use strict';

// todo:
// BACKGROUND CENTERING

var db = document.body;
var bodyHeight = document.body.clientHeight;
var hasOpacity = localStorage.getItem('backgroundOpacity') ? localStorage.getItem('backgroundOpacity') : 0;

db.style.height = 200 + bodyHeight + "px";
db.style.backgroundImage = "url('bg.jpg')";
db.style.backgroundRepeat    = "no-repeat";

db.style.backgroundPositionX = localStorage.getItem('backgroundX') ? localStorage.getItem('backgroundX') : calcDefaultBgPos() + "px";//default to mid
db.style.backgroundPositionY = localStorage.getItem('backgroundY') ? localStorage.getItem('backgroundY') : "0px";
db.style.opacity = localStorage.getItem('backgroundOpacity') ? calcOpacityValue(localStorage.getItem('backgroundOpacity')) : 0;

/* HTML */
var html = "";
html += "<div id='hideContainer'>";
html += "<span>[<a id='toggleTester' href='#'>hide tester</a>]</span>";
html += "</div>";
html += "<div id='htmlTester'>";
html += "<h1>Html email tester</h1>";
html += "<input style='margin-left:0;' type='checkbox' id='isEemeliMail'></input><label for='isEemeliMail'>Eemeli mail</label><br />";
html += "<button id='resetBg'>Reset bg</button>";
html += "<br />";
html += "<button id='toggleBg'>Hide bg</button>";
html += "<br />";
html += "<button id='toggleHtml'>Hide html</button>";
html += "<br />";
html += "<button id='toggleBorders'>Show borders</button>";
html += "<br />";
html += "<button id='checkHtml'>Check html</button>";
html += "<br />";
html += "<label for='bodyOpacity'>Body opacity</input>";
html += "<input id='bodyOpacity' type='range' value='"+hasOpacity+"' min='0' max='50'></input>";
html += "<br />";
html += "<button id='resetBodyOpacity'>Reset opacity</input>";
html += "</div>";

var formDiv = document.createElement("div");
formDiv.setAttribute("id", "container");
formDiv.innerHTML = html;
db.insertBefore(formDiv, db.childNodes[0]);
/* END HTML */

/* CSS */
var css = "/* tester.js css */";
css += "#container {font-family: 'Comic Sans MS';color: hotpink;position: fixed;top: 20px;left: 20px;border: 1px solid #000;padding: 20px;background-color: #fff;}button {width: 100%;}";
css += "#errors {position: fixed;top: 20px;right: 20px;border: 1px solid #000;padding: 20px;background-color: #fff;overflow: scroll; height:1000px;}.et_activeLink a {color: purple !important;}";
css += ".et_activeDomElement {outline: 1px solid #f00;}h2.pass {font-family: 'Comic Sans MS';color: hotpink !important;font-size: 22px !important;}.error{color:#f00 !important;}";
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
/* END CSS */


document.onkeypress = function(event) {
	var bgPosY = parseInt(db.style.backgroundPositionY);
	var bgPosX = parseInt(db.style.backgroundPositionX);
	
	event = event || window.event;
	var charCode = (typeof event.which == "number") ? event.which : event.keyCode;

	if(charCode) {
		var keyPressed = String.fromCharCode(charCode).toLowerCase();
		var setPosY;
		var setPosX;

		switch(keyPressed) {
			case 'w':
			setPosY = --bgPosY + "px";
			db.style.backgroundPositionY = setPosY;
			localStorage.setItem('backgroundY', setPosY);
			break;

			case 's':
			setPosY = ++bgPosY + "px";
			db.style.backgroundPositionY = setPosY;
			localStorage.setItem('backgroundY', setPosY);
			break;

			case 'a':
			setPosX = --bgPosX + "px";
			db.style.backgroundPositionX = setPosX;
			localStorage.setItem('backgroundX', setPosX);
			break;

			case 'd':
			setPosX = ++bgPosX + "px";
			db.style.backgroundPositionX = setPosX;
			localStorage.setItem('backgroundX', setPosX);
			break;

			default:
			break;
		}
	}
}

var loc = window.location.href;

var isEemeliMail = document.getElementById("isEemeliMail");

if (localStorage.getItem('eemeli')) {
	if (localStorage.eemeli) {
		isEemeliMail.checked = true;
	} else {
		isEemeliMail.checked = false;
	}
}

var testerHidden = false;
var bgHidden = false;
var htmlHidden = false;
var bordersOn = false;

/* Event listeners */
isEemeliMail.addEventListener('click', function(){
	localStorage.setItem('eemeli', this.checked ? true : '');
},false);

document.getElementById("bodyOpacity").addEventListener('click', function(){
	document.body.style.opacity = calcOpacityValue(this.value);
	localStorage.setItem('backgroundOpacity', this.value);
}, false);

document.getElementById("resetBodyOpacity").addEventListener('click', function(){ 
	document.body.style.opacity = 1;
	document.getElementById("bodyOpacity").value = 0;
	localStorage.setItem('backgroundOpacity', 1);
}, false);

document.getElementById("toggleBg").addEventListener('click', function(){
	if (bgHidden) {
		db.style.backgroundImage = "url('bg.jpg')";
		bgHidden = false;
		this.innerText = "Hide bg";
	} else {
		db.style.backgroundImage = "";
		bgHidden = true;
		this.innerText = "Show bg";
	}
}, false);

document.getElementById("toggleTester").addEventListener('click', function(){
	if (testerHidden) {
		testerHidden = false;
		this.innerText = "hide tester";
		document.getElementById("htmlTester").style.display="block";
	} else {
		testerHidden = true;
		this.innerText = "show tester";
		document.getElementById("htmlTester").style.display="none";
	}
}, false);

document.getElementById("toggleHtml").addEventListener('click', function(){
	if(htmlHidden){
		htmlHidden = false;
		this.innerText = "Hide html";
		document.getElementsByTagName("table")[0].style.display = "table";
	} else {
		htmlHidden = true;
		this.innerText = "Show html";
		document.getElementsByTagName("table")[0].style.display = "none";
	}
},false);

document.getElementById("toggleBorders").addEventListener('click', function(){
	if (bordersOn) {
		bordersOn = false;
		this.innerText = "Show borders";
		setBorders(0);
	} else {
		bordersOn = true;
		this.innerText = "Hide borders";
		setBorders(1);
	}
}, false);

document.getElementById("checkHtml").addEventListener('click', function(){
	if (!htmlHidden) {
		checkHTML();
	} else {
		alert("Show html first");
	}
}, false);

document.getElementById("resetBg").addEventListener('click', function(){
	var defaultBgX = calcDefaultBgPos() + "px";
	db.style.backgroundPositionY = "0px";
	db.style.backgroundPositionX = defaultBgX;
	localStorage.setItem('backgroundY', "0px");
	localStorage.setItem('backgroundX', defaultBgX);
}, false);

/* End event listeners */

/* Functions */ 
function calcDefaultBgPos(){
	return 520;
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

	return "";
}

function getCurrentBg(){
	return db.style.backgroundImage.match(/url\(([^\)]+)/)[1];
}

function getDomElementFromEvent(ev){
	return document.getElementById("dom" + ev.target.id);
}

function attachErrorMsgListeners() {
	var errorTdLis = document.getElementById("errors").getElementsByTagName("li");
	var href;
	var errorTd;

	for (var i = 0; i < errorTdLis.length; i++) {
		errorTd = errorTdLis[i];

		errorTd.addEventListener("mouseover", function(event){
			try {
				getDomElementFromEvent(event).classList.add('et_activeDomElement');
				this.classList.add('et_activeLink');
				href = this;
			} catch (error) {}
		}, false);

		errorTd.addEventListener("mouseout", function(event){
			try {
				getDomElementFromEvent(event).classList.remove('et_activeDomElement');
				href.classList.remove('et_activeLink');
			} catch (error) {}
		}, false);
	};
}

function calcOpacityValue(val) {
	return "0." + (100 - val);
}


function checkHTML(){
	function getImgName(src){
		return src.substring(src.lastIndexOf("/")+1);
	}

	function getInnerText(el) {
		return el.innerText.length ? el.innerText : false;
	}

	function getTesterOffset() {
		var c = document.getElementById("container");
		return c.offsetHeight + c.offsetTop;
	}

	function getErrorLink(el) {
	// strip "dom" from element id
	// check innertext length so that tds
	// that only have the content "&nbsp;" dont get included
	var elLinkText = el.src ? getImgName(el.src) : el.innerText.length > 10 ? el.innerText : el; 
	return "<li><a id='" + el.id.substring(3) + "' style='color:#00f;' href='#'>" + elLinkText + "</a></li>";
}

function printMessageForm(message) {
	var formDiv = document.createElement("div");
	formDiv.setAttribute("id", "errors");
	formDiv.style.width = document.getElementById("container").offsetWidth + "px";
	formDiv.innerHTML = message;
	db.insertBefore(formDiv, db.childNodes[0]);
	attachErrorMsgListeners();
}

var table = document.getElementsByTagName("table")[0];
var tds   = table.getElementsByTagName("td");
var imgs  = table.getElementsByTagName("img");
var as    = table.getElementsByTagName("a");

var td  = "";
var img = "";
var a   = "";

var emptyAlts    	 = [];
var missingAlts  	 = [];
var heightTooLow 	 = [];
var missingSnoobi    = [];
var missingRedirect  = [];

var error = false;

var snoobiRegex = /.+\?(newsletter|ad)=.+/;
var ignoreLinkRegex = /.+\.(pdf|docx?|pptx?|xslx?)\??.*|#|mailto\:.+/;

	// check tds
	var hasHeight = false;

	for(var i=0;i<tds.length;i++){
		td = tds[i];
		hasHeight = td.hasAttribute("height");
		if((td.offsetHeight < 19 && !hasHeight)){
			td.setAttribute('id','domErrorTd_'+i);
			heightTooLow.push(td);
			error = true;
		} 
	}

	// check imgs
	for (var i = 0; i < imgs.length; i++) {
		img = imgs[i];
		if (!img.hasAttribute("alt") || img.getAttribute("alt") == "") {
			img.setAttribute('id', 'domErrorImg_'+i);
			missingAlts.push(img);
			error = true;
		} 
	}

	// check as
	for (var i = 0; i < as.length; i++) {
		if (ignoreLinkRegex.test(as[i])) 
			continue;

		if (!snoobiRegex.test(as[i])) {
			missingSnoobi.push(as[i]);
			error = true;
		}

		if (isEemeliMail.checked && !as[i].hasAttribute("redirect")) {
			as[i].setAttribute('id', 'domErrorRedirect_'+i);
			missingRedirect.push(as[i]);
			error = true;
		}
	}

	function addErrors(error_array, error_header) {
		var error_string = "";

		for (var i = 0; i < error_array.length; i++) {
			error_string += getErrorLink(error_array[i]);
		}

		return error_header + error_string + "</ul>";
	}

	if(error) {
		var errorMsg = "<h2 class='error'>Errors</h2>";
		errorMsg += missingSnoobi.length ? addErrors(missingSnoobi, "<h3>Found links with missing/broken snoobi tags</h3>") : "";
		errorMsg += heightTooLow.length ? addErrors(heightTooLow, "<h3>Found tds with too low height</h3>") : "";
		errorMsg += missingRedirect.length ? addErrors(missingRedirect, "<h3>Found hrefs with missing redirect-attribute (eemeli-mail)</h3>") : "";
		errorMsg += missingAlts.length ? addErrors(missingAlts, "<h3>Found imgs with missing or empty alt-attribute</h3>") : "";

		printMessageForm(errorMsg);
	} else { 
		printMessageForm("<h2 class='pass'>Html passed! :-)</h2>");
	}
}

}());
