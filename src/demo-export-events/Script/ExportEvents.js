// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.748.0/runtimes/native1.12-tchmi/TcHmi.d.ts" />
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    var Functions;
    (function (/** @type {globalThis.TcHmi.Functions} */ Functions) {
        var demo_export_events;
        (function (demo_export_events) {
            function ExportEvents(Filter) {

                if (TcHmi.Server.isWebsocketReady()) {

                    // make request for all events whos domain is TcHmiEventLogger 
                    var request = {
                        'requestType': 'ReadWrite',
                        'commands': [
                            {
                                "commandOptions": ["SendErrorMessage"],
                                "symbol": "ListEvents",
                                "orderBy": "timeRaised DESC",
                                "filter": [
                                  {"path": "type","comparator": "!=","value": 2},
                                  {"logic": "AND"},
                                  [{"path": "domain", "comparator": "==","value": "TcHmiEventLogger"}]
                                ],
                                "filterMap": []
                            }
                        ]
                    };

                    // use either the passed in filter or use no filter
                    request.commands[0].filter = Filter || [];

                    // send the request
                    TcHmi.Server.request(request, function (data) {

                        if (data.error !== TcHmi.Errors.NONE) {
                            return;
                        }
                        var response = data.response;
                        if (!response || response.error !== undefined) {
                            return;
                        }
                        var command = response.commands[0];
                        if (!command || command.error !== undefined) {
                            return;
                        }
                        var events = command.readValue
                        if (!events) {
                            return;
                        }

                        // Uncomment here to see the content of an event.
                        //console.log(events[0]);

                        var csv = events.map(function (event) {
                            return [
                                event.domain,
                                event.localizedString,
                                event.name,
                                event.payload.domain,
                                event.payload.name,
                                event.payload.params.data,
                                event.payload.params.eventClass,
                                event.payload.params.eventClassName,
                                event.payload.params.eventId,                            
                                event.payload.params.numArguments,
                                event.payload.params.sourceId,
                                event.payload.params.sourceName,
                                event.payload.params.targetName,
                                event.payload.params.types,
                                event.payload.severity,
                                event.payload.timeRaised,
                                event.payloadType,
                                event.timeReceived
                            ];
                        })

                        // add the header fields
                        var header = [
                            "event.domain",
                            "event.localizedString",
                            "event.name",
                            "event.payload.domain",
                            "event.payload.name",
                            "event.payload.params.data",
                            "event.payload.params.eventClass",
                            "event.payload.params.eventClassName",
                            "event.payload.params.eventId",
                            "event.payload.params.numArguments",
                            "event.payload.params.sourceId",
                            "event.payload.params.sourceName",
                            "event.payload.params.targetName",
                            "event.payload.params.types",
                            "event.payload.severity",
                            "event.payload.timeRaised",
                            "event.payloadType",
                            "event.timeReceived"
                        ];

                        csv.unshift(header);

                        // convert to string
                        var csv_as_string = csv.join('\r\n');
                        var file = new Blob([csv_as_string]);
                        var url = URL.createObjectURL(file);
                        var element = document.createElement("a");

                        element.setAttribute('href', url);
                        element.setAttribute('download', "events.csv");
                        element.style.display = 'none';

                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                        setTimeout(function () { URL.revokeObjectURL(url); }, 1000 * 60);

                    });
                }


               




            }
            demo_export_events.ExportEvents = ExportEvents;
        })(demo_export_events = Functions.demo_export_events || (Functions.demo_export_events = {}));
        Functions.registerFunctionEx('ExportEvents', 'TcHmi.Functions.demo_export_events', demo_export_events.ExportEvents);
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi);