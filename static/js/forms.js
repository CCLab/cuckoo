var cuckoo = {}
cuckoo.scandal_types = [];
cuckoo.scandal_consequences = [];
cuckoo.event_types = [];
cuckoo.locations = [];
cuckoo.actors = {};
cuckoo.actor_types = {};
cuckoo.actor_roles = {};
cuckoo.actor_affiliations = {};

var scandal_id = null;
var event_counter = 1;

var init_counter = 4;

// HACK for subtype loading
var subtype_id = null;
// end HACK

/* mustache templates */

var tpl_select_option = '<option value="{{id}}">{{name}}</option>';
var tpl_select = '<label for="{{id}}">{{name}}</label>'
   + ' <select id="{{id}}"><option value="0">(brak)</option>{{#items}}{{{option}}}{{/items}}</select>';
var tpl_consequence = '<input type="checkbox" id="scandal_consequence-{{id}}" value="{{id}}"><label for="scandal_consequence-{{id}}">{{name}}</label>';
// FIXME: this is nasty
var tpl_event_form = '<li class="event">'
    + '{{{select_locations}}}'
    + '<br>Data wydarzenia'
    + '<br><div id="event-{{id}}-event_date"></div>'
    + '<br>{{{select_types}}}'
    + '<br><label for="event-{{id}}-subtype">Podtyp</label> <select id="event-{{id}}-subtype"></select>'
    + '<br><label for="event-{{id}}-description">Opis</label>'
    + '<br><textarea id="event-{{id}}-description" rows="8" cols="50"></textarea>'
    + '<br>Data publikacji'
    + '<br><div id="event-{{id}}-publication_date"></div>'
    + '<fieldset><legend>Aktor</legend>'
    + '<input type="radio" name="event-{{id}}-actor_human" id="event-{{id}}-actor_human_no" value="0"> <label for="event-{{id}}-actor_human_no">instytucja</label>'
    + '<input type="radio" name="event-{{id}}-actor_human" id="event-{{id}}-actor_human_yes" value="1"> <label for="event-{{id}}-actor_human_yes">osoba</label>'
    + '<br><label for="event-{{id}}-actor">Nazwa</label> <select id="event-{{id}}-actor"></select>'
    + '<br><label for="event-{{id}}-actor_type">Typ</label> <select id="event-{{id}}-actor_type"></select>'
    + '<br><label for="event-{{id}}-actor_role">Rola</label> <select id="event-{{id}}-actor_role"></select>'
    + '<br><label for="event-{{id}}-actor_affiliation">Afiliacja</label> <select id="event-{{id}}-actor_affiliation"></select>'
    + '</fieldset>'
    + '</li>';
var select_stub = {
    "items": [],
    "id": "",
    "name": "",
    "option": function () {
        return '<option value="' + this.id + '">' + this.name + '</option>';
    }
};

/* helper functions */

function add_event_form(event_dict) {
    form_dict = { "id": event_counter };

    var locations = $.extend(true, {}, select_stub);
    locations["items"] = cuckoo.locations;
    locations["id"] = "event-" + event_counter + "-location";
    locations["name"] = "Lokacja";
    form_dict["select_locations"] = Mustache.render(tpl_select, locations);

    var event_types = $.extend(true, {}, select_stub);
    event_types["items"] = cuckoo.event_types;
    event_types["id"] = "event-" + event_counter + "-type";
    event_types["name"] = "Typ";
    form_dict["select_types"] = Mustache.render(tpl_select, event_types);

    /* add new event form to the bottom, just before the button */
    $("#btn-add-event").before(Mustache.render(tpl_event_form, form_dict));

    $("#event-" + event_counter + "-subtype").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    $("#event-" + event_counter + "-actor").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    $("#event-" + event_counter + "-actor_type").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    $("#event-" + event_counter + "-actor_role").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    $("#event-" + event_counter + "-actor_affiliation").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

    /* enable datepicker */
    $("#event-" + event_counter + "-event_date").datepicker({changeMonth: true, changeYear: true, firstDay: 1, yearRange: "1980:2012", dateFormat: "yy-mm-dd"});
    $("#event-" + event_counter + "-publication_date").datepicker({changeMonth: true, changeYear: true, firstDay: 1, yearRange: "1980:2012", dateFormat: "yy-mm-dd"});

    /* set li id */
    $("#event-" + event_counter + "-type").parent().data('id', event_counter);

    /* bind change event to actor_human radio button */
    $("#event-" + event_counter + "-actor_human_no").change(function() {
        // load non-human
        alert("ch");
    });
    $("#event-" + event_counter + "-actor_human_yes").change(function() {
        // load human
        alert("ange");
    });
    
    /* fill with data from event_dict */
    if(typeof(event_dict) !== "undefined") {
        console.log(event_dict);
    }

    /* increment event counter */
    event_counter++;
}

function add_option_popup(link, option_realm) {
    /* possible realms:
     *
     * scandal_types, scandal_subtypes (parent from #scandal_type)
     * scandal_consequences, event_types
     * event_subtypes (parent determined from caller context)
     * locations, actor_types, actor_roles, actor_affiliations
     */

    /* create request info to be passed down */
    var request = {};
    request["realm"] = option_realm;
    request["caller"] = link;

    /* determine dialog box title */
    var dialog_title = "Dodaj element";
    if(option_realm === "scandal_types")             dialog_title = "Dodaj typ afery";
    else if(option_realm === "scandal_subtypes")     dialog_title = "Dodaj podtyp afery";
    else if(option_realm === "event_types")          dialog_title = "Dodaj typ wydarzenia";
    else if(option_realm === "event_subtypes")       dialog_title = "Dodaj podtyp wydarzenia";
    else if(option_realm === "scandal_consequences") dialog_title = "Dodaj konsekwencję";
    else if(option_realm === "locations")            dialog_title = "Dodaj lokację";
    else if(option_realm === "actor_types")          dialog_title = "Dodaj typ aktora";
    else if(option_realm === "actor_roles")          dialog_title = "Dodaj rolę aktora";
    else if(option_realm === "actor_affiliations")   dialog_title = "Dodaj afiliację aktora";

    /* create out dialog box */
    $("#dialog").data("request", request).dialog({
        title: dialog_title,
        buttons: {
            "Dodaj": function() {
                var request = $(this).data("request");

                $(request["caller"]).css('background-color', '#f00');

                var params = {};
                params["name"] = $("#dialog_option").val();
                if(request["realm"] === "scandal_subtypes") params["parent"] = $("#scandal_type").val();

                $.post("/options/" + request["realm"], params, function(data) {
                    alert(data.id);
                    $("#dialog").html("Element dodany.");
                }, "json");
            }
        }
        }).html('<input type="text" id="dialog_option">');
}

function init() {
    /* scandal_types */
    $.getJSON("/options/scandal_types", function(data) {
        cuckoo.scandal_types = data;

        /* add new options to the list */
        $.each(data, function(index, value) {
            $("#scandal_type").append(Mustache.render(tpl_select_option, value));
        });

        /*var types = $.extend(true, {}, select_stub);
        types["items"] = cuckoo.scandal_types;
        types["id"] = "scandal_type";
        types["name"] = "Typ";
        var select_types = Mustache.render(tpl_select, types);
        console.log(select_types);*/

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
        initCount();
    });

    /* scandal_consequences */
    $.getJSON("/options/scandal_consequences", function(data) {
        $.each(data, function(index, value) {
            $("#scandal_consequences_btn").before(Mustache.render(tpl_consequence, value));
        });
        initCount();
    });

    /* locations */
    $.getJSON("/options/locations", function(data) {
        cuckoo.locations = data;
        initCount();
    });

    /* event_types */
    $.getJSON("/options/event_types", function(data) {
        cuckoo.event_types = data;
        initCount();
    });
}

function initCount() {
    init_counter--;
    console.log("something init completed, counter: " + init_counter);
    if(!init_counter) initDone();
}

function initDone() {
    console.log("init done!");

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

            add_event_form();
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

        // parsing datepickers:
        // $("#datepicker-"+i).datepicker("getDate")
        //console.log($("#event-1-time").datepicker("getDate"));

        var post_url = (scandal_id === null) ? "/api/scandal/new" : "/api/scandal/" + scandal_id;
        $.post(post_url, {"payload": JSON.stringify(scandal)}, function(data) {
            $("#dialog").dialog({ autoOpen: false, title: data.message }).html( data.message ).dialog("open");

            /* set scandal_id on in case of new scandal */
            if(typeof(data.id) !== "undefined") {
                scandal_id = data.id;
            }
        }, "json");

        return false;
    });
}

$(document).ready(function() {
    init();
});
