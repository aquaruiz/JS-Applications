const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_ryTUw7cE7';
const APP_SECRET = 'c3f2438fef2a4c738d2011cdf5e88095';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
const AUTH_TOKEN = "7e8643c4-0a02-4caf-b16e-d1a00dec12da.XCY01Pp8ouVZjoG90B1OsOQFKe6t334DXo+c8nPSdIY=";
const BOOKS_PER_PAGE = 10;

function loginUser() {
    let username = $("#formLogin").find("input[name='username']").val();
    let pass = $("#formLogin").find("input[name='passwd']").val();

    let postLoginRequest = {
        method: "POST",
        url: BASE_URL + "user/" + APP_KEY + "/login",
        headers: {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET), "Content-Type":"application/json"},
        data: JSON.stringify({"username": username,
            "password": pass})
    };

    $.ajax(postLoginRequest).
        then(
            function (res){
                signInUser(res, 'Login successful.')
            })
        .catch(handleAjaxError)
    // TODO
    // POST -> BASE_URL + 'user/' + APP_KEY + '/login'
    // signInUser(res, 'Login successful.')
}

function registerUser() {
    let username = $("#formRegister").find("input[name='username']").val();
    let pass = $("#formRegister").find("input[name='passwd']").val();

    let postRegisterRequest = {
        method: "POST",
        url: BASE_URL + "user/" + APP_KEY,
        headers: {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET), "Content-Type":"application/json"},
        data: JSON.stringify({"username": username,
            "password": pass})
    };

    $.ajax(postRegisterRequest).
    then(
        function(res){
            signInUser(res, 'Registration successful.');
        })
        .catch(handleAjaxError);
    // TODO
    // POST -> BASE_URL + 'user/' + APP_KEY + '/'
    // signInUser(res, 'Registration successful.')
}

function listBooks() {
    showView("viewBooks");

    let getBooksRequest = {
        method: "GET",
        url: BASE_URL + "appdata/" + APP_KEY + "/booklibrary",
        headers: getKinveyUserAuthHeaders()
    };

    $.ajax(getBooksRequest)
        .then(function (res) {
            displayPaginationAndBooks(res.reverse())
        })
        .catch(handleAjaxError)

    // TODO
    // GET -> BASE_URL + 'appdata/' + APP_KEY + '/books'
    // displayPaginationAndBooks(res.reverse())
}


function createBook() {
    let title = $('#formCreateBook input[name="title"]').val();
    let author = $('#formCreateBook input[name="author"]').val();
    let description = $('#formCreateBook textarea[name="description"]').val();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/booklibrary',
        headers: getKinveyUserAuthHeaders(),
        data: {title, author, description}
    }).then(function (res) {
        listBooks();
        showInfo('Book created.');
    }).catch(handleAjaxError)

    // TODO
    // POST -> BASE_URL + 'appdata/' + APP_KEY + '/books'
    // showInfo('Book created.')
}

function deleteBook(book) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/booklibrary/' + book._id,
        headers: getKinveyUserAuthHeaders(),
    }).then(function () {
        listBooks();
        showInfo('Book deleted.');
    }).catch(handleAjaxError);
    // TODO
    // DELETE -> BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id
    // showInfo('Book deleted.')
}

function loadBookForEdit(book) {
    showView('viewEditBook');
    $('#formEditBook input[name="title"]').val(book.title);
    $('#formEditBook input[name="author"]').val(book.author);
    $('#formEditBook textarea[name="description"]').val(book.description);
    $('#formEditBook input[name="id"]').val(book._id);
    // TODO
}

function editBook() {
    let title = $('#formEditBook input[name="title"]').val();
    let author = $('#formEditBook input[name="author"]').val();
    let description = $('#formEditBook textarea[name="description"]').val();
    let id = $('#formEditBook input[name="id"]').val();
    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/booklibrary/' + id,
        headers: getKinveyUserAuthHeaders(),
        data: {title, author, description}
    }).then(function (res) {
        listBooks();
        showInfo('Book edited.');
    }).catch(handleAjaxError);

    // TODO
    // PUT -> BASE_URL + 'appdata/' + APP_KEY + '/books/' + book._id
    // showInfo('Book edited.')
}

function saveAuthInSession(res) {
    let token = res._kmd.authtoken;
    let user = res.username;
    let id = res._id;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('username', user);
    sessionStorage.setItem("userId", id);

    // let username = res.username;
    // $('#loggedInUser').text(
    //     "Welcome, " + username + "!");
}

function logoutUser() {
    sessionStorage.clear();
    showHideMenuLinks();
    $('#loggedInUser').text("");
    showHomeView();
    showInfo("Logout successful.")
    // TODO
}

function signInUser(res, message) {
    saveAuthInSession(res);
    showHideMenuLinks();
    listBooks();
    showInfo(message);
    // TODO
}

function displayPaginationAndBooks(books) {
    showView('viewBooks')
    let pagination = $('#pagination-demo')
    if(pagination.data("twbs-pagination")){
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {
            $('#books > table tr').each((index, element) => {
                if (index > 0) {
                    $(element).remove()
                }
            });

            let startBook = (page - 1) * BOOKS_PER_PAGE;
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length);
            $(`a:contains(${page})`).addClass('active');

            for (let i = startBook; i < endBook; i++) {
                let tr = $(`<tr><td>${books[i].title}</td>`+
                    `<td>${books[i].author}</td>`+
                    `<td>${books[i].description}</td></tr>`);

                if (books[i]._acl.creator == sessionStorage.getItem("userId")) {
                    let td = $('<td>');
                    let aDel = $('<a href="#">[Delete]</a>').on('click', function () {
                        deleteBook(books[i])
                    });

                    let aEdit = $('<a href="#">[Edit]</a>').on('click', function () {
                        loadBookForEdit(books[i])
                    });
                    td.append(aDel).append(aEdit);
                    tr.append(td);
                }
                $('#books > table').append(tr);
            }
        }
    })
}

function getKinveyUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken'),
    };
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg)
}