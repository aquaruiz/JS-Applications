function attachEvents() {
    $('#btnLoadTowns').on('click', function () {
        let source = $('#towns-template').html();
        let template = Handlebars.compile(source);

        let towns = $('#towns').val().split(/\W+/);
        let html = template(towns);
        $('#root').append(html);
    })
}