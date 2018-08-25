function attachButtonEvents() {
    $("#register form").on("submit", function (ev) {
        ev.preventDefault();
        let username = $("#register input[name=\"username\"]").val();
        let password = $("#register input[name=\"password\"]").val();
        let repeatPass = $("#register input[name=\"repeatPass\"]").val();

        if(username === "" || password === "" || repeatPass === ""){
            showError('All fields must be filled in.');
        }
        else if (!/^[A-Za-z]{3,}$/.test(username)) {
            showError('Username should be at least 3 characters long and contain only english alphabet letters');
        } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
            showError('Password should be at least 6 characters long and contain only english alphabet letters');
        } else if (repeatPass !== password) {
            showError('Passwords must match!');
        } else {
            kinveyRequester.registerUser(username, password);
        }
    });

    $("#login form").on("submit", function (ev) {
        ev.preventDefault();
        let username = $("#login input[name=\"username\"]").val();
        let password = $("#login input[name=\"password\"]").val();

        if(username === "" || password === ""){
            showError('All fields must be filled in.');
        }
        else if (!/^[A-Za-z]{3,}$/.test(username)) {
            showError('Username should be at least 3 characters long and contain only english alphabet letters');
        } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
            showError('Password should be at least 6 characters long and contain only english alphabet letters');
        } else {
            kinveyRequester.loginUser(username, password);
        }
    });

    $("#profile a:nth-child(2)").on("click", function () {
        kinveyRequester.logoutUser();
    });

    $("#create-listing form").on("submit", function (ev) {
        ev.preventDefault();

        let seller = sessionStorage.getItem('username');
        let isAuthor = seller === sessionStorage.getItem('username');
        let title = $("#create-listing input[name=\"title\"]").val();
        let description = $("#create-listing input[name=\"description\"]").val();
        let brand = $("#create-listing input[name=\"brand\"]").val();
        let model = $("#create-listing input[name=\"model\"]").val();
        let year = $("#create-listing input[name=\"year\"]").val();
        let imageUrl = $("#create-listing input[name=\"imageUrl\"]").val();
        let fuel = $("#create-listing input[name=\"fuelType\"]").val();
        let price = $("#create-listing input[name=\"price\"]").val();

        if (title === '') {
            showError('Title is required!');
        } else if(title.length > 33){
            showError('The title length must not exceed 33 characters!');
        } else if(description === ""){
            showError('Description is required!');
        } else if(description.length >= 30 && description.length < 450){
            showError('The description length must not exceed 450 characters and should be at least 30!');
        } else if(brand === ""){
            showError('Brand is required!');
        } else if(model === ""){
            showError('Model is required!');
        } else if(model.length < 4){
            showError('The model length should be at least 4 characters!');
        } else if(brand.length > 11 || fuel.length > 11 || model.length > 11){
            showError('The brand, fuelType and model length must not exceed 11 characters!');
        } else if(year === ""){
            showError('Year is required!');
        } else if(year.length > 4 || year.length < 4){
            showError('The year must be only 4 chars long!');
        } else if(imageUrl === ""){
            notify.showError('ImageUrl is required!');
        } else if(!imageUrl.startsWith("http")){
            showError('Link url should always start with “http”.');
        } else if(fuel === ""){
            showError('Fuel is required!');
        } else if(price === "" || isNaN(Number(price))){
            showError('Price is required!');
        } else if(Number(price) > 1000000){
            showError('The maximum price is 1 000 000$');
        } else {
            kinveyRequester.postCar(seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl);
        }
    });

    $("#edit-listing form").on("submit", function (ev) {
        ev.preventDefault();

        let carId = $("#edit-listing input[name=\"carId\"]").val();
        let seller = sessionStorage.getItem('username');
        let isAuthor = seller === sessionStorage.getItem('username');
        let title = $("#edit-listing input[name=\"title\"]").val();
        let description = $("#edit-listing input[name=\"description\"]").val();
        let brand = $("#edit-listing input[name=\"brand\"]").val();
        let model = $("#edit-listing input[name=\"model\"]").val();
        let year = $("#edit-listing input[name=\"year\"]").val();
        let imageUrl = $("#edit-listing input[name=\"imageUrl\"]").val();
        let fuel = $("#edit-listing input[name=\"fuelType\"]").val();
        let price = $("#edit-listing input[name=\"price\"]").val();

        if (title === '') {
            showError('Title is required!');
        } else if(title.length > 33){
            showError('The title length must not exceed 33 characters!');
        } else if(description === ""){
            showError('Description is required!');
        } else if(description.length >= 30 && description.length < 450){
            showError('The description length must not exceed 450 characters and should be at least 30!');
        } else if(brand === ""){
            showError('Brand is required!');
        } else if(model === ""){
            showError('Model is required!');
        } else if(model.length < 4){
            showError('The model length should be at least 4 characters!');
        } else if(brand.length > 11 || fuel.length > 11 || model.length > 11){
            showError('The brand, fuelType and model length must not exceed 11 characters!');
        } else if(year === ""){
            showError('Year is required!');
        } else if(year.length > 4 || year.length < 4){
            showError('The year must be only 4 chars long!');
        } else if(imageUrl === ""){
            showError('ImageUrl is required!');
        } else if(!imageUrl.startsWith("http")){
            showError('Link url should always start with “http”.');
        } else if(fuel === ""){
            showError('Fuel is required!');
        } else if(price === "" || isNaN(Number(price))){
            showError('Price is required!');
        } else if(Number(price) > 1000000){
            showError('The maximum price is 1 000 000$');
        } else {
            kinveyRequester.editCar(carId, seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl);
        }
    });
}