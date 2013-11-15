var OSRMClientReverse = {};

OSRMClientReverse.ReverseResult = function(lat, lon)
{
	this.lat = lat;
	this.lon = lon;
	this.displayName = "";
};

OSRMClientReverse.MapquestProvider = function(lat,lon)
{
	this.lat = lat;
	this.lon = lon;
	this._providerUrl = "http://open.mapquestapi.com/nominatim/v1/reverse.php?format=json";
	this._jsonp_param = "json_callback";

	this.getReverseQuery = function()
	{
		return this._providerUrl+"&lat="+this.lat+"&lon="+this.lon+"&"+this._jsonp_param+"=";
	};
	
	this.parseResult = function(queryResult)
	{
		var result = new OSRMClientReverse.ReverseResult(this.lat, this.lon);
		result.displayName = queryResult.display_name;
		return result;
	};
};

