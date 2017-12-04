/**
 * This file defines the job polling thread for the Integration Service
 * JS
 */
var keepPollThreadAlive = true;
var shouldContinuePolling = true;
var pollingThread = null;

var localLogPrefix = LOGGING_PREFIX + "poller-thread.js: ";

if ( !INTEGRATION_TARGET )  {
	var INTEGRATION_TARGET = API_USER ;
}
/**
 * This is the main method for the Autosys polling thread. Creation of this
 * thread is performed in the Autosys Integration Service's startup hook.
 * autosys-lifecycle.js --> apia_startup()
 *
 * The thread loop is controlled by two variables: keepPollThreadAlive : If
 * value is false then the loop does not continue. shouldContinuePolling:
 *
 */
function polling_method()
{

  while (keepPollThreadAlive)
  {
    try
    {
      if (shouldContinuePolling)
      {
		var retrieve = getEvents();
		var initiate = createEvent();
		var terminate = terminateEvents(retrieve);

        try
        {
          pollingThread.sleep(POLLING_INTERVAL_MS);

        }
        catch (e)
        {
          if (e instanceof java.lang.InterruptedException)
          {
            // we are not worried about interrupted sleep
			IALOG.info(localLogPrefix + "Polling thread was interrupted.");
          }
        }
      }
    }
    catch (ex)
    {
      IALOG.error(localLogPrefix + "Caught exception in polling_method: " + ex);
    }
  }
  // end while loop
  IALOG.info(localLogPrefix + "Polling thread is shut down.");
}

function getEvents(){

	var get = JSON.parse((XMIO.get(BASE_URL + "/api/xm/1/events?status=ACTIVE&propertyName="+ INTEGRATION_SERVICE_FIELD_NAME +"%23en&propertyValue=" + encodeURI(INTEGRATION_SERVICE_FIELD_VALUE) + "&offset=0&limit=1000", API_USER, XMIO.decryptFile(PASSWORD))).body);
	return get;
}

function createEvent(){

	var trigger = {};
	trigger.properties = {};
	trigger.recipients = {};
	trigger.properties.integration_service = INTEGRATION_SERVICE_FIELD_VALUE;
	trigger.recipients = [{"targetName": INTEGRATION_TARGET}];
	
	var post = XMIO.post(JSON.stringify(trigger), WEB_SERVICE_URL, API_USER, XMIO.decryptFile(PASSWORD));
}

function terminateEvents(events){
	var count = events['count'];

	//Only process events that if an Event exists
  	if (count > 0)
   	{	
		for (var i = 0; i < count; i++)
		{
			var eventID = events['data'][i]['eventId'];
			var terminate = {	"id": eventID,
								"status": "TERMINATED"
							};
			var post = XMIO.post(JSON.stringify(terminate), BASE_URL + TERMINATE_EVENT_LINK, API_USER, XMIO.decryptFile(PASSWORD));
		}				
	}
	else {
		return;
	}
}
