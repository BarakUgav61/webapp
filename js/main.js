
window.onload = function () {
	initializeListeners();

	// Default '#quick-reports' tab
	if (document.location.hash == "" || document.location.hash == "#") {
	    document.location.hash = "#/quick-reports";
	}

	loadNotification();
	reloadAll();

	var iframe, urlsForm, loaded;

	iframe = utility.getQuickReportsIFrame();
	urlsForm = utility.getQuickReportsUrlsForm();
	loaded = iframe.getAttribute("src") !== ""; 
	utility.toggleInline(urlsForm, !loaded);

	iframe = utility.getMyTeamFoldersIFrame();
	urlsForm = utility.getMyTeamFoldersUrlsForm();
	loaded = iframe.getAttribute("src") !== "";
	utility.toggleInline(urlsForm, !loaded);
}

function initializeListeners() {
	var tabSelectors = utility.getTabSelectors();
	for (var i = 0; i < tabSelectors.length; i++) {
		var selector = tabSelectors[i];
		UTILS.addEvent(selector, "click", tabSelect);
	}

	var siteSelector;
	siteSelector = utility.getQuickReportsSiteSelector();
	UTILS.addEvent(siteSelector, "change", siteChange);
	siteSelector = utility.getMyTeamFoldersSiteSelector();
	UTILS.addEvent(siteSelector, "change", siteChange);

	var urlsForm;
	urlsForm = utility.getQuickReportsUrlsForm();
	UTILS.addEvent(urlsForm, "submit", submiturlsFormQuickReports);
	urlsForm = utility.getMyTeamFoldersUrlsForm();
	UTILS.addEvent(urlsForm, "submit", submiturlsFormMyTeamFolders);
}

function loadNotification() {
	utility.getConfig(function (config) {
		var notifications = utility.getNotifications();
		if (config.notification) {
			notifications.innerHTML = config.notification;
		}
		utility.toggleBlock(notifications, config.notification);

		var navbar = utility.getNavbar();
		for (var i = 0; i < config.quickActions.length; i++) {
			var sectionConfig = config.quickActions[i];
			var navSection = document.createElement("div");
			navSection.className = "nav-section";
			navSection.style.backgroundImage = "url('/Images/icons/" + sectionConfig.icon + ".png')";
			navbar.appendChild(navSection);

			var label = document.createElement("p");
			label.innerHTML = sectionConfig.label;;
			navSection.appendChild(label);

			var menu = document.createElement("div");
			menu.className = "menu";
			navSection.appendChild(menu);

			var menuHint = document.createElement("div");
			menuHint.className = "menu-hint";
			menu.appendChild(menuHint);

			var actionsLabel = document.createElement("p");
			actionsLabel.innerHTML = sectionConfig.actionsLabel;
			menuHint.appendChild(actionsLabel);

			var arrow = document.createElement("div");
			arrow.className = "arrow";
			menuHint.appendChild(arrow);

			var actionList = document.createElement("ul");
			actionList.className = "action-list";
			menu.appendChild(actionList);

			for (var j = 0; j < sectionConfig.actions.length; j++) {
				var action = sectionConfig.actions[j];
				var li = document.createElement("li");
				actionList.appendChild(li);

				var link = document.createElement("a");
				link.innerHTML = action.label;
				link.href = action.url;
				li.appendChild(link);
			}
		}

		var iframe;

		iframe = utility.getMyFoldersIFrame();
		iframe.setAttribute("src", config.tabsList[1].options.url);

		iframe = utility.getPublicFoldersIFrame();
		iframe.setAttribute("src", config.tabsList[3].options.url);
	});
}

function reloadAll() {
	reloadForms();
	reloadToolBars();
	reloadSelectedTab();
}

function reloadForms() {
	var urlsForm;

	urlsForm = utility.getQuickReportsUrlsForm();
	loadurlsForm("quick-reports", urlsForm);

	urlsForm = utility.getMyTeamFoldersUrlsForm();
	loadurlsForm("my-team-folders", urlsForm);
}

function reloadToolBars() {
	reloadComboboxes();
	siteChange();
}

function reloadComboboxes() {
	var selector;

	selector = utility.getQuickReportsSiteSelector();
	loadCombobox("quick-reports", selector);

	selector = utility.getMyTeamFoldersSiteSelector();
	loadCombobox("my-team-folders", selector);
}

function siteChange() {
	var iframe, url, currentUrl;

	iframe = utility.getQuickReportsIFrame();
	url = utility.getQuickReportsSiteSelectorValue();
	currentUrl = iframe.getAttribute("src");
	if (currentUrl !== url) {
		iframe.setAttribute("src", url);
		var urlsForm = utility.getQuickReportsUrlsForm();
		utility.toggleInline(urlsForm, url === "");
	}
	utility.toggleInline(iframe, url !== "");

	iframe = utility.getMyTeamFoldersIFrame();
	url = utility.getMyTeamFoldersSiteSelectorValue();
	currentUrl = iframe.getAttribute("src");
	if (currentUrl !== url) {
		iframe.setAttribute("src", url);
		var urlsForm = utility.getMyTeamFoldersUrlsForm();
		utility.toggleInline(urlsForm, url === "");
	}
	utility.toggleInline(iframe, url !== "");

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
	utility.toggleInline(link, url !== "");
}

function loadCombobox(tag, combobox) {
	// Clear existing options
	for (var i = combobox.options.length; i >= 0; i--) {
		combobox.remove(i);
	}
	combobox.style.display = "none";

	// Read from local storage
	var sites = storageUtility.readLocalStorage(tag);
	if (sites === undefined || sites.length === 0) {
		return;
	}

	combobox.style.display = "inline-block";
	for (var i = 0; i < sites.length; i++) {
		var site = sites[i];
		var option = document.createElement("option");
		option.text = site.name;
		option.value = site.url;
		combobox.add(option);
	}
}

function loadurlsForm(tag, form) {
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

function submiturlsFormQuickReports(event) {
	return submiturlsForm(event, "quick-reports");
}
function submiturlsFormMyTeamFolders(event) {
	return submiturlsForm(event, "my-team-folders");
}
function submiturlsForm(event, tag) {
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
	if (sites.length > 0) {
		utility.toggleInline(form, false);
	}

	// Disable page reloading
	event.preventDefault();
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
	var urlsForm = utility.getQuickReportsUrlsForm();
	utility.toggleInlineDefault(urlsForm);
}
function teamFoldersSetting() {
	var urlsForm = utility.getMyTeamFoldersUrlsForm();
	utility.toggleInlineDefault(urlsForm);
}

function tabSelect(e) {
	document.location.hash = e.target.hash;
	reloadSelectedTab();
}

function reloadSelectedTab() {
	var currentHash = document.location.hash;
    var allTabs = utility.getTabSelectors();

    for (var i = 0; i < allTabs.length; i++) {
    	var tab = allTabs[i];
    	var isCurrentTab = tab.hash === currentHash;
    	tab.style.color = isCurrentTab ? "black" : "white";
    	tab.style.backgroundColor = isCurrentTab ? "#EBEBEB" : "#646464";
    }

    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
    	var tab = tabs[i];
    	var selected = ("#/" + tab.id) === currentHash;
    	utility.toggleBlock(tab, selected);
    }
}

/* -------------------- Utilities -------------------- */

var utility = (function() {
	var getConfig = function (success) {
		UTILS.ajax("data/config.json", {
			method: "GET",
			done: function (res) {
				success.call(this, JSON.parse(res));
			}
		});
	};

	var getNotifications = function () {
		return document.getElementsByClassName("notifications")[0];
	}
	var getNavbar = function () {
		return document.getElementsByTagName("nav")[0];
	}

	var getTabSelectors = function () {
		var tabs = document.getElementsByClassName("tabs")[0];
    	var tabsSelectorsList = tabs.getElementsByTagName("ul")[0];
    	return tabsSelectorsList.getElementsByTagName("a");
	};

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
		return parentElement.getElementsByClassName("urls-form")[0];
	};
	var getQuickReportsUrlsForm = function () {
		return getUrlsForm(getQuickReports());
	};
	var getMyTeamFoldersUrlsForm = function () {
		return getUrlsForm(getMyTeamFolders());
	};

	var getSiteSelector = function (parentElement) {
		return parentElement.getElementsByClassName("siteSelector")[0];
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

		getConfig: getConfig,
		getNotifications: getNotifications,
		getNavbar: getNavbar,

		getTabSelectors: getTabSelectors,

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
	var dataTag = "WebAppData";
	var read = function () {
		var dataStr = localStorage.getItem(dataTag);
		if (dataStr === undefined || dataStr === null) {
			return undefined;
		}
		var data = JSON.parse(dataStr);
		if (data === undefined || data === null) {
			return undefined;
		}
		return data;
	};
	var write = function (data) {
		if (data === undefined || data === null) {
			return;
		}
		var dataStr = JSON.stringify(data);
		if (dataStr === undefined || dataStr === null) {
			return;
		}
		localStorage.setItem(dataTag, dataStr);
	};

	var writeLocalStorage = function (tag, sites) {
		if (sites === undefined) {
			return;
		}
		
		var data = read();
		if (data === undefined) {
			data = {};
		}
		data[tag] = sites;

		write(data);
	};
	var readLocalStorage = function (tag) {
		var data = read();
		if (data === undefined) {
			return undefined;
		}
		return data[tag];
	};


	return {
		writeLocalStorage: writeLocalStorage,
		readLocalStorage: readLocalStorage
	}
}());
