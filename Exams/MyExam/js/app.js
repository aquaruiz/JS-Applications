// const handlers = {};

$(() => {
    let app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/home', getWelcomePage);
        this.get('index.html', getWelcomePage);

        function getWelcomePage(ctx) {
            ctx.isNotAuthed = !auth.isAuthed();
            ctx.isAuthed =  auth.isAuthed();

            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                nav: './templates/common/nav.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/welcome-anonymous.hbs');
            })
        }

        this.get('#/register', function (ctx) {
            ctx.isAuthed = auth.isAuthed();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                nav: './templates/common/nav.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/forms/registerForm.hbs',
            }).then(function () {
                this.partial('./templates/pages/registerPage.hbs');
            })
        });

        this.post('#/register', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            if(username === "" || password === "" || repeatPass === ""){
                notify.showError('All fields must be filled in.');
            }
            else if (!/^[A-Za-z]{3,}$/.test(username)) {
                notify.showError('Username should be at least 3 characters long and contain only english alphabet letters');
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError('Password should be at least 6 characters long and contain only english alphabet letters');
            } else if (repeatPass !== password) {
                notify.showError('Passwords must match!');
            } else {
                auth.register(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('User registration successful.');
                        ctx.redirect('#/allListings');
                    })
                    .catch(notify.handleError);
            }
        });

        this.get('#/login', function (ctx) {
            ctx.isAuthed = auth.isAuthed();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                nav: './templates/common/nav.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/forms/loginForm.hbs',
            }).then(function () {
                this.partial('./templates/pages/loginPage.hbs');
            })
        });

        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;

            if (username === '' || password === '') {
                notify.showError('All fields should be filled in!');
            }
            else if (!/^[A-Za-z]{3,}$/.test(username)) {
                notify.showError('It`s dumm! \n Username should be at least 3 characters long and contain only english alphabet letters');
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError('It`s dumm! \n Password should be at least 6 characters long and contain only english alphabet letters');}
            else {
                auth.login(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('Login successful.');
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.handleError);
            }
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    notify.showInfo('Logout successful.');
                    ctx.redirect('#/login');
                })
                .catch(notify.handleError);
        });


        this.get('#/catalog', (ctx) => {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            cars.getAll()
                .then((cars) => {
                    cars.forEach((car, i) => {
                        car.isSeller = car.seller === sessionStorage.getItem('username');
                    });

                    ctx.isAuthed = auth.isAuthed();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.cars = cars;

                    ctx.loadPartials({
                        nav: './templates/common/nav.hbs',
                        footer: './templates/common/footer.hbs',
                        car: './templates/forms/car.hbs'
                    }).then(function () {
                        this.partial('./templates/pages/catalogPage.hbs');
                    })
                })
                .catch(notify.handleError);
        });

        this.get('#/create', (ctx) => {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            ctx.isAuthed = auth.isAuthed();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                nav: './templates/common/nav.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/forms/create.hbs',
            }).then(function () {
                this.partial('./templates/pages/createPage.hbs');
            })
        });

        this.post('#/create', (ctx) => {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            let seller = sessionStorage.getItem('username');
            let isAuthor = seller === sessionStorage.getItem('username');
            let title = ctx.params.title;
            let description = ctx.params.description;
            let brand = ctx.params.brand;
            let model = ctx.params.model;
            let year = ctx.params.year;
            let imageUrl = ctx.params.imageUrl;
            let fuel = ctx.params.fuelType;
            let price = ctx.params.price;

            if (title === '') {
                notify.showError('Title is required!');
            } else if(title.length > 33){
                notify.showError('The title length must not exceed 33 characters!');
            } else if(description === ""){
                notify.showError('Description is required!');
            } else if(description.length >= 30 && description.length < 450){
                notify.showError('The description length must not exceed 450 characters and should be at least 30!');
            } else if(brand === ""){
                notify.showError('Brand is required!');
            } else if(model === ""){
                notify.showError('Model is required!');
            } else if(model.length < 4){
                notify.showError('The model length should be at least 4 characters!');
            } else if(brand.length > 11 || fuel.length > 11 || model.length > 11){
                notify.showError('The brand, fuelType and model length must not exceed 11 characters!');
            } else if(year === ""){
                notify.showError('Year is required!');
            } else if(year.length > 4 || year.length < 4){
                notify.showError('The year must be only 4 chars long!');
            } else if(imageUrl === ""){
                notify.showError('ImageUrl is required!');
            } else if(!imageUrl.startsWith("http")){
                notify.showError('Link url should always start with “http”.');
            } else if(fuel === ""){
                notify.showError('Fuel is required!');
            } else if(price === "" || isNaN(Number(price))){
                notify.showError('Price is required!');
            } else if(Number(price) > 1000000){
                notify.showError('The maximum price is 1 000 000$');
            } else {
                cars.create(seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl)
                    .then(() => {
                        notify.showInfo('Listing created.');
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.handleError);
            }
        });

        this.get('#/edit/:carId', (ctx) => {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            let carId = ctx.params.carId;

            cars.getById(carId)
                .then((car) => {
                    ctx.isAuthed = auth.isAuthed();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.car = car;

                    ctx.loadPartials({
                        nav: './templates/common/nav.hbs',
                        footer: './templates/common/footer.hbs',
                        editForm: './templates/forms/editForm.hbs',
                    }).then(function () {
                        this.partial('./templates/pages/editPage.hbs');
                    })
                })
        });

        this.post('#/edit', (ctx) => {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            let carId = ctx.params.carId;

            let seller = sessionStorage.getItem('username');
            let isAuthor = seller === sessionStorage.getItem('username');
            let title = ctx.params.title;
            let description = ctx.params.description;
            let brand = ctx.params.brand;
            let model = ctx.params.model;
            let year = ctx.params.year;
            let imageUrl = ctx.params.imageUrl;
            let fuel = ctx.params.fuelType;
            let price = ctx.params.price;

            if (title === '') {
                notify.showError('Title is required!');
            } else if(title.length > 33){
                notify.showError('The title length must not exceed 33 characters!');
            } else if(description === ""){
                notify.showError('Description is required!');
            } else if(description.length >= 30 && description.length < 450){
                notify.showError('The description length must not exceed 450 characters and should be at least 30!');
            } else if(brand === ""){
                notify.showError('Brand is required!');
            } else if(model === ""){
                notify.showError('Model is required!');
            } else if(model.length < 4){
                notify.showError('The model length should be at least 4 characters!');
            } else if(brand.length > 11 || fuel.length > 11 || model.length > 11){
                notify.showError('The brand, fuelType and model length must not exceed 11 characters!');
            } else if(year === ""){
                notify.showError('Year is required!');
            } else if(year.length > 4 || year.length < 4){
                notify.showError('The year must be only 4 chars long!');
            } else if(imageUrl === ""){
                notify.showError('ImageUrl is required!');
            } else if(!imageUrl.startsWith("http")){
                notify.showError('Link url should always start with “http”.');
            } else if(fuel === ""){
                notify.showError('Fuel is required!');
            } else if(price === "" || isNaN(Number(price))){
                notify.showError('Price is required!');
            } else if(Number(price) > 1000000){
                notify.showError('The maximum price is 1 000 000$');
            } else {
                cars.editCar(carId, seller, title, description, isAuthor, brand, model, year, price, fuel, imageUrl)
                    .then(() => {
                        notify.showInfo(`Listing ${title} updated.`);
                        ctx.redirect('#/catalog');
                    })
                    .catch(notify.showError);
            }
        });

        this.get('#/delete/:carId', (ctx) => {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            let carId = ctx.params.carId;

            cars.del(carId)
                .then(() => {
                    notify.showInfo('Listing deleted.');
                    ctx.redirect('#/catalog');
                })
                .catch(notify.handleError);
        });

        this.get('#/myListings', (ctx) => {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            cars.getMy(sessionStorage.getItem('username'))
                .then((cars) => {
                    ctx.isAuthed = auth.isAuthed();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.myCars = cars;

                    ctx.loadPartials({
                        nav: './templates/common/nav.hbs',
                        footer: './templates/common/footer.hbs',
                        myCar: './templates/forms/myCar.hbs',
                    }).then(function () {
                        this.partial('./templates/pages/myPage.hbs');
                    });
                })
        });

        this.get('#/details/:carId', (ctx) => {
            let carId = ctx.params.carId;

            cars.getById(carId)
                .then((car) => {
                    car.isSeller = car.seller === sessionStorage.getItem('username');

                    ctx.isAuthed = auth.isAuthed();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.car = car;

                    ctx.loadPartials({
                        nav: './templates/common/nav.hbs',
                        footer: './templates/common/footer.hbs',
                        carDetails: './templates/forms/carDetails.hbs'
                    }).then(function () {
                        this.partial('./templates/pages/details.hbs');
                    })
                })
                .catch(notify.handleError);
        });

    }).run();
});