window.onload = function () {
	// Default '#quick-reports' tab
	if (document.location.hash == "" || document.location.hash == "#") {
	    document.location.hash = "#quick-reports";
	}
	reloadAll();
};

function reloadAll() {
	reloadForms();
	reloadToolBars();
	reloadSelectedTab();
}

function reloadForms() {
	var quickReports = document.getElementById("quick-reports");
	var urlsFrom = quickReports.getElementsByClassName("urls-from")[0];
	loadUrlsFrom("quick-reports", urlsFrom);

	var teamFolders = document.getElementById("my-team-folders");
	urlsFrom = teamFolders.getElementsByClassName("urls-from")[0];
	loadUrlsFrom("my-team-folders", urlsFrom);
}

function reloadToolBars() {
	reloadComboboxes();
	siteChange();
	reloadGoto();
}

function reloadComboboxes() {
	var quickReports = document.getElementById("quick-reports");
	var combobox = quickReports.getElementsByTagName("select")[0];
	loadCombobox("quick-reports", combobox);

	var teamFolders = document.getElementById("my-team-folders");
	combobox = teamFolders.getElementsByTagName("select")[0];
	loadCombobox("my-team-folders", combobox);
}

function siteChange() {
	var quickReports = document.getElementById("quick-reports");
	var combobox = quickReports.getElementsByTagName("select")[0];
	var iframe = quickReports.getElementsByTagName("iframe")[0];

	var selectedIndex = combobox.selectedIndex;
	if (selectedIndex !== -1) {
		var url = combobox.options[selectedIndex].value;
		iframe.setAttribute("src", url);
		iframe.style.display ="block";
	} else {
		iframe.setAttribute("src", "");
		iframe.style.display = "none";
	}

	var teamFolders = document.getElementById("my-team-folders");
	combobox = teamFolders.getElementsByTagName("select")[0];
	iframe = teamFolders.getElementsByTagName("iframe")[0];

	var selectedIndex = combobox.selectedIndex;
	if (selectedIndex !== -1) {
		var url = combobox.options[selectedIndex].value;
		iframe.setAttribute("src", url);
		iframe.style.display ="block";
	} else {
		iframe.setAttribute("src", "");
		iframe.style.display = "none";
	}

	
}

function reloadGoto() {
	var quickReports = document.getElementById("quick-reports");
	var goToLink = quickReports.getElementsByClassName("goToLink")[0];
	var combobox = quickReports.getElementsByTagName("select")[0];

	var selectedIndex = combobox.selectedIndex;
	if (selectedIndex !== -1) {
		var url = combobox.options[selectedIndex].value;
		goToLink.setAttribute("href", url);
		goToLink.style.display ="inline-block";
	} else {
		goToLink.setAttribute("href", "");
		goToLink.style.display = "none";
	}

	var teamFolders = document.getElementById("my-team-folders");
	goToLink = teamFolders.getElementsByClassName("goToLink")[0];
	combobox = teamFolders.getElementsByTagName("select")[0];

	selectedIndex = combobox.selectedIndex;
	if (selectedIndex !== -1) {
		var url = combobox.options[selectedIndex].value;
		goToLink.setAttribute("href", url);
		goToLink.style.display ="inline-block";
	} else {
		goToLink.setAttribute("href", "");
		goToLink.style.display = "none";
	}
}

function loadCombobox(tag, combobox) {
	// Clear existing options
	for (var i = combobox.options.length; i >= 0; i--) {
		combobox.remove(i);
	}
	combobox.style.display = "none";

	// Read from local storage
	var sites = readLocalStorage(tag);
	if (sites === undefined) {
		return;
	} else if (!(sites.length > 0)) {
		return;
	}

	// Length > 0
	combobox.style.display = "inline-block";
	for (var i = 0; i < sites.length; i++) {
		var site = sites[i];
		var option = document.createElement("option");
		option.text = site.name;
		option.value = site.url;
		combobox.add(option);
	}
}

function loadUrlsFrom(tag, form) {
	var subForms = form.getElementsByClassName("url-form");

	// Clear existing text
	for (var i = 0; i < subForms.length; i++) {
		var subForm = subForms[i];
		var nameBox = subForm.getElementsByClassName("name")[0];
		var urlBox = subForm.getElementsByClassName("url")[0];
		nameBox.setAttribute("value", "");
		urlBox.setAttribute("value", "");
	}

	// Read from local storage
	var sites = readLocalStorage(tag);
	if (sites === undefined) {
		return;
	} else if (!(sites.length > 0)) {
		return;
	}
	
	// Put new data in form
	for (var i = 0; i < subForms.length && i < sites.length; i++) {
		var site = sites[i];
		var subForm = subForms[i];

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
		reloadAll();
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

function quickReportsSetting() {
	var quickReports = document.getElementById("quick-reports");
	var urlsFrom = quickReports.getElementsByClassName("urls-from")[0];
	if (urlsFrom.style.display === "none") {
		urlsFrom.style.display = "inline-block";
	} else {
		urlsFrom.style.display = "none";
	}
}

function teamFoldersSetting() {
	var quickReports = document.getElementById("my-team-folders");
	var urlsFrom = quickReports.getElementsByClassName("urls-from")[0];
	if (urlsFrom.style.display === "none") {
		urlsFrom.style.display = "inline-block";
	} else {
		urlsFrom.style.display = "none";
	}
}

function tabSelect(e) {
	// TODO
	// Prevent jump
	e.preventDefault();
	var selectedTab = e.currentTarget;
	document.location.hash = selectedTab.hash;

	reloadSelectedTab();
}

function reloadSelectedTab() {
	var currentHash = document.location.hash;
	var tabs = document.getElementsByClassName("tabs")[0];
    var tabsSelectorsList = tabs.getElementsByTagName("ul")[0];
    var allTabs = tabsSelectorsList.getElementsByTagName("a");

    for (var i = 0; i < allTabs.length; i++) {
    	var tab = allTabs[i];
    	if (tab.hash === currentHash) {
    		tab.style.backgroundColor = "#EBEBEB";
    		tab.style.color = "black";
    	} else {
    		tab.style.backgroundColor = "#646464";
    		tab.style.color = "white";
    	}
    }
}
