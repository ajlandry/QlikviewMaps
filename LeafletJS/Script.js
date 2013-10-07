


function LeafletMapsChart_Init(){

	Qva.AddExtension('LeafletJS', function() {
	
			

		var _this = this;
		_this.ExtSettings = {};
		_this.ExtSettings.ExtensionName ='LeafletJS';
		_this.ExtSettings.LoadUrl = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=';

		
		var imagePath = 'Extensions/' + _this.ExtSettings.ExtensionName + '/lib/images';


		//Array to hold the css files to load
		var cssFiles = [];

		//pushing the css files to the css files array
	    cssFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/css/style.css');
	    cssFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/css/leaflet.css');
	    //cssFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/css/leaflet.ie.css');
	    cssFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/css/MarkerCluster.css');
	    cssFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/css/MarkerCluster.Default.css');
   	    cssFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/css/MarkerCluster.Default.ie.css');

	 

	 	$('.leaflet-control-layers-toggle').css('background-image','url(Extensions/'+ _this.ExtSettings.ExtensionName +'/lib/images/layers.png)');
	 	//Looping through to load up the css files
	 	//this is done because qlikview doesn't have an api to load up css files being passed an array.
	    for (var i = 0; i < cssFiles.length; i++) {

	        Qva.LoadCSS(_this.ExtSettings.LoadUrl + cssFiles[i]);
	    }

	    

		//Array to hold the js libraries to load up.
	    var jsFiles = [];
	              
	    //pushing the js files to the jsFiles array
	    jsFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/js/leaflet-0.6.4.js');
	    jsFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/js/leaflet-google.js');
		jsFiles.push('Extensions/' + _this.ExtSettings.ExtensionName + '/lib/js/leaflet.markercluster.js');

		//Loading up the js files via the QlikView api that allows an array to be passed.
		//After we load them up successfully, initialize the chart settings and append the chart
	    Qv.LoadExtensionScripts(jsFiles, function () {
	    	
	    	InitSettings();
	        Init();
	        InitChart();
   		

	    });
          

			function InitSettings() {
			  	
				_this.ExtSettings.UniqueId = _this.Layout.ObjectId.replace('\\', '_');

				}

			function Init(){

				$(_this.Element).empty();

				mapchart = document.createElement("div");
				$(mapchart).attr('id','Chart_'+ _this.ExtSettings.UniqueId);
				$(mapchart).height('100%');
				$(mapchart).width('100%');	


			    $(_this.Element).append(mapchart);

				}

			function InitChart(){

				try
				{

					var markers = new L.MarkerClusterGroup();
					
					for (var i=0,k=_this.Data.Rows.length;i<k;i++){
							var row = _this.Data.Rows [i];

							var val = parseFloat(row[0].text);
							var val2 = parseFloat(row[1].text);
												
							//Check to see if the lat and long passed back is a valid
								if (val != NaN && val !='' && val <= 90 && val >= -90 && val2 != NaN && val2 !='' && val2 <= 180 && val >= -180) {
									
									var latlng = new L.LatLng(val, val2);
									var poptext = 'Lat & Long:'+latlng+'<br/>'+ row[2].text;
									L.marker(latlng,{title:row[2].text}).addTo(markers).bindPopup(poptext);
									
								} else {
									//Need to figure out a method of notifiying bad lat and longs...
					   			}
					
					}



					var googleRoad = new L.Google('ROADMAP');
					var googleSat = new L.Google('SATELLITE');
					var googleHybrid = new L.Google('HYBRID');


					var baseLayers = {
						"Roadmap": googleRoad,
						"Satellite": googleSat,
						"Hybrid":googleHybrid
					};

					

					var map = new L.map(mapchart, {maxZoom: 17,layers:[googleRoad]});
				 	L.Control.Zoom('topleft');
				 	L.Icon.Default.imagePath = imagePath;

					map.attributionControl.setPosition('topright');
					
					L.control.layers(baseLayers).addTo(map);
					
					//map.addLayer(googleLayer);
					map.addLayer(markers);
					map.fitBounds(markers);
			 	}
			 	catch (err){
			 		if (typeof map != 'undefined'){
			 				map.remove();
			 		}


			 		$(mapchart).html('<div id="errormsg">There was an issue creating the map. Did you forget to set the PopUPHTML?<br/><br/><b>Error Message:</b><br />'+err.message+'</div> ');
			 		
				
			 	}
				
				
				
			
			}


});


}

//Google maps api need to be loaded first and done via the asynchronous api which calls the LeafletMapsChart_Init after it is done loading.
//I found that trying to load up the google maps api without the async connection would sometimes load the google maps js last and would cause issues with leafletjs from working
Qva.LoadScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=visualization,weather&callback=LeafletMapsChart_Init');


 