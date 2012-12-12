$(document).ready(function() {
	function countForms() {
		var n = $("form").size();
		return n;
	}

	function addFormRow(id, link, table) {
		var button = $("<button>Chemis</button>");
		var tr = $("<tr></tr>");
		var td1 = $("<td></td>").text(id);
		var td2 = $("<td></td>").text(link);
		var td3 = $("<td></td>").append(button);

		tr.append(td1, td2, td3);
		table.append(tr);
	}

	function addMore(table) {
		num = countForms();
		for (var i = 1; i <= num; i++) {
			var nth = $("form").get(i-1).action;
			addFormRow(i,nth,table);
		}

	}

	alert(countForms())

	var destTable = $("#tabela");
	//var newRow = $("<tr><td>hi</td><td>hi</td><td>hi</td></tr>");
	//$("#tabela").append(newRow);

	addMore(destTable);

});

