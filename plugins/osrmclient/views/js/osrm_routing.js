OSRM_Client.nearestPoint = function()
{
	this.getNearestPoint = function(marker, callback)
	{
		alert("getNearestPoint executed.");
		/*var requestUrl = OSRM_Client.GLOBALS.OSRM_URL+
				"/" + OSRM_Client.CONST.NEAREST;
		this.get*/
	};
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
		var uiListItemNameSpan = document.createElement("span");
		uiListItemNameSpan.innerHTML = "" + this.name;
		if(this.uiListItem.firstChild) {
			this.uiListItem.insertBefore(uiListItemNameSpan,this.uiListItem.firstChild);
		} else {
			this.uiListItem.appendChild(uiListItemNameSpan);
		}
		
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
		var str_latlon = viapoint.latlon.lat+":"+viapoint.latlon.lon;
		if(!this._viapoints[str_latlon]){
			this.mapMarkersLayer.addMarker(viapoint.marker);
			this.addViapoint2Container(viapoint);
			this._viapoints[str_latlon] = viapoint;
			if(Object.keys(this._viapoints).length > 1)
			{
				this.getRouteForViapoints(this._viapoints);
			}
		}
	}
	
	this.removeViapoint = function(viapoint, updateRoute)
	{
		var str_latlon = viapoint.latlon.lat+":"+viapoint.latlon.lon;
		if(this._viapoints[str_latlon]){
			this.mapMarkersLayer.removeMarker(viapoint.marker);
			viapoint.uiListItem.parentNode.removeChild(viapoint.uiListItem);
			delete this._viapoints[str_latlon];

			if(updateRoute==true && Object.keys(this._viapoints).length > 1)
			{
				this.getRouteForViapoints(this._viapoints);
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
		viapoint.uiListItem = document.createElement("li");
		var uiListItemAnchor = document.createElement("a");
		uiListItemAnchor.href = "#"
		
		var uiListItemNameSpan = document.createElement("span");
		uiListItemNameSpan.innerHTML = "lat:" + 
			parseFloat(viapoint.getCoords().lat).toFixed(
				OSRM_Client.CONST.LATLON_PRECISION
			) + ", lon:" +
			parseFloat(viapoint.getCoords().lon).toFixed(
				OSRM_Client.CONST.LATLON_PRECISION
			);
		
		uiListItemAnchor.appendChild(uiListItemNameSpan);
		viapoint.uiListItem.appendChild(uiListItemAnchor);
		
		this.pointsContainerObj.appendChild(viapoint.uiListItem);
	}
	
	this.processVaypointNearestResponse = function(response, parameters)
	{
		//alert(JSON.stringify(response));
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
	
	this.getRouteForViapoints = function(viapoints)
	{
		var requestUrl = OSRM_Client.GLOBALS.OSRM_URL+
				"/" + OSRM_Client.CONST.VIAROUTE + "?";
		for(var key in viapoints)
		{
			var coordinates = viapoints[key].getCoords();
			requestUrl += "loc="+coordinates.lat;
			requestUrl += ","+coordinates.lon+"&";
		}
		requestUrl += "jsonp=window.osrmClient.processRoute";
		
		if(this._viarouteScript)
		{
			this._viarouteScript.remove();
		}
		this._viarouteScript = document.createElement("script");
		this._viarouteScript.type = 'text/javascript';
		this._viarouteScript.src = requestUrl;
		document.head.appendChild(this._viarouteScript);
	};
	
};
