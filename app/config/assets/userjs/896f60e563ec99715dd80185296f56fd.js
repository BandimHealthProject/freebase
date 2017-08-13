
// A map of table ids to their instance columns (or _id if we couldn't pull it)
var display_cols = {"refrigerators": "tracking_id", "health_facility": "facility_name", "m_logs": "date_serviced", "refrigerator_types": "model_id"}
// List of tables to edit with formgen. If a table isn't found in this list, we edit it with survey instead
var allowed_tables = ["refrigerators", "health_facility", "m_logs", "refrigerator_types"];
var customJsOl = function customJsOl() {
	
	main_col = "refs_tracking_number";
	colmap = [
		{"column": 'refs_tracking_number', "display_name": "Tracking Number: "},
		{"column": 'date_serviced', "callback": function(element, columnValue, data) { return "<b>" + _tu("Date Serviced") + ":</b> " + columnValue.split("T")[0]; }},
		{"column": 'notes', "callback": function(element, columnValue, data) {
			if (columnValue == null || columnValue == "null") return "";
			return "<b>" + _tu("Notes: ") + "</b>" + columnValue;
		}}
	]
	global_join = "refrigerators ON refrigerators.refrigerator_id = m_logs.refrigerator_id"
	global_which_cols_to_select = "*, refrigerators.tracking_id AS refs_tracking_number"

}
