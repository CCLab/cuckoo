$(document).ready(function() {
    $("#form-add-scandal").submit(function() {
        var scandal = {};
        $('input[type="text"]').each(function() {
            scandal[$(this).attr('name')] = $(this).val();
        });
        $('input[type="checkbox"]').each(function() {
            scandal[$(this).attr('name')] = ( $(this).attr('checked') == "checked" ? true : false );
        });

        $.post("/scandal/new", {'json': JSON.stringify(scandal)}, function(data) {
            $("#dialog-scandal").dialog({ autoOpen: false, title: "Afera dodana" }).html('Przejdź do <a href="/">strony głównej</a>.').dialog("open")
        });

        return false;
    });
});
