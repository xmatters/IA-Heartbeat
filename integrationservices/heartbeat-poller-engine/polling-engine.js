// xMatters REB Support
load("lib/integrationservices/javascript/event.js");

// Integration-specific JavaScript files
load("integrationservices/heartbeat-poller-engine/configuration.js");
load("integrationservices/heartbeat-poller-engine/apia-lifecycle.js");
load("integrationservices/heartbeat-poller-engine/poller-thread.js");

function apia_remapped_data() {
    return {
        "priority" : "priority"
    }
}

function apia_event(form)
{
    // APClient.bin injection has been converted to a JavaScript object
    // that can be serialized and sent to xMatters.
    IALOG.info(LOGGING_PREFIX + JSON.stringify(form, null, 2));

    //Un-comment below to update the injected value of the property city.
    //form.properties.city = "Victoria";

    return form;
}

function apia_callback(msg)
{
    var str = "Received message from xMatters:\n";
    str += "Incident: " + msg.incident_id;
    str += "\nEvent Id: " + msg.eventidentifier;
    str += "\nCallback Type: " + msg.xmatters_callback_type;
    IALOG.info(LOGGING_PREFIX + str);
}

function apia_http(httpRequestProperties, httpResponse)
{
    // This example demonstrates converting an XML document sent to the Integration Agent
    // into a JavaScript object.
    // Since input XML documents can vary dramatically, some techniques are presented for
    // accessing the data and converting it to JSON that can be sent to xMatters.

    // 1. Convert payload to E4X XML object
    var data = XMUtil.parseXML(httpRequestProperties.getProperty("REQUEST_BODY"));

    // 2. Get a JS object with callback properties based on CALLBACK value in configuration.js
    var event = XMUtil.createEventTemplate();
    IALOG.info(LOGGING_PREFIX + "Initial event template:\n" + JSON.stringify(event, null, 2)); // pretty print json

    // 3. Create properties
    event.properties = {};
    IALOG.info(LOGGING_PREFIX + "String to be converted to array: " + String(data.*::properties.*::building));
    var strippedQuotes = String(data.*::properties.*::building).replace(/\"/g, ''); //Strip double quotes
    IALOG.info(LOGGING_PREFIX + "Stripped quotes: " + strippedQuotes);
    var array = strippedQuotes.split(','); //Split the string into an array
    array = array.map(function(item){
        return item.trim();
    });
    IALOG.info(LOGGING_PREFIX + "Array: " + JSON.stringify(array));
    event.properties.building = array; // .*:: syntax supports all namespaces
    event.properties.city = String(data.*::properties.*::city);
    IALOG.info(LOGGING_PREFIX + "Properties added to event:\n" + JSON.stringify(event, null, 2));

    // 4. Deduplicate based on form properties
    if (XMUtil.deduplicator.isDuplicate(event.properties)) {
        // Discard message, adding a warning note to the log
        XMUtil.deduplicate(event.properties);
        return;
    }

    // 5. Create recipients
    event.recipients = [];
    var recipients = data.*::recipients.*::targetName; // This is an XMLList
    for each (var recipient in recipients) {
        var recipientAsJavascriptObject = specificXmlParsingLogic(recipient);
        event.recipients.push(recipientAsJavascriptObject); // add to array
    }
    IALOG.info(LOGGING_PREFIX + "Recipients added to event:\n" + JSON.stringify(event, null, 2));

    // 6. Send to xMatters
    XMIO.post(JSON.stringify(event)); // No need for formatting

    // 7. If the post succeeded, register the event with the deduplication filter.
    XMUtil.deduplicator.incrementCount(event.properties);
}

function specificXmlParsingLogic(xmlText)
{
    // This code demonstrates converting the text value of:
    //     <targetName>bsmith</targetName>
    //   or
    //     <targetName>tsanderson, devices: ["Email", "Voice Phone"]</targetName>
    // To:
    //     { "targetName": "bsmith" }
    //   or
    //     {
    //       "targetName": "tsanderson",
    //       "devices": ["Email", "Voice Phone"]
    //     }

    var index = String(xmlText).indexOf(','),
         deviceFilterPresent = (index > -1);
    var jsObj = {};

    if (deviceFilterPresent) {
        var targetName = xmlText.slice(0, index);
        jsObj.targetName = targetName;

        var deviceArray = xmlText.slice(index+1).trim().split(':'), // Strip ,
            key = deviceArray[0].trim(),
            value = JSON.parse(deviceArray[1].trim());
        jsObj[key] = value;
    }
    else {
        jsObj.targetName = String(xmlText);
    }

    return jsObj;
}
