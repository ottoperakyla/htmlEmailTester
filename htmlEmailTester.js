(function(){
	'use strict';

// todo:
// BACKGROUND CENTERING

var defBg = 'bg.jpg';
var db = document.body;
var defOutline = "1px solid #000";
var bgVal = getBgUrl(defBg);
var bodyHeight = document.body.clientHeight;

db.style.backgroundImage = bgVal;
db.style.height = 200 + bodyHeight + "px";
db.style.backgroundRepeat    = "no-repeat";

db.style.backgroundPositionX = localStorage.getItem('backgroundX') ? localStorage.getItem('backgroundX') : calcDefaultBgPos() + "px";//default to mid
db.style.backgroundPositionY = localStorage.getItem('backgroundY') ? localStorage.getItem('backgroundY') : "0px";

/* HTML */
var html = "";
html += "<div id='hideContainer'>";
html += "<span>[<a id='toggleTester' href='#'>hide tester</a>]</span>";
html += "</div>";
html += "<div id='htmlTester'>";
html += "<h1>Html email tester</h1>";
html += "<input style='margin-left:0;' type='checkbox' id='isEemeliMail'></input><label for='isEemeliMail'>Eemeli mail</label><br />";
html += "<button style='width:100%' id='resetBg'>Reset bg</button>";
html += "<br />";
html += "<button style='width:100%' id='toggleBg'>Hide bg</button>";
html += "<br />";
html += "<button style='width:100%' id='toggleHtml'>Hide html</button>";
html += "<br />";
html += "<button style='width:100%' id='toggleBorders'>Show borders</button>";
html += "<br />";
html += "<button style='width:100%' id='checkHtml'>Check html</button>";
html += "</div>";

var formDiv = document.createElement("div");
var css = {
	fontFamily: 'Comic Sans MS',
	color: 'hotpink',
	position: 'fixed',
	top: '20px',
	left: '20px',
	border: '1px solid #000',
	padding: '20px',
	backgroundColor: "#fff"
};

setStyles(formDiv, css);

formDiv.setAttribute("id", "container");
formDiv.innerHTML = html;

db.insertBefore(formDiv, db.childNodes[0]);
/* END HTML */

var bgPosY = parseInt(db.style.backgroundPositionY);
var bgPosX = parseInt(db.style.backgroundPositionX);

document.onkeypress = function(event) {
	event = event || window.event;
	var charCode = (typeof event.which == "number") ? event.which : event.keyCode;

	if(charCode) {
		if(charCode == 13) { // enter pressed, save position
			localStorage.setItem('backgroundX', db.style.backgroundPositionX);
			localStorage.setItem('backgroundY', db.style.backgroundPositionY);
			alert("Bg position saved");
		} else {
			var keyPressed = String.fromCharCode(charCode).toLowerCase();
			switch(keyPressed) {
				case 'w':
				db.style.backgroundPositionY = --bgPosY + "px";
				break;

				case 's':
				db.style.backgroundPositionY = ++bgPosY + "px";
				break;

				case 'a':
				db.style.backgroundPositionX = --bgPosX + "px";
				break;

				case 'd':
				db.style.backgroundPositionX = ++bgPosX + "px";
				break;

				default:
				break;
			}
		}
	}
};

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

document.getElementById("toggleBg").addEventListener('click', function(){
	if (bgHidden) {
		db.style.backgroundImage = bgVal;
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
	checkHTML();
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

function setStyles(el, css){
	for(var rule in css)
		el.style[rule] = css[rule];
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

function getBgUrl(bgUrl){
	return "url('"+bgUrl+"')";
}

function attachErrorMsgListeners() {
	var errorTdLis = document.getElementById("errors").getElementsByTagName("li");

	for (var i = 0; i < errorTdLis.length; i++) {
		errorTdLis[i].addEventListener("mouseover", function(event){
			var css = {
				outline: "1px solid #f00"
			};
			var domElement = document.getElementById("dom"+event.target.id);
			var orgHeight = domElement.offsetHeight;
			setStyles(domElement,css);
			
		}, false);
		errorTdLis[i].addEventListener("mouseout", function(event){
			setTimeout(function(){
				document.getElementById("dom"+event.target.id).style.outline="none";
			}, 500);
		})
	};

}


function checkHTML(){
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

	function getTesterOffset() {
		var c = document.getElementById("container");
		return c.offsetHeight + c.offsetTop;
	}

	function getErrorLink(el) {
		// strip "dom" from element id
		return "<li><a id='" + el.id.substring(3) + "' style='color:#00f;' href='#'>" + el + "</a></li>";
	}

	function printMessageForm(message) {
		var formDiv = document.createElement("div");
		var css = {
			position: 'fixed',
			top: "20px",
			width: document.getElementById("container").offsetWidth + "px",
			right: '20px',
			border: '1px solid #000',
			padding: '20px',
			backgroundColor: "#fff",
			overflow: "auto"
		};

		setStyles(formDiv, css);

		formDiv.setAttribute("id", "errors");

		formDiv.innerHTML = message;
		db.insertBefore(formDiv, db.childNodes[0]);
		attachErrorMsgListeners();
	}

	// check tds
	var hasHeight = false;

	for(var i=0;i<tds.length;i++){
		td = tds[i];
		hasHeight = td.hasAttribute("height");
		if((td.offsetHeight < 19 && !hasHeight)){
			//td.style.outline = "1px solid #f00"; // using outline because it doesnt increase element height/width
			//td.style.backgroundColor="#f00";
			td.setAttribute('id','domErrorTd_'+i);
			console.log(td);
			heightTooLow.push(td);
			setError();
		} 

		if (!td.hasAttribute("valign") || !td.hasAttribute("valign")) {
			//td.style.outline = defOutline;
	//		td.style.backgroundColor = "#00f";
	setError();
}
}

	// check imgs
	for (var i = 0; i < imgs.length; i++) {
		img = imgs[i];
		if (!img.hasAttribute("alt") || img.getAttribute("alt") == "") {
	//		img.style.outline = "1px solid hotpink";
	setError();
} 
}

	// check as
	for (var i = 0; i < as.length; i++) {
		if (ignoreLinkRegex.test(as[i])) 
			continue;

		if (!snoobiRegex.test(as[i])) {
			missingSnoobi.push(as[i]);
			setError();
		}

		if (isEemeliMail.checked && !as[i].hasAttribute("redirect")) {
			as[i].setAttribute('id', 'domErrorRedirect_'+i);
			missingRedirect.push(as[i]);
			setError();
		}
	}

	if(errors) {
		var missingSnoobiString = "<ul id='snoobiErrors'>";
		var heightTooLowString = "<ul id='heightTooLowErrors'>";
		var missingRedirectString = "<ul id='missingRedirectErrors'>";
		var errorMsg = "<h2 style='color:#f00 !important;'>Errors</h2>";

		for (var i = 0; i < missingSnoobi.length; i++) {
			missingSnoobiString += "<li>" + missingSnoobi[i] + "</li>";
		}
		missingSnoobiString += "</ul>";

		for (var i = 0; i < heightTooLow.length; i++) {
			heightTooLowString += getErrorLink(heightTooLow[i]);
		}
		heightTooLowString += "</ul>";

		for (var i = 0; i < missingRedirect.length; i++) {
			missingRedirectString +=  getErrorLink(missingRedirect[i]);
		}
		missingRedirectString += "</ul>";

		if (missingSnoobiString) {
			errorMsg += "<h3>Found links with missing/broken snoobi tags</h3>" + missingSnoobiString;
		}

		if (heightTooLowString) {
			errorMsg += "<h3>Found tds with too low height</h3>" + heightTooLowString;
		}

		if (missingRedirect.length && missingRedirectString) {
			errorMsg += "<h3>Found hrefs with missing redirect-attribute (eemeli-mail)</h3>" + missingRedirectString;
		}

		printMessageForm(errorMsg);
	} else if(!errors) { 
		var html = "";
		html += "<h2 style='font-family:Comic Sans MS;color:hotpink !important;'>Html passed ;-)</h2>";
		html += "<img style='margin:20px 0;' src='http://i.imgur.com/igEwpy7.jpg' />";
		html += "<iframe width='320' height='315' src='//www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1' frameborder='0' allowfullscreen></iframe>";
		printMessageForm(html);
	}
}

}());
