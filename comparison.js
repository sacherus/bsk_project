var sources = new Array();
var ratios = []
var options;
var cols = [];
var headings = [];
var tableNode;
var rowSize;
var requestCounter = 0;
var storage = chrome.storage.local;
var tabToCell = new Array();
var tabs = new Array();
var calculated = false;
function addRow() {
	var headRow = document.createElement('tr');
	var firstRow = document.createElement('tr');
	for ( i = 0; i < rowSize; i++) {
		headings[i] = document.createElement('th');
		headings[i].textContent = i + 1;
		headRow.appendChild(headings[i]);
		cols[i] = document.createElement('td');
		cols[i].textContent = "waiting";
		cols[i].setAttribute("id", "cell" + i);
		firstRow.appendChild(cols[i]);
	}
	tableNode.appendChild(headRow);
	tableNode.appendChild(firstRow);
}

//first element hack
function getKey(data) {
	for (var prop in data)
	return prop;
}

function calculateRatio() {
	if (!calculated) {
		var firstPage = sources[getKey(tabToCell)];
		var i = 0;
		for (tabId in tabToCell) {
			headings[i].textContent = tabs[tabId].url;
			s = new difflib.SequenceMatcher(firstPage, sources[tabId]);
			var ratio = s.quick_ratio();
			cols[i].textContent = ratio;
			if (ratio < 0.4) {
				cols[i].style.backgroundColor = "red";
			} else if (ratio > 0.9) {
				cols[i].style.backgroundColor = "green";
			}
			i++;
		}
		calculated = true;
	}
}

window.onload = function() {
	tableNode = document.getElementById("comparisonTable");
	storage.get('options', function(items) {
		options = items.options;
		rowSize = options.length + 1;
		addRow();
	});
	chrome.extension.onMessage.addListener(function(request, sender) {
		if (request.action == "getSource") {
			//first element hack
			sources[sender.tab.id] = request.source;
			tabToCell[sender.tab.id] = requestCounter++;
			tabs[sender.tab.id] = sender.tab;
			if (requestCounter == rowSize) {
				// alert(requestCounter);
				// alert(rowSize);
				//alert("Calculating ratio! This operation takes time.")
				calculateRatio();
			}
		}
	});
	setTimeout(function() {
		if (!calculated) {
			//alert("Calculating after 20s");
			calculateRatio();
		}
	}, 20000);
}