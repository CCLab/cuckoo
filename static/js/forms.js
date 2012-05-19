var scandal_types = [];
var event_types = [];
var scandal_id = null;

// HACK for subtype loading
var subtype_id = null;
// end HACK

/* mustache templates */

var tpl_select_option = '<option value="{{id}}">{{name}}</option>';
var tpl_consequence = '<input type="checkbox" id="scandal_consequence-{{id}}" value="{{id}}"><label for="scandal_consequence-{{id}}">{{name}}</label>';
// FIXME: this is nasty
var tpl_event_form = '<li class="event">'
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

/* helper functions */

function load_scandal_types( callback ) {
    $.getJSON("/options/scandal_types", function(data) {
        /* add new options to the list */
        $.each(data, function(index, value) {
            $("#scandal_type").append(Mustache.render(tpl_select_option, value));
        });

        /* set handler to refresh subtypes */
        $("#scandal_type").change(function() {
            /* disable and clear subtype list */
            $("#scandal_subtype").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

            /* determine current scandal type */
            var type_id = $("#scandal_type").val();
            $.getJSON("/options/scandal_subtypes", {"parent": type_id}, function(data) {
                $.each(data, function(index, value) {
                    $("#scandal_subtype").append(Mustache.render(tpl_select_option, value));
                });
                /* enable subtype list */
                $("#scandal_subtype").removeAttr("disabled");

                // HACK for subtype loading
                $("#scandal_subtype").val(subtype_id);
                // end HACK
            });
        });

        callback();
    });
}

function load_scandal_consequences( callback ) {
    $.getJSON("/options/scandal_consequences", function(data) {
        $.each(data, function(index, value) {
            $("#scandal_consequences").append(Mustache.render(tpl_consequence, value));
        });

        callback();
    });
}

function add_event_form(event_dict) {
    /* default value for optional argument */
    if(typeof(event_dict) === "undefined") {
        event_dict = {};
    }

    /* add new event form to the bottom, just before the button */
    $("#btn-add-event").before(Mustache.render(tpl_event_form, event_dict));
}

$(document).ready(function() {

    load_scandal_types(function() {
        load_scandal_consequences(function() {
            /* which scandal are we talking about, again? */
            var path = window.location.pathname.split("/");
            var scandal_str = parseInt(path[path.length-1]);
            scandal_id = isNaN(scandal_str) ? null : scandal_str;

            /* if id was given, load me some scandal data */
            if(scandal_id !== null) {
                $.getJSON("/api/scandal/"+scandal_id, function(data) {
                    $("#scandal_name").val(data.name);
                    $("#scandal_description").val(data.description);
                    $("#scandal_type").val(data.type_id).change();

                    // FIXME: do subtype loading properly
                    // This does not work, as it tries to set subtype
                    // before list is loaded. List loads in event handler,
                    // so that we can't specify callback here.
                    //$("#scandal_subtype").val(data.subtype_id);

                    // HACK for subtype setting
                    subtype_id = data.subtype_id;
                    // end HACK
                    
                    $.each(data.consequences, function(index, value) {
                        $("#scandal_consequence-"+value).attr("checked", "checked");
                    });
                    
                    // TODO: load me some events
                });
            }

            /* button handlers */

            $("#btn-add-event a").attr('href', 'javascript:add_event_form()');

            /* form handlers */

            $("#form-scandal").submit(function() {
                var scandal = {
                    "name": $("#scandal_name").val(),
                    "description": $("#scandal_description").val(),
                    "type_id": ($("#scandal_type").val() === "0") ? null : parseInt($("#scandal_type").val()),
                    "subtype_id": ($("#scandal_subtype").val() === "0") ? null : parseInt($("#scandal_subtype").val())
                };

                scandal["consequences"] = new Array();
                $("#scandal_consequences input:checkbox:checked").each(function(index, value) {
                    scandal["consequences"].push(parseInt($(this).val()));
                });

                /*

                // save scandal data
                // iterate through events list and save events with non-empty descriptions

                $('input[type="text"]').each(function() {
                    scandal[$(this).attr('name')] = $(this).val();
                });
                $('input[type="checkbox"]').each(function() {
                    scandal[$(this).attr('name')] = ( $(this).attr('checked') == "checked" ? true : false );
                });

                */

                var post_url = (scandal_id === null) ? "/api/scandal/new" : "/api/scandal/" + scandal_id;
                $.post(post_url, {"payload": JSON.stringify(scandal)}, function(data) {
                    var response = $.parseJSON(data);
                    $("#dialog").dialog({ autoOpen: false, title: response.message }).html( data ).dialog("open");

                    /* set scandal_id on in case of new scandal */
                    if(typeof(response.id) !== "undefined") {
                        scandal_id = response.id;
                    }
                });

                return false;
            });

        });
    });

});
