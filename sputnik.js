// init sputnik script
var sputnikInit = function(d, t, p) { 
    var j = d.createElement(t); j.async = true; j.type = "text/javascript"; 
    j.src = ("https:" == p ? "https:" : "http:") + "//stat.sputnik.ru/cnt.js"; 
   var s = d.getElementsByTagName(t)[0]; s.parentNode.insertBefore(j, s); 
 };

// returns last url segment of current page
var getCurrentPage = function() {
	return location.href.match(/([^\/]*)\/*$/)[1];
};

// scenario for main page with form
// on this page open-event should be passed to sputnik script
var mainPageScanario = function() {
	window.sputnikCounter = window.sputnikCounter || {};
	window.sputnikCounter.events = window.sputnikCounter.events || [];

	// id of button, which navigate to page with form
	var $button = $('#button_show_form');

	$button.on('click', function() {
		window.sputnikCounter.events.push({
			form: "open"
		});
		console.log("sputnik show form click");
	});
};

// returns dom-element by it tagname, identifier and title
var getTagFromIdentifierAndTitle = function(tagName, identifier, title) {
    var len = identifier.length;  
    var tags = document.getElementsByTagName(tagName);  

    for (var i=0; i < tags.length; i++) {  
        var tempString = tags[i].id;  
        if (tags[i].title == title && (identifier == "" || tempString.indexOf(identifier) == tempString.length - len)) {  
            return tags[i];  
        }  
    }  
    return null;  
};

// checking validation of form
var checkValidation = function() {
	
	// types and names of required fields of form
	var requiredFields = [
		["TEXTAREA", "Текст вопроса Обязательное поле"],
		["SELECT", "Кто вы? Обязательное поле"],
		["SELECT", "Тема вопроса Обязательное поле"],
		["INPUT", "Имя (псевдоним) Обязательное поле"],
		["INPUT", "Адрес электронной почты Обязательное поле"],
		["SELECT", "Категория Обязательное поле"]
	];

	var formIsValid = false;

	// checking each field one by one, should be not empty
	$.each(requiredFields, function(index, element) {
		var currentValue = getTagFromIdentifierAndTitle(element[0], '', element[1]);
		var $currentValue = $(currentValue);

		if(!$currentValue.val()) {
			console.log("Поле '" + element[1] + "' не может быть пустым");
			formIsValid = false;
			return false;
		} else {
			formIsValid = true;
		}
	});

	return formIsValid;
};

// form-page scanario
// this method called by sharepoint afted clicking submit-form
// button
function PreSaveAction() {
	if(getCurrentPage() != "ask.aspx")
		return true;

	var formIsValid = checkValidation();

	window.sputnikCounter = window.sputnikCounter || {};
	window.sputnikCounter.events = window.sputnikCounter.events || [];				

	// if form valid - sending success-event,
	// else - error-event
	if(formIsValid) {
		window.sputnikCounter.events.push({
			form: "success"
		});
		console.log("sputnik success action");
	} else {
		window.sputnikCounter.events.push({
			form: "error"
		});
		console.log("sputnik error action");
	}

	return true;
};


// main page loop
$(document).ready(function() {
	sputnikInit(document, "script", document.location.protocol);
	console.log("sputnik init");
	var currentPage = getCurrentPage();
	
	// running page script for each page-type
	switch(currentPage) {
		case "ask.aspx":
			console.log("formPageScenario");
			break;
		case "rector-online":
			console.log("mainPageScanario");
			mainPageScanario();
			break;
		default:
			break;
	}
});

