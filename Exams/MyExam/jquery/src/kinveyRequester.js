const kinveyRequester = (function () {

    const BASE_URL = 'https://baas.kinvey.com/';
    const APP_KEY = 'kid_S1yNElcr7';
    const APP_SECRET = 'f0caf483c34d4bd5b992f34cc9d7d12b';
    const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
    const COLLECTION_NAME = "cars";

    function loginUser(username, password) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/login',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {
            signInUser(res, 'Login successful.');
            $("#login form").trigger('reset');
        }).catch(handleError)
    }

    function logoutUser() {
        $.ajax({
            method: 'POST',
            url: BASE_URL +  'user/' + APP_KEY + '/_logout',
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authoToken')}
        }).catch(function (err) {
            console.log(err)
        });
        sessionStorage.clear();
        showInfo("Logout successful");
        showHomeView();
        showHideLinks();
    }

    function registerUser(username, password) {
        $.ajax({
            method: "POST",
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {
            signInUser(res, 'User registration successful.');
            $("#register form").trigger("reset");

        }).catch(handleError)
    }

    function postCar(seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'appdata/' + APP_KEY + '/' + COLLECTION_NAME,
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authoToken')},
            data: {seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl}
        }).then(function () {
            showHomeView();
            showInfo("Listing created.");
            $("#create-listing form").trigger("reset");
        }).catch(handleError)
    }

    function editCar(carId, seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl) {
        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'appdata/' + APP_KEY + '/' + COLLECTION_NAME + "/" + carId,
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authoToken')},
            data: {seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl}
        }).then(function (res) {
            showInfo(`Listing ${title} updated.`);
            renderDetailsView(res);
        }).catch(handleError)
    }

    async function getAllListings() {
        return await $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/' + COLLECTION_NAME + '?query={}&sort={"_kmd.ect": -1}',
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authoToken')}
        }).then(function (res) {
            return res
        }).catch(handleError)
    }

    async function getMyCars(username) {
        return await $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + "/" + COLLECTION_NAME + `?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`,
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authoToken')},
        }).then(function (res) {
            return res
        }).catch(handleError)
    }

    function removeCar(id) {
        $.ajax({
            method: 'DELETE',
            url: BASE_URL + 'appdata/' + APP_KEY + '/' + COLLECTION_NAME + "/" + id,
            headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authoToken')}
        }).then(function () {
            showInfo("Listing deleted.");
            showHomeView();
        }).catch(handleError)
    }

    function signInUser(res, message) {
        saveUserSession(res);
        showInfo(message);
        showHideLinks();
        showHomeView();
    }

    function saveUserSession(userInfo) {
        sessionStorage.setItem('authoToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('userId', userInfo._id);
    }

    function handleError(err) {
        showError(err.responseJSON.description);
    }

    return {registerUser, loginUser, logoutUser, postCar, editCar, getAllListings, removeCar, getMyCars}
}());