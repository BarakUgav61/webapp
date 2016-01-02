window.onload = function () {
	// Default '#quick-reports' tab
	if (document.location.hash == "" || document.location.hash == "#") {
	    document.location.hash = "#quick-reports";
	}

	// Load 
	var quickReports = document.getElementById("quick-reports");
	var urlsFrom = quickReports.getElementsByClassName("urls-from")[0];
	loadUrlsFrom("quick-reports", urlsFrom);
};


function loadUrlsFrom(tag, form) {
	var sites = readLocalStorage(tag);
	if (sites === undefined) {
		return;
	} else if (!(sites.length > 0)) {
		return;
	}

	var subForms = form.getElementsByClassName("url-form");
	for (var i = 0; i < subForms.length && i < sites.length; i++) {
		var subForm = subForms[i];
		var site = sites[i];

		var nameBox = subForm.getElementsByClassName("name")[0];
		var urlBox = subForm.getElementsByClassName("url")[0];

		nameBox.setAttribute("value", site.name);
		urlBox.setAttribute("value", site.url);
	}
}

function submitUrlsFrom(tag, form) {
	// Validate
	var subForms = form.getElementsByClassName("url-form");
	var allValid = true;
	var sites = [];
	for (var i = 0; i < subForms.length; i++) {
		var subForm = subForms[i];
		var nameBox = subForm.getElementsByClassName("name")[0];
		var urlBox = subForm.getElementsByClassName("url")[0];
		var name = nameBox.value;
		var url = urlBox.value;

		resetInputBorder(nameBox);
		resetInputBorder(urlBox);
		if (name === "" && url === "") {
			continue;
		}

		if (isValidName(name) !== true) {
			nameBox.style.border = "solid 1px red";
			allValid = false;
		}

		if (isValidUrl(url) !== true) {
			urlBox.style.border = "solid 1px red";
			allValid = false;
		}

		// Add site to sites array
		var site = {};
		site.name = name;
		site.url = url;
		sites.push(site);
	}

	if (allValid !== true) {
		return false;
	} else {
		// valid
		writeLocalStorage(tag, sites);
	}

}

function validateUrlsForm(form) {
	var subForms = form.getElementsByClassName("url-form");

	var allValid = true;
	for (var subFormIndex in subForms) {
		var subForm = subForms[subFormIndex];
		var nameBox = subForm.getElementsByClassName("name")[0];
		var urlBox = subForm.getElementsByClassName("url")[0];
		var name = nameBox.value;
		var url = urlBox.value;

		resetInputBorder(nameBox);
		resetInputBorder(urlBox);
		if (name === "" && url === "") {
			continue;
		}

		if (isValidName(name) !== true) {
			nameBox.style.border = "solid 1px red";
			allValid = false;
		}

		if (isValidUrl(url) !== true) {
			urlBox.style.border = "solid 1px red";
			allValid = false;
		}
	}
	
	return allValid;
}

function isValidName(name) {
	return name !== "";
}

function isValidUrl(url) {
	return url !== "";
}

function resetInputBorder(inputElement) {
	inputElement.style.border = "2px inset";
}

function writeLocalStorage(tag, sites) {
	clearLocalStorage(tag);

	localStorage.setItem(tag + " count", sites.length);
	for (var i = 0; i < sites.length; i++) {
		var site = sites[i];
		var name = site.name;
		var url = site.url;

		localStorage.setItem(tag + " " + i + " name", name);
		localStorage.setItem(tag + " " + i + " url", url);
	}
}

function readLocalStorage(tag) {
	var countStr = localStorage.getItem(tag + " count");
	if (countStr === undefined) {
		return undefined;
	}
	var count = parseInt(countStr);

	var sites = [];
	for (var i = 0; i < count; i++) {
		var name = localStorage.getItem(tag + " " + i + " name");
		var url = localStorage.getItem(tag + " " + i + " url");

		var site = {};
		site.name = name;
		site.url = url;
		sites.push(site);
	}
	return sites;
}

function clearLocalStorage(tag) {
	var countStr = localStorage.getItem(tag + " count");
	if (countStr === null) {
		return;
	}
	var count = parseInt(countStr);
	for (var i = 0; i < count; i++) {
		localStorage.removeItem(tag + " " + i + " name");
		localStorage.removeItem(tag + " " + i + " url");
	}
	localStorage.removeItem(tag + " count");
}
