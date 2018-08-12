let cars = (() => {
    function getAll() {
        const endpoint = 'cars?query={}&sort={"_kmd.ect": -1}';

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function create(seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl) {
        let data = { seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl };
        return remote.post('appdata', 'cars',  data, 'kinvey');
    }

    function editCar(carId, seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl) {
        const endpoint = `cars/${carId}`;
        let data = { seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl};
        return remote.update('appdata', endpoint, data, 'kinvey');
    }

    function del(carId) {
        const endpoint = `cars/${carId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }

    function getMy(username) {
        const endpoint = `cars?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getById(carId) {
        const endpoint = `cars/${carId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    return {
        getAll,
        create,
        editCar,
        del,
        getById,
        getMy
    }
})();