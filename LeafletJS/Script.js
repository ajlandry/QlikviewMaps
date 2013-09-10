//AJL: will need to make sure this is updated whenever the final extension is packaged.  I.E. the folder name will need to be whatever the final product name will be
var template_path = Qva.Remote + "?public=only&name=Extensions/ajandry/leafletmaps/";
//Cloudmade API Key





var extensionName = "leafletmaps";

var extensionPath = Qva.Remote + "?public=only&name=Extensions/ajlandry/" + extensionName +"/";

function loadGoogle(){




	Qva.LoadScript('https://maps.googleapis.com/maps/api/js?sensor=false&callback=extension_Init');
}

//Function : extension_Init
// Loading of external JS libraries
function extension_Init(){

	var files = [];
	//if Can't resolve jQuery, then load it
	if (typeof jQuery == 'undefined') {
	files.push(extensionPath + "jquery-1.10.2.min.js");
	}
	//files.push("https://getfirebug.com/firebug-lite.js");
	//Pushing js file names into files array
	files.push(extensionPath + "leaflet-0.6.4/leaflet.js");

	files.push(extensionPath + "leaflet-google.js");


		//loading all the js files and then executing extension_Done
	 Qv.LoadExtensionScripts(files, extension_Done);
}





//Beginning of function extension_Done. Called once the javascripts are done loading in the document

function extension_Done() {
	Qva.AddExtension('ajlandry/leafletmaps', function(){
		Qva.LoadCSS(extensionPath + "style.css");
		Qva.LoadCSS(extensionPath + "leaflet-0.6.4/leaflet.css");
		 _this = this;
		 
	
		divName = _this.Layout.ObjectId.replace("\\", "_");
		
		if (_this.Element.children.length == 0) {
			var ui = document.createElement("div");
			ui.setAttribute("id", divName);
			_this.Element.appendChild(ui);
			$("#" + divName).css("height", _this.GetHeight() + "px").css("width", _this.GetWidth() + "px");
		} else {
			
			//$("#" + divName).css("height", _this.GetHeight() + "px").css("width", _this.GetWidth() + "px");
			$("#" + divName).css("height", _this.GetHeight() + "px").css("width", _this.GetWidth() + "px");
			$("#" + divName).empty();
		};

		


		
			if(typeof map == 'undefined'){
				showLeafMap();
			}
			else{
				UpdateLeafMap();

			}


	

	    
	});
}


function UpdateLeafMap(){

	map.updateSize();

}

function showLeafMap(){


var markers = new L.LayerGroup();
//var routes = new L.LayerGroup();

var points = [];
var point = [];
var route = [];

 for (var i=0;i<_this.Data.Rows.length; i++) {
 				var row = _this.Data.Rows[i];

 				
 				var data =[parseFloat(row[0].text),parseFloat(row[1].text)];


 				var lat = parseFloat(row[0].text);
 				var lng = parseFloat(row[1].text);
 				point = new L.LatLng(lat , lng);

 				points.push(point);


 				
 				
 				L.marker(data).addTo(markers);
				
 			};
 			
//alert(points.join('\n'));
//route = new L.Polyline(points, {weight:3, opacity:.3, smoothFactor:1}).addTo(routes);

// if (typeof map == 'undefined')
// {
var roadGoogle = new L.Google('ROADMAP'),
    hybGoogle  = new L.Google('HYBRID'),
    satGoogle = new L.Google();

map = new L.map(divName, 
	{center:[39.73, -104.99], 
		zoom:10,
		layers:[roadGoogle,markers]


	});
//L.Control.Zoom('topleft');

map.fitBounds(points);

var baseLayers = {
 "Roadmap" : roadGoogle,
 "Hybird" : hybGoogle,
 "Statille": satGoogle



};

var overlays = {"Markers":markers};


L.control.layers(baseLayers,overlays).addTo(map);
L.control.scale().addTo(map);






// L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);




}






//Initiate extension

loadGoogle();


