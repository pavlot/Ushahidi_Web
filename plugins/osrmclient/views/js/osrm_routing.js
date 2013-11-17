/** Procedure to move element on given index to new position. */
Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this;
};

/**
 * requestUrl must be finished with jsonp=
 * */
OSRM_Client.JSONP_Callback = function(callbackId, callback, requestUrl)
{
	this.callbackId = callbackId;
	this.callback = callback;
	this.jsonpScript = document.createElement("script");
	this.jsonpScript.type = 'text/javascript';
	this.jsonpScript.src = requestUrl + "window.osrmClient.callbacks.callbackArray."
		+ callbackId + ".callback";
};

OSRM_Client.JSONP_CallbackHolder = function()
{
	this.callbackArray = {};
	this.addCallback = function(callbackObj)
	{
		this.removeCallback(callbackObj);
		document.head.appendChild(callbackObj.jsonpScript); 
		this.callbackArray[callbackObj.callbackId] = callbackObj;
	};
	
	this.removeCallback = function(callbackObjId)
	{
		if(this.callbackArray[callbackObjId]
			&& this.callbackArray[callbackObjId].jsonpScript.parentNode
		){
			this.callbackArray[callbackObjId].jsonpScript.parentNode.removeChild(
				this.callbackArray[callbackObjId].jsonpScript
			);
		}
		delete this.callbackArray[callbackObjId];
	};
};

OSRM_Client.Viapoint = function(viapointData)
{
	this.id = "viapoint_" + new Date().getTime();
	this.latlon = viapointData.latlon;
	this.marker = viapointData.marker;
	this.name = viapointData.name;
	this.uiListItem = null;
	
	/** Return coordinates transformed to correct system. */
	this.getCoords = function()
	{
		return this.latlon.clone().transform(Ushahidi.proj_900913, Ushahidi.proj_4326);
	}
	
	this.setName = function(name)
	{
		this.name = name;
		this.divName.innerHTML = name;
	}
	
	this.setMarkerIcon = function(iconPath)
	{
		this.marker.setUrl(iconPath);
		this.markerImg.src = iconPath;
	}
}

OSRM_Client.OSRM_Client = function(clientParams)
{
	this.ushahidiMap = clientParams.ushahidiMap;
	this.mapMarkersLayer = clientParams.mapMarkersLayer;
	this.route_layer = null;
	this.pointsContainer = clientParams.pointsContainer;
	this.pointsContainerObj = document.getElementById(this.pointsContainer);
	this.callbacks = new OSRM_Client.JSONP_CallbackHolder();
	
	this._viapoints = {};
	this._viapointsOrder = []; // Container, which holds id's of viaponts ordered against route (re-ordered by list)
	

	/** Create viapoint and marker for it. */
	this.addViapointAtXY = function(xy){
		var point = this.ushahidiMap._olMap.getLonLatFromViewPortPx(xy);
		var viapoint = new OSRM_Client.Viapoint({
				latlon : point,
				marker : new OpenLayers.Marker(point)
			}
		);
		this.addViapoint(viapoint);
		this.getNearestPoint(viapoint); // TODO Make reverse geocoding for new added point.
	};
	
	this.addViapoint = function(viapoint)
	{
		if(!this._viapoints[viapoint.id]){
			this.mapMarkersLayer.addMarker(viapoint.marker);
			this._viapoints[viapoint.id] = viapoint;
			this._viapointsOrder.push(viapoint.id);
			this.addViapoint2Container(viapoint);
			if(Object.keys(this._viapoints).length > 1)
			{
				this.getRouteForViapoints();
			}
		}
	}
	
	this.removeViapoint = function(viapoint, updateRoute)
	{
		if(this._viapoints[viapoint.id]){
			this.mapMarkersLayer.removeMarker(viapoint.marker);
			viapoint.uiListItem.parentNode.removeChild(viapoint.uiListItem);
			delete this._viapoints[viapoint.id];
			var viapointIndex = this.getViapointIndex(viapoint.id);
			if(viapointIndex > -1 && viapointIndex < this._viapointsOrder.length)
			{
				this._viapointsOrder.splice(viapointIndex, 1);
			}
			if(updateRoute==true && Object.keys(this._viapoints).length > 1)
			{
				this.getRouteForViapoints();
			}
		}
	}
	
	this.clearViapoints = function()
	{
		for(var key in this._viapoints)
		{
			this.removeViapoint(this._viapoints[key], false);
		}
		if(this.route_layer)
		{
			this.ushahidiMap._olMap.removeLayer(this.route_layer);
			this.route_layer = null;
		}
	}
	
	/** Add viapoint to list of the viaponts. */
	this.addViapoint2Container = function(viapoint)
	{
		var thisOsrmClient = this;
		viapoint.uiListItem = document.createElement("li");
		viapoint.uiListItem.id = viapoint.id;
		viapoint.markerImg = document.createElement("img");
		viapoint.markerImg.className += "viapoint-marker";
		this._viapoints[this._viapointsOrder[0]].setMarkerIcon("plugins/osrmclient/media/img/marker-green.png");
		viapoint.setMarkerIcon("plugins/osrmclient/media/img/marker.png");
		if(this._viapointsOrder.length >= 3)
		{
			this._viapoints[this._viapointsOrder[this._viapointsOrder.length - 2]].setMarkerIcon("plugins/osrmclient/media/img/marker-gold.png");
		}
		
		viapoint.uiListItem.appendChild(viapoint.markerImg);
		var divContainer = document.createElement("div");
		divContainer.className += "viapoint-info";
		viapoint.uiListItem.appendChild(divContainer);
		
		viapoint.divName = document.createElement("div");
		viapoint.setName("Resolving..."); // ToDo make this constant
		divContainer.appendChild(viapoint.divName);
		
		viapoint.divLatLon = document.createElement("div");
		viapoint.divLatLon.innerHTML = "lat:" + 
			parseFloat(viapoint.getCoords().lat).toFixed(
				OSRM_Client.CONST.LATLON_PRECISION
			) + ", lon:" +
			parseFloat(viapoint.getCoords().lon).toFixed(
				OSRM_Client.CONST.LATLON_PRECISION
			);
		viapoint.divLatLon.className += "coordinates";
		divContainer.appendChild(viapoint.divLatLon);
		
		this.createViapointManageBlock(viapoint);
		viapoint.markerImg.onclick = function()
		{
			thisOsrmClient.ushahidiMap._olMap.setCenter(viapoint.latlon);
		};
				
		this.pointsContainerObj.appendChild(viapoint.uiListItem);
	};
	
	this.createViapointManageBlock = function(viapoint)
	{
		var thisOsrmClient = this;
		var divManageContainer = document.createElement("div");
		viapoint.moveUpImg = document.createElement("img");
		viapoint.moveUpImg.src = "plugins/osrmclient/media/img/arrow_up.png";
		viapoint.moveUpImg.className += "viapoint-manage";
		if(	this._viapointsOrder.length < 2)
		{
			viapoint.moveUpImg.style.display = 'none';
		}else
		{
			this._viapoints[this._viapointsOrder[this._viapointsOrder.length - 2]].moveDownImg.style.display = 'block';
		}
		viapoint.moveUpImg.onclick = function(){
			thisOsrmClient.moveViapointUp(viapoint);
			thisOsrmClient.getRouteForViapoints();
		};
		divManageContainer.appendChild(viapoint.moveUpImg);

		viapoint.cancelImg = document.createElement("img");
		viapoint.cancelImg.src = "plugins/osrmclient/media/img/cancel.png";
		viapoint.cancelImg.className += "viapoint-manage";
		viapoint.cancelImg.onclick = function()
		{
			thisOsrmClient.removeViapoint(viapoint, true);
		};
		divManageContainer.appendChild(viapoint.cancelImg);

		viapoint.moveDownImg = document.createElement("img");
		viapoint.moveDownImg.src = "plugins/osrmclient/media/img/arrow_down.png";
		viapoint.moveDownImg.className += "viapoint-manage";
		viapoint.moveDownImg.style.display = 'none';
		viapoint.moveDownImg.onclick = function(){
			thisOsrmClient.moveViapointDown(viapoint);
			thisOsrmClient.getRouteForViapoints();
		};
		divManageContainer.appendChild(viapoint.moveDownImg);
		
		viapoint.uiListItem.appendChild(divManageContainer);
	};
	
	this.moveViapointUp = function(viapoint)
	{
		var currentIndex = this.getViapointIndex(viapoint.id);
		if(currentIndex > 0)
		{
			var prevViapointId = this._viapointsOrder[currentIndex - 1];
			var prevViapoint = this._viapoints[prevViapointId];
			viapoint.uiListItem.parentNode.removeChild(viapoint.uiListItem);
			prevViapoint.uiListItem.parentNode.insertBefore(
					viapoint.uiListItem, 
					prevViapoint.uiListItem);
			this._viapointsOrder.move(currentIndex, currentIndex - 1);
			if(currentIndex - 1 == 0) // become first
			{
				viapoint.moveUpImg.style.display = 'none';
				viapoint.moveDownImg.style.display = 'block';
				viapoint.setMarkerIcon("plugins/osrmclient/media/img/marker-green.png");
				prevViapoint.moveUpImg.style.display = 'block';
				prevViapoint.setMarkerIcon("plugins/osrmclient/media/img/marker-gold.png");
			}
			if(currentIndex + 1 == this._viapointsOrder.length){
				prevViapoint.moveDownImg.style.display = 'none';
				prevViapoint.setMarkerIcon("plugins/osrmclient/media/img/marker.png");
				viapoint.moveDownImg.style.display = 'block';
				if(this._viapointsOrder.length == 2){
					viapoint.setMarkerIcon("plugins/osrmclient/media/img/marker-green.png");
				}else{
					viapoint.setMarkerIcon("plugins/osrmclient/media/img/marker-gold.png");
				}
			}
		}
	};
	
	this.moveViapointDown = function(viapoint)
	{
		var currentIndex = this.getViapointIndex(viapoint.id);
		if(currentIndex + 1 < this._viapointsOrder.length)
		{
			var nextViapointId = this._viapointsOrder[currentIndex + 1];
			var nextViapoint = this._viapoints[nextViapointId];
			viapoint.uiListItem.parentNode.removeChild(viapoint.uiListItem);
			nextViapoint.uiListItem.parentNode.insertBefore(
					viapoint.uiListItem, 
					nextViapoint.uiListItem.nextSibling);
			this._viapointsOrder.move(currentIndex, currentIndex + 1);

			if(currentIndex == 0) // was first
			{
				viapoint.moveUpImg.style.display = 'block';
				nextViapoint.moveUpImg.style.display = 'none';
				nextViapoint.setMarkerIcon("plugins/osrmclient/media/img/marker-green.png");
				if(this._viapointsOrder.length == 2)
				{
					viapoint.setMarkerIcon("plugins/osrmclient/media/img/marker.png");
				}else{
					viapoint.setMarkerIcon("plugins/osrmclient/media/img/marker-gold.png");
				}
			}
			if(currentIndex + 2 == this._viapointsOrder.length){
				viapoint.moveDownImg.style.display = 'none';
				nextViapoint.moveDownImg.style.display = 'block';
				viapoint.moveUpImg.style.display = 'block';
				viapoint.setMarkerIcon("plugins/osrmclient/media/img/marker.png");
				nextViapoint.setMarkerIcon("plugins/osrmclient/media/img/marker-gold.png");
			}

		}
	};
		
	this.getViapointIndex = function(viapointId)
	{
		result = -1;
		for(var i =0;i< this._viapointsOrder.length; ++i)
		{
			if(viapointId == this._viapointsOrder[i])
			{
				result = i;
				break;
			}
		}
		return result;
	};
	
	this.processRoute = function(response, parameters)
	{
		var encoded = response.route_geometry;
		var format = new OpenLayers.Format.EncodedPolyline();
		if(this.route_layer)
		{
			this.ushahidiMap._olMap.removeLayer(this.route_layer);
			this.route_layer = null;
		}
		var styleMap = new OpenLayers.StyleMap({'strokeWidth': 5,
							'strokeOpacity' : 0.4,
							'strokeColor': '#0033FF'});
		this.route_layer = new OpenLayers.Layer.Vector("routes", {styleMap: styleMap});
		var features = format.read(encoded);
		features.geometry.transform(Ushahidi.proj_4326, Ushahidi.proj_900913);
		this.route_layer.addFeatures(features);
		this.ushahidiMap._olMap.addLayer(this.route_layer);

	};
	
	this.getNearestPoint = function(viapoint)
	{
		var osrmClientObj = this;
		var coordinates = viapoint.getCoords();
		
		var reverseProvider = new OSRMClientReverse.MapquestProvider(
				coordinates.lat, 
				coordinates.lon);
		
		//callbackId, callback, requestUrl
		var callbackId = viapoint.id;
		var callback = function(pointInfoObj)
		{
			var result = reverseProvider.parseResult(pointInfoObj);
			viapoint.setName(result.displayName);
			osrmClientObj.callbacks.removeCallback(callbackId);
		};
		var callbackObject = new OSRM_Client.JSONP_Callback(
			callbackId,
			callback,
			reverseProvider.getReverseQuery()
		);
		this.callbacks.addCallback(callbackObject);
	};
	
	this.getRouteForViapoints = function()
	{
		var requestUrl = OSRM_Client.GLOBALS.OSRM_URL+
				"/" + OSRM_Client.CONST.VIAROUTE + "?";
		for(var i = 0; i < this._viapointsOrder.length; ++i)
		{
			var key = this._viapointsOrder[i];
			var coordinates = this._viapoints[key].getCoords();
			requestUrl += "loc="+coordinates.lat;
			requestUrl += ","+coordinates.lon+"&";
		}
		requestUrl += "jsonp=window.osrmClient.processRoute";
		
		if(this._viarouteScript)
		{
			this._viarouteScript.parentNode.removeChild(this._viarouteScript);
			this._viarouteScript = null;
		}
		this._viarouteScript = document.createElement("script");
		this._viarouteScript.type = 'text/javascript';
		this._viarouteScript.src = requestUrl;
		document.head.appendChild(this._viarouteScript);
	};
	
};
