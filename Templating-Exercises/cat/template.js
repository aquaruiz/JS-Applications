$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        let cats = window.cats;
        let source = $("#cat-template").html();
        let compiled = Handlebars.compile(source);
        let templates = compiled({cats});

        $("body").append(templates);
        $("button").on("click", showHideStatus);

        function showHideStatus() {
            $(this).parent().children(":last-child").toggle();
            if($(this).text() === "Show status code"){
                $(this).text( "Hide status code");
            } else {
                $(this).text( "Show status code")
            }
        }
    }
});
