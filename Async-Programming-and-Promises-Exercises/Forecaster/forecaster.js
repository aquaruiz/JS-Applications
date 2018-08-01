function attachEvents() {
    const URI = "https://judgetests.firebaseio.com/";
    const weatherSymbols = {
        Sunny: "&#x2600;",
        "Partly sunny":	"&#x26C5;",
        Overcast: "&#x2601;",
        Rain: "&#x2614;",
        Degrees: "&#176;"
    };

    $("#submit").on("click", loadWeather);

    function loadWeather() {
        let searchedItemContainer = $("#location");
        let searchedItem = searchedItemContainer.val();
        // searchedItemContainer.val("");

        let getCodeRequest = {
            method: "GET",
            url: URI + `locations.json`
        };

        $.ajax(getCodeRequest)
            .then(loadForecasts)
            .catch(handleError);

        function loadForecasts(response) {
            let searchedTownCode = response.filter(e => e.name ===searchedItem)[0].code;

            let getCurrConditionRequest = {
                method: "GET",
                url: URI + `forecast/today/${searchedTownCode}.json`
            };

            let get3DaysForRequest = {
                method: "GET",
                url: URI + `forecast/upcoming/${searchedTownCode}.json`
            };

            Promise.all([$.ajax(getCurrConditionRequest), $.ajax(get3DaysForRequest)])
                .then(displayForecasts)
                .catch(handleError);

            function displayForecasts([currForecastResponse, nextDaysResponse]) {
                let currForecastContainer = $("#current");
                $("#forecast").css("display", "block");
                let moreDaysWeatherContainer = $("#upcoming");

                // Todays forecast
                let symbolSpan = $("<span>")
                    .addClass("condition symbol")
                    .html(weatherSymbols[currForecastResponse.forecast.condition]);

                let textPartSpan = $("<span>")
                    .addClass("condition")
                    .append($("<span>")
                        .addClass("forecast-data")
                        .text(currForecastResponse.name))
                    .append($("<span>")
                        .addClass("forecast-data")
                        .html(currForecastResponse.forecast.low + weatherSymbols.Degrees + "/"
                            + currForecastResponse.forecast.high + weatherSymbols.Degrees))
                    .append($("<span>")
                        .addClass("forecast-data")
                        .text(currForecastResponse.forecast.condition));

                currForecastContainer.append(symbolSpan, textPartSpan);

                // 3-days forecast
                for (let forecast of nextDaysResponse.forecast) {
                    let containerSpan = $("<span>")
                        .addClass("upcoming");

                    let tommorowForecast = containerSpan
                        .append($("<span>")
                            .addClass("symbol")
                            .html(weatherSymbols[forecast.condition]))
                        .append($("<span>")
                            .addClass("forecast-data")
                            .html(forecast.low + weatherSymbols.Degrees + "/"
                                + forecast.high + weatherSymbols.Degrees))
                        .append($("<span>")
                            .addClass("forecast-data")
                            .text(forecast.condition));

                    moreDaysWeatherContainer.append(containerSpan);
                }


                console.log(nextDaysResponse);
            }
        }

        function handleError(err) {
            let currForecastContainer = $("#current");
            currForecastContainer.text("Error");
            console.log(err);
        }
    }
}