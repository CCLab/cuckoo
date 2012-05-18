var scandal_types = [];

function refresh_subtypes(scandal_type) {
    if(scandal_type == undefined) {
        scandal_type = $("#scandal_type").val();
    }
    $("#scandal_subtype").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    $.getJSON("/options/scandal_subtypes", {"parent": scandal_type}, function(data) {
        $.each(data, function(index, value) {
            $("#scandal_subtype").append('<option value="'+value.id+'">'+value.name+'</option>');
        });
        $("#scandal_subtype").removeAttr("disabled");
    });
}

function add_event_form(event_dict) {
    var template = '<li>'
        + '<label for="event-1-location">Lokacja</label> <select name="event-1-location">'
        + '<option value="2">ogólnopolska</option>'
        + '</select>'
        + '<br>Czas'
        + '<br><label for="event-1-type">Typ</label> <select name="event-1-type">'
        + '<option value="2">postępowanie sądowe</option>'
        + '</select>'
        + '<br><label for="event-1-description">Opis</label>'
        + '<br><textarea id="event-1-description"></textarea>'
        + '</li>';
    $("#btn-add-event").before(Mustache.render(template, event_dict));
}

$(document).ready(function() {

    // overload form events and buttons

    $("#btn-add-event a").attr('href', 'javascript:add_event_form({})');

    // load possible options to lists

    // load scandal data & events data while making sure options on the subtype list load ok
    $("#form-scandal").submit(function() {
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

    /* load option lists and data from the API */
    $.getJSON("/options/scandal_types", function(data) {
        $.each(data, function(index, value) {
            $("#scandal_type").append('<option value="'+value.id+'">'+value.name+'</option>');
        });
        $("#scandal_type").change(function() {
            refresh_subtypes($(this).val());
        });

        /* determine which scandal are we talking about */
        var path = window.location.pathname.split("/");
        var scandal_id = path[path.length-1];
        $.getJSON("/api/scandal/"+scandal_id, function(data) {
            $("#name").val(data.name);
            $("#description").val(data.description);
            $("#scandal_type").val(data.type_id);
            refresh_subtypes();
            // FIXME: incorrect type/subtype loading
            // get to know it, then try to impress somebody
            $("#scandal_subtype").val(data.subtype_id);

            // if there are no events
            // FIXME
            // load one empty event form
            add_event_form({});
        });
    });
    
    $.getJSON("/options/scandal_consequences", function(data) {
        $.each(data, function(index, value) {
            $("#consequences").append('<input type="checkbox" id="consequence-'+value.id+'"><label for="consequence-'+value.id+'">'+value.name+'</label>');
        });
    });
});
