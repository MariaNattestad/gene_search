

var annotation;

// What the data looks like:
// var annotation = [
// 			{"chromosome":"1", "start": 934342, "end": 935552, "name":"ENSG00000188290.6","strand":"-","type":"protein_coding","gene":"HES4"},
// 			{"chromosome":"1", "start": 955503, "end": 991496, "name":"ENSG00000188157.9","strand":"+","type":"protein_coding","gene":"AGRN"}		
// ];

var last_value = "";

var highlighted_index = 0;

function showResult() {

	var key = d3.event.keyCode;

	if (key == 13) { // Enter/Return key
		selectGene(d3.select("#select_" + highlighted_index).property("value"));
		highlighted_index = 0;
		return;
	} else if (key == 40) { // down arrow
		d3.select("#select_" + highlighted_index).style("background-color","#ffffff");
		highlighted_index++;
		d3.select("#select_" + highlighted_index).style("background-color","#eeeeee");
		return;
	} else if (key == 38) { // up arrow
		d3.select("#select_" + highlighted_index).style("background-color","#ffffff");
		highlighted_index--;
		d3.select("#select_" + highlighted_index).style("background-color","#eeeeee");
		return; 
	}

	var str = this.value;
	if (str == last_value) {
		return;
	}

	if (str.length==0) { 
		d3.select("#livesearch").html("");
		d3.select("#livesearch").style("border","0px");
		return;
	}

	var search_value = str.toUpperCase();

	var max_suggestions_to_show = 10;
	var suggestions = "";
	var num_suggestions = 0;
	for (var i in annotation) {
		if (annotation[i].gene.indexOf(search_value) != -1) {
			suggestions += '<li value="' + i + '" id="select_' + num_suggestions + '" onclick="selectGene(' + i + ')">' + annotation[i].gene + "  [chromosome = " + annotation[i].chromosome + "]" + '</li>';
			num_suggestions++;
			if (num_suggestions > max_suggestions_to_show) {
				suggestions += '<li>...</li>';
				break;
			}
		}
	}

	if (suggestions == "") {
		suggestions = "no match";
	} 

	d3.select("#livesearch").html(suggestions);
	d3.select("#livesearch").style("border","1px solid #A5ACB2");

	console.log("highlighting:");
	console.log(highlighted_index);
	d3.select("#select_" + highlighted_index).style("background-color","#eeeeee");

	last_value = str;
}

function selectGene(index) {
	d3.select("#livesearch").html("");
	d3.select("#livesearch").style("border","0px");

	d3.select("#search_input").property("value","");
	var formatted_result = "<strong>" + annotation[index]["gene"] + "</strong>";
	for (var key in annotation[index]) {
		if (key != "gene") {
			formatted_result += ", " + key + ": " + annotation[index][key];	
		}
	}
	d3.select("#show_result").append("li").html(formatted_result);
}

var read_annotation_file = function(filename) {
	d3.csv(filename, function(error, annotation_input) {

		if (error) throw error;

		for (var i=0;i<annotation_input.length;i++) {
			annotation_input[i].start = +annotation_input[i].start
			annotation_input[i].end = +annotation_input[i].end
		}
		annotation = annotation_input;
		console.log("Finished reading annotation")
	});
}


d3.select("#search_input").on("keyup",showResult);

read_annotation_file("resources/Human_hg19.genes.csv");

