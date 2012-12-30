var storage = chrome.storage.local;
// var choice = 
function save_options() {
	//	console.log("Hej");
	//	var select = document.getElementById("choice");
	//	var choice = select.children[select.selectedIndex].value;
	var ifChecked = new Array();
	var query = document.getElementById('yourOwnQuery');
	var chks = document.getElementsByName('checkbox');
	for (var i = 0; i < chks.length; i++) {
		if (chks[i].checked){
			if(chks[i].value=="other")
			ifChecked.push(query.value);
			else
			ifChecked.push(chks[i].value);
		}
			
	}

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
	storage.set({
		'options' : ifChecked
	}, function() {
		console.log("Saved options " + ifChecked)
	})
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	storage.get('options', function(items) {
		var checkBox = document.getElementsByName("checkbox");
		var userChoice = items.options;
		console.log(checkBox);
		console.log("Loaded options: " + userChoice);
		var userLength = userChoice.length;
		if (userLength == 0) {
			return;
		}
		var checkLength = checkBox.length;
		console.log(checkLength)
		for (var i = 0; i < checkLength; i++) {
			var chk = checkBox[i];
			for (var k = 0; k < userLength; k++) {
				if (chk.value == userChoice[k]) {
					chk.checked = "true";
					break;
				}
			}
		}

	});

}

window.onload = function() {
	document.getElementById('save').addEventListener('click', save_options);
	restore_options();
}

function add(){   
	var query = document.getElementById('yourOwnQuery');
/*	var checkbox = document.createElement('input');
checkbox.type = "checkbox";
checkbox.name = "checkbox";
checkbox.value = query.value;

var label = document.createElement('label')
label.htmlFor = "id";
label.appendChild(document.createTextNode('label');

container.appendChild(checkbox);
container.appendChild(label);*/

}