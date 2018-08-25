function renderHomeView(listings) {
    let listingContainer = $("#listings");
    listingContainer.empty();

    if (listings.length === 0) {
        let p = $("<p>")
            .addClass("no-cars")
            .text("No cars in database.");

        listingContainer.append(p);
        return;
    }

    for (const listing of listings) {
        let carSubInfo = $("<div>")
            .attr("id", "data-info")
            .append($("<h3>")
                .text(`Seller: ${listing.seller}`))
            .append($("<h3>")
                .text(`Fuel: ${listing.fuel}`))
            .append($("<h3>")
                .text(`Year: ${listing.year}`))
            .append($("<h3>")
                .text(`Price: ${listing.price} $`));

        let carMenuList = $("<div>")
            .attr("id", "data-buttons");

        if (listing.seller === sessionStorage.getItem("username")) {
            carMenuList
                .append($("<ul>")
                    .append($("<li>")
                        .addClass("action")
                        .append($("<a>")
                            .addClass("button-carDetails")
                            .attr("href", "#")
                            .text("Details")
                            .on("click", function () {
                                renderDetailsView(listing);
                            })))
                    .append($("<li>")
                        .addClass("action")
                        .append($("<a>")
                            .addClass("button-carDetails")
                            .attr("href", "#")
                            .text("Edit")
                            .on("click", function () {
                                renderEditView(listing);
                            })))
                    .append($("<li>")
                        .addClass("action")
                        .append($("<a>")
                            .addClass("button-carDetails")
                            .attr("href", "#")
                            .text("Delete")
                            .on("click", function () {
                                kinveyRequester.removeCar(listing._id);
                            }))));
        } else {
            carMenuList.append($("<ul>")
                .append($("<li>")
                    .addClass("action")
                    .append($("<a>")
                        .addClass("button-carDetails")
                        .attr("href", "#")
                        .text("Details")
                        .on("click", function () {
                            renderDetailsView(listing);
                        }))));
        }


        let carInfoDiv = $("<div>")
            .addClass("info")
            .append(carSubInfo)
            .append(carMenuList);

        let carContainer = $("<div>")
            .addClass("listing")
            .append($("<p>")
                .text(listing.title))
            .append($("<img>")
                .attr("src", listing.imageUrl))
            .append($("<h2>")
                .text(`Brand: ${listing.brand}`));

        carContainer
            .append(carInfoDiv);

        listingContainer.append(carContainer);
    }
}


function renderDetailsView(car) {
    hideAllViews();
    $("div.listing-details").show();
    let carContainer = $("div.my-listing-details");
    carContainer.empty();

    let subProperties = $("<div>")
        .addClass("listing-props")
        .append($("<h2>")
            .text(`Brand: ${car.brand}`))
        .append($("<h3>")
            .text(`Model: ${car.model}`))
        .append($("<h3>")
            .text(`Year: ${car.year}`))
        .append($("<h3>")
            .text(`Fuel: ${car.fuel}`))
        .append($("<h3>")
            .text(`Price: ${car.price} $`));

    let buttonsDiv = $("<div>")
        .addClass("listings-buttons")
        .append($("<a>")
            .addClass("button-list")
            .attr("href", "#")
            .text("Edit")
            .on("click", function () {
                renderEditView(car);
            }))
        .append($("<a>")
            .addClass("button-list")
            .attr("href", "#")
            .text("Delete")
            .on("click", function () {
                kinveyRequester.removeCar(car._id);
            }));

    carContainer
        .append($("<p>")
            .attr("id", "auto-title")
            .text(car.title))
        .append($("<img>")
            .attr("src", car.imageUrl))
        .append(subProperties);

    if (car.seller === sessionStorage.getItem("username")) {
        carContainer.append(buttonsDiv);
    };

    carContainer
        .append($("<p>")
            .attr("id", "description-title")
            .text("Description:"))
        .append($("<p>")
            .attr("id", "description-para")
            .text(car.description));
}

function renderEditView(car) {
    hideAllViews();
    $("#edit-listing").show();

    $("#edit-listing input[name=\"carId\"]").val(car._id);
    $("#edit-listing input[name=\"title\"]").val(car.title);
    $("#edit-listing input[name=\"description\"]").val(car.description);
    $("#edit-listing input[name=\"brand\"]").val(car.brand);
    $("#edit-listing input[name=\"model\"]").val(car.model);
    $("#edit-listing input[name=\"year\"]").val(car.year);
    $("#edit-listing input[name=\"imageUrl\"]").val(car.imageUrl);
    $("#edit-listing input[name=\"fuelType\"]").val(car.fuel);
    $("#edit-listing input[name=\"price\"]").val(car.price);
}

function renderMyView(myCars) {
    let myCarsContainer = $("div[class='my-listings']");
    myCarsContainer.empty();

    myCarsContainer
        .append($("<h1>")
            .text("My car listings"));

    if (myCars.length > 0) {
        let divContainer = $("<div>")
            .addClass("car-listings");

        for (const myCar of myCars) {
            let myCarDiv = $("<div>")
                .addClass("my-listing")
                .append($("<p>")
                    .attr("id", "listing-title")
                    .text(myCar.title))
                .append($("<img>")
                    .attr("src", myCar.imageUrl));

            let myCarProps = $("<div>")
                .addClass("listing-props")
                .append($("<h2>")
                    .text(`Brand: ${myCar.brand}`))
                .append($("<h3>")
                    .text(`Model: ${myCar.model}`))
                .append($("<h3>")
                    .text(`Year: ${myCar.year}`))
                .append($("<h3>")
                .text(`Price: ${myCar.price} $`));

            let myCarButtons = $("<div>")
                .addClass("my-listing-buttons")
                .append($("<a>")
                    .addClass("my-button-list")
                    .attr("href", "#")
                    .text("Details")
                    .on("click", function () {
                        renderDetailsView(myCar);
                    }))
                .append($("<a>")
                    .addClass("my-button-list")
                    .attr("href", "#")
                    .text("Edit")
                    .on("click", function () {
                        renderEditView(myCar);
                    }))
                .append($("<a>")
                    .addClass("my-button-list")
                    .attr("href", "#")
                    .text("Delete")
                    .on("click", function () {
                        kinveyRequester.removeCar(myCar._id);
                    }))

            myCarDiv
                .append(myCarProps)
                .append(myCarButtons);

            myCarsContainer.append(myCarDiv);
        }
    } else {
        myCarsContainer
            .append($("<p>")
                .addClass("no-cars")
                .text("No my cars in database."))
    }
}