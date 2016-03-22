window.onload = function () {
	initializeListeners();

	// Default '#quick-reports' tab
	if (document.location.hash == "" || document.location.hash == "#") {
		loadLastTab();
	}

	// Load the configuration and then reload all
	loadConfiguration(function () {
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
	});
}

function initializeListeners() {
	var searchBox = utility.getSearchBox();
	UTILS.addEvent(searchBox, "keypress", search);

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

	var urlsForm, submitButton;
	urlsForm = utility.getQuickReportsUrlsForm();
	submitButton = utility.getSubmitButton(urlsForm);
	UTILS.addEvent(urlsForm, "submit", submiturlsFormQuickReports);
	UTILS.addEvent(submitButton, "click", submiturlsFormQuickReports);
	urlsForm = utility.getMyTeamFoldersUrlsForm();
	submitButton = utility.getSubmitButton(urlsForm);
	UTILS.addEvent(urlsForm, "submit", submiturlsFormMyTeamFolders);
	UTILS.addEvent(submitButton, "click", submiturlsFormMyTeamFolders);

	var settingButton;
	settingButton = utility.getQuickReportsSettingButton();
	UTILS.addEvent(settingButton, "click", quickReportsSetting);
	settingButton = utility.getMyTeamFoldersSettingButton();
	UTILS.addEvent(settingButton, "click", teamFoldersSetting);

	var cancelButton;
	cancelButton = utility.getCancelButton(utility.getQuickReportsUrlsForm());
	UTILS.addEvent(cancelButton, "click", function (){
		utility.getQuickReportsUrlsForm().style.display = "none";
	});
	cancelButton = utility.getCancelButton(utility.getMyTeamFoldersUrlsForm());
	UTILS.addEvent(cancelButton, "click", function (){
		utility.getMyTeamFoldersUrlsForm().style.display = "none";
	});
}

function loadConfiguration(callBack) {
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
			navSection.style.backgroundImage = "url('./Images/icons/" + sectionConfig.icon + ".png')";
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

			var dropdownBox = document.createElement("a");
			dropdownBox.className = "menu-dropdown u-plain-link";
			menuHint.appendChild(dropdownBox);

			var actionsLabel = document.createElement("p");
			actionsLabel.innerHTML = sectionConfig.actionsLabel;
			dropdownBox.appendChild(actionsLabel);

			var arrow = document.createElement("div");
			arrow.className = "arrow";
			dropdownBox.appendChild(arrow);

			var actionList = document.createElement("ul");
			actionList.className = "action-list";
			menuHint.appendChild(actionList);

			// Set the drop down link to refer to the first link in action list
			if (sectionConfig.actions.length > 0) {
				dropdownBox.href = sectionConfig.actions[0].url;
			}

			// Fill action list
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

		// Call the call back function
		callBack();
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
	var sites = storageUtility.readLocalStorageByTag(tag);
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
	var sites = storageUtility.readLocalStorageByTag(tag);
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
	var form = utility.getQuickReportsUrlsForm();
	return submiturlsForm(event, form, "quick-reports");
}
function submiturlsFormMyTeamFolders(event) {
	var form = utility.getMyTeamFoldersUrlsForm();
	return submiturlsForm(event, form, "my-team-folders");
}
function submiturlsForm(event, form, tag) {
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

		var required = name !== "" || url !== "";
		nameBox.required = required;
		urlBox.required = required;
		if (!required) {
			continue;
		}

		if (!nameBox.checkValidity()) {
			nameBox.style.border = "solid 1px red";
			allValid = false;
		}

		if (!urlBox.checkValidity()) {
			urlBox.style.border = "solid 1px red";
			allValid = false;
		}

		// Add site to sites array
		var site = {};
		site.name = name;
		site.url = url;
		sites.push(site);
	}

	if (allValid && sites.length > 0) {
		utility.toggleInline(form, false);
	}
	if (allValid) {
		storageUtility.writeLocalStorageByTag(tag, sites);
		reloadAll();
	} else {
		// Not valid, invoke from.submit() for pop ups
		var submitButton = utility.getSubmitButtonHidden(form);
		submitButton.click();
	}

	event.preventDefault();
	loadurlsForm();
	return false;
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

function loadLastTab() {
	var lastTab = storageUtility.readLocalStorageLastTab();
	if (lastTab === undefined || lastTab === null) {
		// If no last tab, select first tab
		lastTab = "#/quick-reports"
	}
	var allTabs = utility.getTabSelectors();
	for (var i = 0; i < allTabs.length; i++) {
    	var tab = allTabs[i];
    	var isCurrentTab = tab.hash === lastTab;
    	if (isCurrentTab) {
    		tab.click();
    		return;
    	}
    }
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

    storageUtility.writeLocalStorageLastTab(currentHash);
}

function search(event) {
	var enterKeyCode = 13;
	if (event.keyCode == 13) {
		event.preventDefault();
		var searchBox = utility.getSearchBox();
		var text = searchBox.value;

		var siteSelector, success;
		siteSelector = utility.getQuickReportsSiteSelector();
		success = searchInSiteSelector(text, siteSelector, "Quick Reports");
		if (success) return;

		siteSelector = utility.getMyTeamFoldersSiteSelector();
		success = searchInSiteSelector(text, siteSelector, "My Team Folders");
		if (success) return;

		// Didn't find - notify the user
		window.alert("Match was not found for '" + text + "'");
	}
}

function searchInSiteSelector(text, siteSelector, tabName) {
	for (var i = 0; i < siteSelector.options.length; i++) {
		var optionStr = siteSelector.options[i].text;
		if (optionStr.search(text) >= 0) {
			// Match found
			siteSelector.selectedIndex = i;
			siteChange();

			var tabSelectors = utility.getTabSelectors();
			for (var i = 0; i < tabSelectors.length; i++) {
				var selector = tabSelectors[i];
				if (selector.text == tabName) {
					selector.click();
				}
			}
			return true;
		}
	}
	return false;
}

/* -------------------- Utilities -------------------- */

var utility = (function() {
	var getSearchBox = function () {
		return document.getElementsByClassName("search-box")[0];
	};

	var getConfig = function (success) {
		UTILS.ajax("./data/config.json", {
			method: "GET",
			done: function (res) {
				if (!UTILS.isObject(res)) {
					// If and only if not parsed yet, parse
					res = JSON.parse(res);
				}
				success.call(this, res);
			}
		});
	};

	var getNotifications = function () {
		return document.getElementsByClassName("notifications")[0];
	};
	var getNavbar = function () {
		return document.getElementsByTagName("nav")[0];
	};

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
	};
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
	};
	var getQuickReportsSiteSelectorValue = function () {
		return getSiteSelectorValue(getQuickReportsSiteSelector());
	};
	var getMyTeamFoldersSiteSelectorValue = function () {
		return getSiteSelectorValue(getMyTeamFoldersSiteSelector());
	};

	var getSettingButton = function (parentElement) {
		return parentElement.getElementsByClassName("settingLink")[0];
	};
	var getQuickReportsSettingButton = function () {
		return getSettingButton(getQuickReports());
	};
	var getMyTeamFoldersSettingButton = function () {
		return getSettingButton(getMyTeamFolders());
	};

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

	var getSubmitButton = function (parentElement) {
		return parentElement.getElementsByClassName("submit")[0];
	};
	var getSubmitButtonHidden = function (parentElement) {
		return parentElement.getElementsByClassName("hidden-submit")[0];
	};
	var getCancelButton = function (parentElement) {
		return parentElement.getElementsByClassName("cancel")[0];
	}

	var toggle = function (element, state, type) {
		element.style.display = state ? type : "none";
	};
	var toggleBlock = function (element, state) {
		toggle(element, state, "block");
	};
	var toggleBlockDefault = function (element) {
		var hidden = element.style.display === "none";
		toggleBlock(element, hidden);
	};
	var toggleInline = function (element, state) {
		toggle(element, state, "inline-block");
	};
	var toggleInlineDefault = function (element) {
		var hidden = element.style.display === "none";
		toggleInline(element, hidden);
	};

	return {

		getSearchBox: getSearchBox,

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

		getQuickReportsSettingButton: getQuickReportsSettingButton,
		getMyTeamFoldersSettingButton: getMyTeamFoldersSettingButton,

		getQuickReportsGotoLink: getQuickReportsGotoLink,
		getMyFoldersGotoLink: getMyFoldersGotoLink,
		getMyTeamFoldersGotoLink: getMyTeamFoldersGotoLink,
		getPublicFoldersGotoLink: getPublicFoldersGotoLink,

		getQuickReportsIFrame: getQuickReportsIFrame,
		getMyFoldersIFrame: getMyFoldersIFrame,
		getMyTeamFoldersIFrame: getMyTeamFoldersIFrame,
		getPublicFoldersIFrame: getPublicFoldersIFrame,

		getSubmitButton: getSubmitButton,
		getSubmitButtonHidden: getSubmitButtonHidden,
		getCancelButton: getCancelButton,

		toggleBlock: toggleBlock,
		toggleBlockDefault: toggleBlockDefault,
		toggleInline: toggleInline,
		toggleInlineDefault: toggleInlineDefault
	};
}());

var storageUtility = (function () {
	var dataTag = "WebAppData";
	var lastTab = "lastTab";
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

	var writeLocalStorageByTag = function (tag, sites) {
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
	var readLocalStorageByTag = function (tag) {
		var data = read();
		if (data === undefined) {
			return undefined;
		}
		return data[tag];
	};
	var writeLocalStorageLastTab = function (tabName) {
		var data = read();
		if (data === undefined) {
			data = {};
		}
		data[lastTab] = tabName;
		write(data);
	};
	var readLocalStorageLastTab = function () {
		var data = read();
		if (data === undefined) {
			return undefined;
		}
		return data[lastTab];
	};

	return {
		writeLocalStorageByTag: writeLocalStorageByTag,
		readLocalStorageByTag: readLocalStorageByTag,
		writeLocalStorageLastTab: writeLocalStorageLastTab,
		readLocalStorageLastTab: readLocalStorageLastTab
	}
}());
