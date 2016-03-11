
window.onload = function () {
	// Default '#quick-reports' tab
	if (document.location.hash == "" || document.location.hash == "#") {
	    document.location.hash = "#/quick-reports";
	}

	var urlsFroms = document.getElementsByClassName("urls-from");
	for (var i = 0; i < urlsFroms.length; i++) {
		var form = urlsFroms[i];
	}

	reloadAll();

	var iframe = utility.getQuickReportsIFrame();
	var loaded = iframe.getAttribute("src") !== "";
	var urlsFrom = utility.getQuickReportsUrlsForm();
	utility.toggleInline(urlsFrom, !loaded);
}

function reloadAll() {
	reloadForms();
	reloadToolBars();
	reloadSelectedTab();
}

function reloadForms() {
	var urlsFrom = utility.getQuickReportsUrlsForm();
	loadUrlsFrom("quick-reports", urlsFrom);

	urlsFrom = utility.getMyTeamFoldersUrlsForm();
	loadUrlsFrom("my-team-folders", urlsFrom);
}

function reloadToolBars() {
	reloadComboboxes();
	siteChange();
}

function reloadComboboxes() {
	var combobox = utility.getQuickReportsSiteSelector();
	loadCombobox("quick-reports", combobox);

	combobox = utility.getMyTeamFoldersSiteSelector();
	loadCombobox("my-team-folders", combobox);
}

function siteChange() {
	var iframe, url, currentUrl;

	iframe = utility.getQuickReportsIFrame();
	url = utility.getQuickReportsSiteSelectorValue();
	currentUrl = iframe.getAttribute("src");
	if (currentUrl !== url) {
		iframe.setAttribute("src", url);
		var urlsFrom = utility.getQuickReportsUrlsForm();
		utility.toggleInline(urlsFrom, false);
	}
	utility.toggleInline(iframe, url !== "none");

	iframe = utility.getMyTeamFoldersIFrame();
	url = utility.getMyTeamFoldersSiteSelectorValue();
	currentUrl = iframe.getAttribute("src");
	if (currentUrl !== url) {
		iframe.setAttribute("src", url);
		var urlsFrom = utility.getMyTeamFoldersUrlsForm();
		utility.toggleInline(urlsFrom, false);
	}
	utility.toggleInline(iframe, url !== "none");

	reloadGoto();
}

function reloadGoto() {
	var goToLink, iframe;

	goToLink = utility.getQuickReportsGotoLink();
	iframe = utility.getQuickReportsIFrame();
	reloadGotoLink(goToLink, iframe);

	goToLink = utility.getMyFoldersGotoLink();
	iframe = utility.getMyFoldersIFrame();
	reloadGotoLink(goToLink, iframe);

	goToLink = utility.getMyTeamFoldersGotoLink();
	iframe = utility.getMyTeamFoldersIFrame();
	reloadGotoLink(goToLink, iframe);

	goToLink = utility.getPublicFoldersGotoLink();
	iframe = utility.getPublicFoldersIFrame();
	reloadGotoLink(goToLink, iframe);
}

function reloadGotoLink(link, iframe) {
	url = iframe.getAttribute("src");
	link.setAttribute("href", url);
	utility.toggleInline(link, url !== "none");
}

function loadCombobox(tag, combobox) {
	// Clear existing options
	for (var i = combobox.options.length; i >= 0; i--) {
		combobox.remove(i);
	}
	combobox.style.display = "none";

	// Read from local storage
	var sites = storageUtility.readLocalStorage(tag);
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
	var sites = storageUtility.readLocalStorage(tag);
	if (sites === undefined || sites.length === 0) {
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

function submitUrlsFrom(event, tag) {
	// Validate
	var form = event.target;
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

	if (allValid === true) {
		storageUtility.writeLocalStorage(tag, sites);
		reloadAll();
	}

	// Disable page reloading
	return false;
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

function quickReportsSetting() {
	var urlsFrom = utility.getQuickReportsUrlsForm();
	utility.toggleInlineDefault(urlsFrom);
}
function teamFoldersSetting() {
	var urlsFrom = utility.getMyTeamFoldersUrlsForm();
	utility.toggleInlineDefault(urlsFrom);
}

function tabSelect(e) {
	document.location.hash = e.target.hash;
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

    tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
    	var tab = tabs[i];
    	var selected = ("#/" + tab.id) === currentHash;
    	utility.toggleBlock(tab, selected);
    }
}

/* -------------------- Utilities -------------------- */

var utility = (function() {
	var getQuickReports = function () {
		return document.getElementById("quick-reports");
	};
	var getMyFolders = function () {
		return document.getElementById("fmy-folders");
	};
	var getMyTeamFolders = function () {
		return document.getElementById("my-team-folders");
	};
	var getPublicFolders = function () {
		return document.getElementById("public-folders");
	};

	var getUrlsForm = function (parentElement) {
		return parentElement.getElementsByClassName("urls-from")[0];
	};
	var getQuickReportsUrlsForm = function () {
		return getUrlsForm(getQuickReports());
	};
	var getMyTeamFoldersUrlsForm = function () {
		return getUrlsForm(getMyTeamFolders());
	};

	var getSiteSelector = function (parentElement) {
		return parentElement.getElementsByTagName("select")[0];
	}
	var getQuickReportsSiteSelector = function () {
		return getSiteSelector(getQuickReports());
	};
	var getMyTeamFoldersSiteSelector = function () {
		return getSiteSelector(getMyTeamFolders());
	};

	var getSiteSelectorValue = function (siteSelector) {
		var selectedIndex = siteSelector.selectedIndex;
		if (selectedIndex !== -1) {
			return siteSelector.options[selectedIndex].value;
		} else {
			return "";
		}
	}
	var getQuickReportsSiteSelectorValue = function () {
		return getSiteSelectorValue(getQuickReportsSiteSelector());
	};
	var getMyTeamFoldersSiteSelectorValue = function () {
		return getSiteSelectorValue(getMyTeamFoldersSiteSelector());
	}

	var getGotoLink = function (parentElement) {
		return parentElement.getElementsByClassName("goToLink")[0];
	};
	var getQuickReportsGotoLink = function () {
		return getGotoLink(getQuickReports());
	};
	var getMyFoldersGotoLink = function () {
		return getGotoLink(getMyFolders());
	};
	var getMyTeamFoldersGotoLink = function () {
		return getGotoLink(getMyTeamFolders());
	};
	var getPublicFoldersGotoLink = function () {
		return getGotoLink(getPublicFolders());
	};

	var getIFrame = function (parentElement) {
		return parentElement.getElementsByTagName("iframe")[0];
	};
	var getQuickReportsIFrame = function () {
		return getIFrame(getQuickReports());
	};
	var getMyFoldersIFrame = function () {
		return getIFrame(getMyFolders());
	};
	var getMyTeamFoldersIFrame = function () {
		return getIFrame(getMyTeamFolders());
	};
	var getPublicFoldersIFrame = function () {
		return getIFrame(getPublicFolders());
	};

	var toggle = function (element, state, type) {
		element.style.display = state ? type : "none";
	}
	var toggleBlock = function (element, state) {
		toggle(element, state, "block");
	}
	var toggleBlockDefault = function (element) {
		var hidden = element.style.display === "none";
		toggleBlock(element, hidden);
	};
	var toggleInline = function (element, state) {
		toggle(element, state, "inline-block");
	}
	var toggleInlineDefault = function (element) {
		var hidden = element.style.display === "none";
		toggleInline(element, hidden);
	};


	return {
		getQuickReportsUrlsForm: getQuickReportsUrlsForm,
		getMyTeamFoldersUrlsForm: getMyTeamFoldersUrlsForm,

		getQuickReportsSiteSelector: getQuickReportsSiteSelector,
		getMyTeamFoldersSiteSelector: getMyTeamFoldersSiteSelector,

		getQuickReportsSiteSelectorValue: getQuickReportsSiteSelectorValue,
		getMyTeamFoldersSiteSelectorValue: getMyTeamFoldersSiteSelectorValue,

		getQuickReportsGotoLink: getQuickReportsGotoLink,
		getMyFoldersGotoLink: getMyFoldersGotoLink,
		getMyTeamFoldersGotoLink: getMyTeamFoldersGotoLink,
		getPublicFoldersGotoLink: getPublicFoldersGotoLink,

		getQuickReportsIFrame: getQuickReportsIFrame,
		getMyFoldersIFrame: getMyFoldersIFrame,
		getMyTeamFoldersIFrame: getMyTeamFoldersIFrame,
		getPublicFoldersIFrame: getPublicFoldersIFrame,

		toggleBlock: toggleBlock,
		toggleBlockDefault: toggleBlockDefault,
		toggleInline: toggleInline,
		toggleInlineDefault: toggleInlineDefault
	};
}());

var storageUtility = (function () {
	var getCountLabel = function (tag) {
		return tag + " count";
	};
	var getSiteNameLabel = function (tag, index) {
		return tag + " " + index + " name";
	};
	var getSiteUrlLabel = function (tag, index) {
		return tag + " " + index + " url";
	};

	var writeLocalStorage = function (tag, sites) {
		clearLocalStorage(tag);

		localStorage.setItem(getCountLabel(tag), sites.length);
		for (var i = 0; i < sites.length; i++) {
			var site = sites[i];
			var name = site.name;
			var url = site.url;

			localStorage.setItem(getSiteNameLabel(tag, i), name);
			localStorage.setItem(getSiteUrlLabel(tag, i), url);
		}
	};
	var readLocalStorage = function (tag) {
		var countStr = localStorage.getItem(getCountLabel(tag));
		if (countStr === undefined) {
			return undefined;
		}
		var count = parseInt(countStr);

		var sites = [];
		for (var i = 0; i < count; i++) {
			var name = localStorage.getItem(getSiteNameLabel(tag, i));
			var url = localStorage.getItem(getSiteUrlLabel(tag, i));

			var site = {};
			site.name = name;
			site.url = url;
			sites.push(site);
		}
		return sites;
	};
	var clearLocalStorage = function (tag) {
		var countStr = localStorage.getItem(getCountLabel(tag));
		if (countStr === null) {
			return;
		}
		var count = parseInt(countStr);
		for (var i = 0; i < count; i++) {
			localStorage.removeItem(getSiteNameLabel(tag, i));
			localStorage.removeItem(getSiteUrlLabel(tag, i));
		}
		localStorage.removeItem(getCountLabel(tag));
	};

	return {
		writeLocalStorage: writeLocalStorage,
		readLocalStorage: readLocalStorage,
		clearLocalStorage: clearLocalStorage
	}
}());
