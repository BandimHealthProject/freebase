
			var metadata = {};
			var list_views = {};
			var menu = ["Empty menu!", null, []];
			// BEGIN CONFIG
			
list_views = {
	"health_facility": "config/assets/aa_health_facility_list.html",
	"refrigerators": "config/assets/aa_refrigerators_list.html",
}

	var hash = window.location.hash.substr(1);
	var val = ""
	if (hash.indexOf(":") == -1) {
		val = odkCommon.getSessionVariable("val");
	} else {
		val = hash.split(":")[0];
		window.location.hash = "#" + hash.split(":").slice(1)
	}
	odkCommon.setSessionVariable("val", val);
	menu = {"label": "Loading...", "type": "menu", "contents": []};
	
var subquery = "(SELECT date_serviced FROM m_logs WHERE m_logs.refrigerator_id = refrigerators.refrigerator_id ORDER BY date_serviced DESC LIMIT 1)"
menu = {"label": val, "type": "menu", "contents": [
	{"label": "View All Health Facilities", "type": "js", "function": function() {
		var where = "admin_region = ?"
		odkTables.openTableToMapView(null, "health_facility", where, [val], "config/assets/hack_for_hf_map.html" + "#health_facility/" + where + "/" + val);
	}},
	{"label": "View All Refrigerators", "type": "static", "table": "refrigerators", "query": "SELECT * FROM refrigerators JOIN health_facility ON refrigerators.facility_row_id = health_facility._id JOIN refrigerator_types ON refrigerators.model_row_id = refrigerator_types._id WHERE health_facility.admin_region = ?", "args": [val], "explanation": "refrigerators in health facilities in the admin region ?"},
	{"label": "View All Refrigerators Not Serviced In The Last Six Months", "type": "static", "table": "refrigerators", "query": "SELECT * FROM refrigerators JOIN health_facility ON refrigerators.facility_row_id = health_facility._id JOIN refrigerator_types ON refrigerators.model_row_id = refrigerator_types._id WHERE health_facility.admin_region = ? AND ("+subquery+" IS NULL OR (julianday(datetime('now')) - julianday("+subquery+")) > (6 * 30))", "args": [val], "explanation": "refrigerators in health facilities in the admin region ? that haven't been serviced in the last 180 days or have no service records"},
	{"label": "Filter By Type", "type": "html", "page": "config/assets/admin_region_filter.html#" + val + ":"}
]};
		
			// END CONFIG
			