

var annotation;

// What the data looks like:
// var annotation = [
// 			{"chromosome":"1", "start": 934342, "end": 935552, "name":"ENSG00000188290.6","strand":"-","type":"protein_coding","gene":"HES4"},
// 			{"chromosome":"1", "start": 955503, "end": 991496, "name":"ENSG00000188157.9","strand":"+","type":"protein_coding","gene":"AGRN"}		
// ];


function showResult() {
	var str = this.value;
	if (str.length==0) { 
		d3.select("#livesearch").html("");
		d3.select("#livesearch").style("border","0px");
		return;
	}

	var search_value = str.toUpperCase();

	var suggestions = "";
	for (var i in annotation) {
		if (annotation[i].gene.indexOf(search_value) != -1) {
			suggestions += '<p onclick="selectGene(' + i + ')">' + annotation[i].gene + "  [chromosome = " + annotation[i].chromosome + "]" + '</p>';
		}
	}
	if (suggestions == "") {
		suggestions = "no match";
	}
	d3.select("#livesearch").html(suggestions);
	d3.select("#livesearch").style("border","1px solid #A5ACB2");
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

