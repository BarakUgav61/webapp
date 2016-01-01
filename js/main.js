// Default '#quick-reports' tab
if (document.location.hash == "" || document.location.hash == "#") {
    document.location.hash = "#quick-reports";
}

(function () {
	var quickReports = document.getElementById("quick-reports");
	var urlsForm = quickReports.getElementsByClassName("urls-from")[0];
	urlsForm.style.backgroundColor = "red";
})();

function validateUrlsForm(form) {
	var allRows = form.getElementsByClassName("url-form");

	var allValid = true;
	for (var rowIndex in allRows) {
		var row = allRows[rowIndex];
		var nameBox = row.getElementsByClassName("name")[0];
		var urlBox = row.getElementsByClassName("url")[0];
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
	var style = inputElement.style;
	style.border = "2px inset";
}