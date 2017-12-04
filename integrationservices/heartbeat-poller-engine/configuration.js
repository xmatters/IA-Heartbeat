// ----------------------------------------------------------------------------------------------------
// Configuration settings for an xMatters Heart Beat Monitoring
// ----------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------
// The url that will be used to inject events into xMatters.
// ----------------------------------------------------------------------------------------------------
WEB_SERVICE_URL = "https://adamwatson.eu1.xmatters.com/api/integration/1/functions/ecff6bc6-86db-4ba1-8c04-1f1b32041729/triggers";

// ----------------------------------------------------------------------------------------------------
// The API URL detail
// Ensure that the BASE_URL does not end with a slash "/" otherwise this will impact the api calls
// ----------------------------------------------------------------------------------------------------
BASE_URL = "https://adamwatson.eu1.xmatters.com"
TERMINATE_EVENT_LINK = "/api/xm/1/events/";

// ----------------------------------------------------------------------------------------------------
// Polling Configuration -- default to 5 minutes
// ----------------------------------------------------------------------------------------------------
//var POLLING_INTERVAL_MS = 300000;
var POLLING_INTERVAL_MS = 60000;

//----------------------------------------------------------------------------------------------------
// Integration Name -- this is also used in the subscription
//----------------------------------------------------------------------------------------------------
INTEGRATION_SERVICE_FIELD_NAME = "integration_service";
INTEGRATION_SERVICE_FIELD_VALUE = "Agent 1 IA Monitoring";

//---------------------------------
// Event Target, recomend setting this to an empty group.  Leave blank to target the API_USER bellow
// ---------------------------------
INTEGRATION_TARGET = "go.nowhere";

// ----------------------------------------------------------------------------------------------------
// Logging Configuration
// ----------------------------------------------------------------------------------------------------
LOGGING_PREFIX = "IA Monitoring Polling Engine: ";

//----------------------------------------------------------------------------------------------------
//The username and password used to authenticate the request to xMatters.
//The PASSWORD value is a path to a file where the
//user's password should be encrypted using the iapassword.sh utility.
//Please see the integration agent documentation for instructions.
//----------------------------------------------------------------------------------------------------
API_USER = "heartbeat-poller-engine";
PASSWORD = "integrationservices/heartbeat-poller-engine/.initiatorpasswd";
