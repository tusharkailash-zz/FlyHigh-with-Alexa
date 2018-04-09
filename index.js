var http = require("https");
//var sessionAttributes = {};
//New
exports.handler = (event, context) => {

    try {

        if (event.session.new) {
            // New Session
            console.log("NEW SESSION");
        }


        switch (event.request.type) {
            case "LaunchRequest":
                // Launch Request
                console.log("LAUNCH REQUEST")
                //var Access = event.session.user.accessToken;
                context.succeed(
                    generateResponse(
                        buildResponse("Hello. Welcome to Flyhigh. Would you like to search for a flight or check status of your flight?", false),//false = ask, true = tell(endsession)
                        {}
                    )
                )

                break;

            case "IntentRequest":
                // Intent Request
                if (event.request.intent.name == "SearchFlight"){
                    console.log("search flight intent")

                    context.succeed(
                        generateResponse(
                            buildResponse("Hi, Please tell me your source and destination.", false),//false = ask, true = tell(endsession)
                            {}  // we aren't passing any slots. So blank.
                        )
                    )
                }

                if (event.request.intent.name == "GetFlight") {
                    var Source = event.request.intent.slots.Source.value;
                    var Destination = event.request.intent.slots.Destination.value;
                    var airport_json = [
                        {
                            "city": "Aberdeen",
                            "faa": "ABR"
                        },
                        {
                            "city": "San Francisco",
                            "faa": "SFO"
                        },
                        {
                            "city": "Atlanta",
                            "faa": "ATL"
                        },
                        {
                            "city": "Washingnton D.C.",
                            "faa": "DCA"
                        },
                        {
                            "city": "Boston",
                            "faa": "BOS"
                        },
                        {
                            "city": "Charlotte",
                            "faa": "CLT"
                        },
                        {
                            "city": "Chicago",
                            "faa": "ORD"
                        },
                        {
                            "city": "Denver",
                            "faa": "DEN"
                        },
                        {
                            "city": "Detroit",
                            "faa": "DTW"
                        },
                        {
                            "city": "Miami",
                            "faa": "MIA"
                        },
                        {
                            "city": "Honolulu",
                            "faa": "HNL"
                        },
                        {
                            "city": "Las Vegas",
                            "faa": "LAS"
                        },
                        {
                            "city": "Los Angeles",
                            "faa": "LAX"
                        },
                        {
                            "city": "New York",
                            "faa": "JFK"
                        },
                        {
                            "city": "Orlando",
                            "faa": "MCO"
                        },
                        {
                            "city": "Philadelphia",
                            "faa": "PHL"
                        },
                        {
                            "city": "Phoenix",
                            "faa": "PHX"
                        },
                        {
                            "city": "Portland",
                            "faa": "PWM"
                        },
                        {
                            "city": "Salt Lake City",
                            "faa": "SLC"
                        },
                        {
                            "city": "San Diego",
                            "faa": "SAN"
                        },
                        {
                            "city": "Seattle",
                            "faa": "BFI"
                        },
                        {
                            "city": "Tampa",
                            "faa": "TPA"
                        },
                        {
                            "city": "San Jose",
                            "faa": "SJC"
                        },
                        {
                            "city": "Oakland",
                            "faa": "OAK"
                        },
                        {
                            "city": "Austin",
                            "faa": "AUS"
                        },
                        {
                            "city": "Pittsburg",
                            "faa": "PIT"
                        },
                        {
                            "city": "Columbus",
                            "faa": "CSG"
                        }
                    ];

                    var src_faa,dst_faa;

                    for (var i in airport_json) {
                        if (Source === airport_json[i].city){
                            src_faa = airport_json[i].faa;
                            console.log(src_faa);
                        }
                        if (Destination === airport_json[i].city){
                            dst_faa = airport_json[i].faa;
                            console.log(dst_faa);
                        }
                    }


                    context.succeed(
                        generateResponse(
                            buildResponse("Please tell me are you travelling one way or two way?", false),//false = ask, true = tell(endsession)
                            {Source:src_faa,Destination:dst_faa}
                        )
                    )
                    //sessionAttributes = {};


                }
                if (event.request.intent.name == "TravelIntentType") {
                    //var sessionAttributes = session.attributes;
                    console.log('TraveltypeIntent Request');
                    var TravelType = event.request.intent.slots.TravelType.value;
                    var Destination = event.session.attributes.Destination;
                    var Source = event.session.attributes.Source;
                    if(TravelType === '1') {
                        //this.emit(':ask', 'Please tell me your travel date');
                        context.succeed(
                            generateResponse(
                                buildResponse("Please tell me your travel date", false),//false = ask, true = tell(endsession)
                                {TravelType:TravelType,Source:Source,Destination:Destination}
                            )
                        )
                        //this.emit('oneway');
                    }
                    else if(TravelType === '2') {
                        context.succeed(
                            generateResponse(
                                buildResponse("Please tell me start date and return date", false),//false = ask, true = tell(endsession)
                                {TravelType:TravelType,Source:Source,Destination:Destination}
                            )
                        )
                    }
                }
// 			"sessionAttributes": {
//     "Destination": "Seattle",
//     "TravelType": "oneway",
//     "Source": "Boston"
//   }
                if (event.request.intent.name == "oneway") {
                    var TravelDate = event.request.intent.slots.TravelDate.value;
                    var TravelType = event.session.attributes.TravelType;
                    var Destination = event.session.attributes.Destination;
                    var Source = event.session.attributes.Source;

                    var options = {
                        "method": "POST",
                        "hostname": "www.googleapis.com",
                        "port": null,
                        "path": "/qpxExpress/v1/trips/search?key=AIzaSyBvF1pNL7Mm3N6KK6dI05j4Wey-b7t1W40",
                        "headers": {
                            "content-type": "application/json"
                        }
                    };

                    var req = http.request(options, function (res) {
                        var chunks = [];

                        res.on("data", function (chunk) {
                            chunks.push(chunk);
                        })

                        res.on("end", function () {
                            var body = Buffer.concat(chunks);
                            var jbody = body.toString();
                            jbody = JSON.parse(jbody);
                            var cheapest_price = jbody.trips.tripOption[0].saleTotal;
                            var destination_airport = jbody.trips.data.airport[0].name; //
                            var origin_airport = jbody.trips.data.airport[1].name;  //
                            var aircraft = jbody.trips.data.aircraft[0].name;   //
                            var flight_carrier = jbody.trips.data.carrier[0].name;  //
                            var departure = jbody.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime; //
                            var flight_num = jbody.trips.tripOption[0].slice[0].segment[0].flight.number;   //
                            var flight_code = jbody.trips.data.carrier[0].code; //

                            var departarray = departure.split("T");
                            var time_array = departarray[1].split("-");
                            var departure_time= time_array[0];
                            //console.log(jbody.trips.tripOption[0].saleTotal);
                            //strr = JSON.stringify(jbody.trips.tripOption[0].saleTotal);
                            //printstr(strr, Source, Destination);
                            context.succeed(
                                generateResponse(
                                    buildResponse("The most economic flight is at the price of " + cheapest_price + ". The flight is " +flight_carrier + ", flight number "+ flight_code+ " " + flight_num+ ". It is a " + aircraft +" originating from " + origin_airport + " airport and destined to " + destination_airport + " airport. It departs on " + TravelDate + " at " + departure_time+ ".",true),//"You are travelling on " + TravelDate + " , from " + Source + " to " + Destination + " " + TravelType, true),//false = ask, true = tell(endsession)
                                    {}
                                )
                            )

                        });
                    });

                    req.write(JSON.stringify({ request:
                        { slice: [ { origin: Source, destination: Destination, date: TravelDate } ],
                            passengers:
                                { adultCount: 1,
                                    infantInLapCount: 0,
                                    infantInSeatCount: 0,
                                    childCount: 0,
                                    seniorCount: 0 },
                            solutions: 1,
                            refundable: false } }));
                    req.end();


                }
                if (event.request.intent.name == "twoway") {
                    var TravelDate = event.request.intent.slots.TravelDate.value;
                    var ReturnDate = event.request.intent.slots.ReturnDate.value;
                    var TravelType = event.session.attributes.TravelType;
                    var Destination = event.session.attributes.Destination;
                    var Source = event.session.attributes.Source;

                    var options = {
                        "method": "POST",
                        "hostname": "www.googleapis.com",
                        "port": null,
                        "path": "/qpxExpress/v1/trips/search?key=AIzaSyBvF1pNL7Mm3N6KK6dI05j4Wey-b7t1W40",
                        "headers": {
                            "content-type": "application/json"
                        }
                    };

                    var req = http.request(options, function (res) {
                        var chunks = [];

                        res.on("data", function (chunk) {
                            chunks.push(chunk);
                        })

                        res.on("end", function () {
                            var body = Buffer.concat(chunks);
                            var jbody = body.toString();
                            jbody = JSON.parse(jbody);
                            var cheapest_price = jbody.trips.tripOption[0].saleTotal;
                            var destination_airport = jbody.trips.data.airport[0].name; //
                            var origin_airport = jbody.trips.data.airport[1].name;  //
                            //var aircraft = jbody.trips.data.aircraft[0].name;   //
                            var flight_carrier = jbody.trips.data.carrier[0].name;  //
                            var departure = jbody.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime; //
                            var flight_num = jbody.trips.tripOption[0].slice[0].segment[0].flight.number;   //
                            var flight_code = jbody.trips.data.carrier[0].code; //
                            var return_flight_num = jbody.trips.tripOption[0].slice[1].segment[0].flight.number;
                            var departure2 = jbody.trips.tripOption[0].slice[1].segment[0].leg[0].departureTime;

                            var departarray = departure.split("T");
                            var time_array = departarray[1].split("-");
                            var departure_time= time_array[0];

                            var departarray2 = departure2.split("T");
                            var time_array2 = departarray2[1].split("-");
                            var departure_time2= time_array2[0];
                            context.succeed(
                                generateResponse(
                                    buildResponse("The most economic trip is at the price of " + cheapest_price + ". The flights operate between the airports "+ origin_airport+ " and " + destination_airport+ ". The flight, from " + Source + " to " + Destination + ", is " + flight_carrier + ", " + flight_code+ " " + flight_num+" on "+ TravelDate+ " at "+ departure_time+ ". The return flight, from " + Destination + " to " + Source + ", is " + flight_carrier + ", " + flight_code+ " " + return_flight_num+" on " + ReturnDate +" at "+departure_time2 +".", true),
                                    {}
                                )
                            );
                        });
                    });

                    req.write(JSON.stringify({ request:
                        { slice: [ { origin: Source, destination: Destination, date: TravelDate },{ origin: Destination, destination: Source, date: ReturnDate } ],
                            passengers:
                                { adultCount: 1,
                                    infantInLapCount: 0,
                                    infantInSeatCount: 0,
                                    childCount: 0,
                                    seniorCount: 0 },
                            solutions: 1,
                            refundable: false } }));
                    req.end();
                    // context.succeed(
                    //     generateResponse(
                    //         buildResponse("You are travelling on " + TravelDate + " returning on " + ReturnDate + " , from " + Source + " to " + Destination + " " + TravelType, true),//false = ask, true = tell(endsession)
                    //         {}
                    //     )
                    // )
                }
                /*============================================Flight Schedule Feature========================================*/

                if (event.request.intent.name == "SearchTimings") {
                    context.succeed(
                        generateResponse(
                            buildResponse("Please tell me your flight id and flight number. For example, you can say my flight number is AA 1234", false),//false = ask, true = tell(endsession)
                            {}  //As there are no slots
                        )
                    )
                }

                if (event.request.intent.name == "GetFlightDay") {
                    var flight_id = event.request.intent.slots.flight_id.value;
                    var flight_num = event.request.intent.slots.flight_num.value;
                    context.succeed(
                        generateResponse(
                            buildResponse("Please tell me which day are you travelling. For example, you can say - I am travelling tomorrow or 'on Monday'", false),//false = ask, true = tell(endsession)
                            {flight_id : flight_id, flight_num : flight_num}
                        )
                    )
                }

                if (event.request.intent.name == "FlightTiming") {
                    var flight_id = event.session.attributes.flight_id;   //As this is now in session attributes and not in slots.
                    //var flight_num = parseInt(event.session.attributes.flight_num);
                    var flight_num = event.session.attributes.flight_num;
                    var day = event.request.intent.slots.Days.value;
                    // var today_date = "";
                    var today = new Date();
                    var dd = today.getDate();      //1 to 31
                    var flight_date = new Date();
                    var mm = today.getMonth()+1;   //January is 0!
                    var yyyy = today.getFullYear();


                    // if(dd<10) {
                    //     dd = '0'+dd
                    // }
                    //
                    // if(mm<10) {
                    //     mm = '0'+mm
                    // }


                    var Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    if (day === "Today"){
                        today = mm + '-' + dd + '-' + yyyy;
                        flight_date = today;
                        console.log("the flight date is ", flight_date);

                    }
                    if (day === "Tomorrow") {
                        var date = flight_date.getDate();
                        date = date + 1;
                        flight_date = mm + '-' + date +  '-' + yyyy;
                        console.log("the flight date is ", flight_date);

                    }
                    if (day === "Day after tomorrow"){
                        var date = flight_date.getDate();
                        date = date + 2;
                        flight_date = mm + '-' + date +  '-' + yyyy;
                        console.log("the flight date is ", flight_date);
                    }

                    for (var d = 0; d <= Days.length; d++) {
                        if (day === Days[d]) {
                            if (d <= today.getDay()) {

                                var date = flight_date.getDate();
                                date = date + 7 - (today.getDay() - d);
                                flight_date = mm + '-' + date + '-' + yyyy;
                                console.log("the flight date is ", flight_date);
                            }

                            else if (d > today.getDay()) {

                                var date = flight_date.getDate();
                                date = date + (d - today.getDay());
                                flight_date = mm + '-' + date + '-' + yyyy;
                                console.log("the flight date is ", flight_date);
                            }
                        }
                    }
                    context.succeed(
                        generateResponse(
                            buildResponse("Your flight " +  flight_id + flight_num + " departure is on schedule " + flight_date + " at 1500 hours. ", true),//false = ask, true = tell(endsession)
                            {}
                        )
                    )
                }
                ////////////////////////////////////////////////////////////////////////////////////
                // var today = new Date();
                // var dd = today.getDate();      //1 to 31
                // var flight_date = new Date();
                // var mm = today.getMonth()+1;   //January is 0!
                // var yyyy = today.getFullYear();


                // // if(dd<10) {
                // //     dd = '0'+dd
                // // }
                // //
                // // if(mm<10) {
                // //     mm = '0'+mm
                // // }


                // var Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                // if (day === "Today"){
                //     today = mm + '-' + dd + '-' + yyyy;
                //     flight_date = today;
                //     console.log("the flight date is ", flight_date);
                //     context.succeed(
                //         generateResponse(
                //             buildResponse("Your flight " +  flight_id + " " + flight_num + " departure is on schedule, " + flight_date + " at 1500 hours. ", true),//false = ask, true = tell(endsession)
                //             {}
                //         )
                //     )

                // }
                // if (day === "Tomorrow") {
                //     var date = flight_date.getDate();
                //     date = date + 1;
                //     flight_date = mm + '-' + date +  '-' + yyyy;
                //     console.log("the flight date is ", flight_date);
                //     context.succeed(
                //         generateResponse(
                //             buildResponse("Your flight " +  flight_id + " " + flight_num + " departure is on schedule, " + flight_date + " at 1500 hours.", true),//false = ask, true = tell(endsession)
                //             {}
                //         )
                //     )

                // }
                // if (day === "Day after tomorrow"){
                //     var date = flight_date.getDate();
                //     date = date + 2;
                //     flight_date = mm + '-' + date +  '-' + yyyy;
                //     console.log("the flight date is ", flight_date);
                //     context.succeed(
                //         generateResponse(
                //             buildResponse("Your flight " +  flight_id + " " + flight_num + " departure is on schedule, " + flight_date + " at 1500 hours.", true),//false = ask, true = tell(endsession)
                //             {}
                //         )
                //     )
                // }

                // for (var d = 0; d <= Days.length; d++) {
                //     if (day === Days[d]) {
                //         if (d <= today.getDay()) {

                //             var date = flight_date.getDate();
                //             date = date + 7 - (today.getDay() - d);
                //             flight_date = mm + '-' + date + '-' + yyyy;
                //             console.log("the flight date is ", flight_date);
                //             context.succeed(
                //                 generateResponse(
                //                     buildResponse("Your flight " +  flight_id + " " + flight_num + " departure is on schedule, " + flight_date + " at 1500 hours.", true),//false = ask, true = tell(endsession)
                //                     {}
                //                 )
                //             )
                //         }
                //         else if (d > today.getDay()) {

                //             var date = flight_date.getDate();
                //             date = date + (d - today.getDay());
                //             flight_date = mm + '-' + date + '-' + yyyy;
                //             console.log("the flight date is ", flight_date);
                //             context.succeed(
                //                 generateResponse(
                //                     buildResponse("Your flight " +  flight_id + " " + flight_num + " departure is on schedule, " + flight_date + " at 1500 hours.", true),//false = ask, true = tell(endsession)
                //                     {}
                //                 )
                //             )
                //         }
                //     }
                // }

                // context.succeed(
                //     generateResponse(
                //         buildResponse("Your flight" +  flight_id + " " + flight_num + "departure is on schedule, " + flight_date + "at 1500 hours", true),//false = ask, true = tell(endsession)
                //         {}
                //     )
                // )
                // }
                if (event.request.intent.name == "AMAZON.HelpIntent"){
                    context.succeed(
                        generateResponse(
                            buildResponse("Hello, Flyhigh helps you search different flights or help you check the flight status. You can simply tell 'Alexa, I would like to look for flights' or 'Alexa, Tell me my flight departure time'",true),//false = ask, true = tell(endsession)
                            {}
                        )
                    )
                }
                if (event.request.intent.name == "Stop_Intent"){
                    context.succeed(
                        generateResponse(
                            buildResponse("Thank you! See you soon.",true),//false = ask, true = tell(endsession)
                            {}
                        )
                    )
                }
                break;
            default:
                context.succeed(
                    generateResponse(
                        buildResponse( 'Sorry, please tell me, how can i help?', false),
                        {}
                    )
                );
                context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);
        }

    } catch(error) { context.fail(`Exception: ${error}`) }

}


buildResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },

        shouldEndSession: shouldEndSession
    }
}

generateResponse = (speechletResponse, sessionAttributes) => {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}

