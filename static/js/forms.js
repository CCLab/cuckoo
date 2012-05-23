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
var init_counter = 12;

// HACK for subtype loading
var subtype_id = null;
// end HACK

// HACK for event id passing
var event_id = null;
// end HACK

/* mustache templates */

var tpl_select_option = '<option value="{{id}}">{{name}}</option>';
var tpl_select = '<label for="{{id}}">{{name}}</label>'
   + ' <select id="{{id}}"><option value="0">(brak)</option>{{#items}}{{{option}}}{{/items}}</select>';
var tpl_consequence = '<input type="checkbox" id="scandal_consequence-{{id}}" value="{{id}}"><label for="scandal_consequence-{{id}}">{{name}}</label>';
// FIXME: this is nasty
var tpl_event_form = '<li class="event">'
    + '{{{select_locations}}}'
    + ' <a href="#" onclick="add_option_popup(this, \'locations\')" class="button-small">+</a>'
    + '<br>Data wydarzenia'
    + '<br><div id="event-{{id}}-event_date"></div>'
    + '<br>{{{select_types}}}'
    + ' <input type="button" onclick="add_option_popup(this, \'event_types\')" class="button-small" value="+">'
    + '<br><label for="event-{{id}}-subtype">Podtyp</label> <select id="event-{{id}}-subtype"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'event_subtypes\')" class="button-small" value="+">'
    + '<br><label for="event-{{id}}-description">Opis</label>'
    + '<br><textarea id="event-{{id}}-description" rows="8" cols="50"></textarea>'
    + '<br>Data publikacji'
    + '<br><div id="event-{{id}}-publication_date"></div>'
    + '<fieldset><legend>Aktor</legend>'
    + '<input type="radio" name="event-{{id}}-actor_human" id="event-{{id}}-actor_human_no" value="0"> <label for="event-{{id}}-actor_human_no">instytucja</label>'
    + '<input type="radio" name="event-{{id}}-actor_human" id="event-{{id}}-actor_human_yes" value="1"> <label for="event-{{id}}-actor_human_yes">osoba</label>'
    + '<br><label for="event-{{id}}-actor">Nazwa</label> <select id="event-{{id}}-actor"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actors\')" class="button-small" value="+">'
    + '<br><label for="event-{{id}}-actor_type">Typ</label> <select id="event-{{id}}-actor_type"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actor_types\')" class="button-small" value="+">'
    + '<br><label for="event-{{id}}-actor_role">Rola</label> <select id="event-{{id}}-actor_role"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actor_roles\')" class="button-small" value="+">'
    + '<br><label for="event-{{id}}-actor_affiliation">Afiliacja</label> <select id="event-{{id}}-actor_affiliation"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actor_affiliations\')" class="button-small" value="+">'
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

function get_subtypes(tree, parent_id) {
    for(var i=0; i<tree.length; i++) {
        if(tree[i].id == parent_id)
            return tree[i].children;
    }
}

function insert_subtype(tree, parent_id, el) {
    for(var i=0; i<tree.length; i++) {
        if(tree[i].id == parent_id) {
            tree[i].children.push(el);
            break;
        }
    }
}

function find_if_human(actor_id) {
    var found = false;
    for(var i=0; i<cuckoo.actors[1].length; i++) {
        if(cuckoo.actors[1][i].id == actor_id)
            found = true;
    }
    return found;
}

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
        var id = $(this).parents("li").data('id');

        /* reset all actor controls */
        $("#event-" + id + "-actor").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $("#event-" + id + "-actor_type").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $("#event-" + id + "-actor_role").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $("#event-" + id + "-actor_affiliation").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

        var id = $(this).parents("li").data("id");

        // HACK for event id passing
        event_id = id;
        // end HACK

        /* reset actors */
        $.each(cuckoo.actors[0], function(index, value) {
            $("#event-" + event_id + "-actor").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor").removeAttr("disabled");

        /* reset actor_types */
        $.each(cuckoo.actor_types[0], function(index, value) {
            $("#event-" + event_id + "-actor_type").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor_type").removeAttr("disabled");

        /* reset actor_roles */
        $.each(cuckoo.actor_roles[0], function(index, value) {
            $("#event-" + event_id + "-actor_role").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor_role").removeAttr("disabled");

        /* reset actor_affiliations */
        $.each(cuckoo.actor_affiliations[0], function(index, value) {
            $("#event-" + event_id + "-actor_affiliation").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor_affiliation").removeAttr("disabled");
    });
    $("#event-" + event_counter + "-actor_human_yes").change(function() {
        var id = $(this).parents("li").data('id');

        /* reset all actor controls */
        $("#event-" + id + "-actor").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $("#event-" + id + "-actor_type").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $("#event-" + id + "-actor_role").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $("#event-" + id + "-actor_affiliation").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

        var id = $(this).parents("li").data("id");

        // HACK for event id passing
        event_id = id;
        // end HACK

        /* reset actors */
        $.each(cuckoo.actors[1], function(index, value) {
            $("#event-" + event_id + "-actor").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor").removeAttr("disabled");

        /* reset actor_types */
        $.each(cuckoo.actor_types[1], function(index, value) {
            $("#event-" + event_id + "-actor_type").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor_type").removeAttr("disabled");

        /* reset actor_roles */
        $.each(cuckoo.actor_roles[1], function(index, value) {
            $("#event-" + event_id + "-actor_role").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor_role").removeAttr("disabled");

        /* reset actor_affiliations */
        $.each(cuckoo.actor_affiliations[1], function(index, value) {
            $("#event-" + event_id + "-actor_affiliation").append(Mustache.render(tpl_select_option, value));
        });
        $("#event-" + id + "-actor_affiliation").removeAttr("disabled");
    });

    /* bind change event to event type */
    $("#event-" + event_counter + "-type").change(function() {
        var id = $(this).parents("li").data("id");
        /* disable and clear subtype list */
        $("#event-" + id + "-subtype").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

        /* determine current scandal type */
        var parent_id = $("#event-" + id + "-type").val();
        $.each(get_subtypes(cuckoo.event_types, parent_id), function(index, value) {
            $("#event-" + id + "-subtype").append(Mustache.render(tpl_select_option, value));
        });

        /* enable subtype list */
        $("#event-" + id + "-subtype").removeAttr("disabled");
    });

    /* fill with data from event_dict */
    if(typeof(event_dict) !== "undefined") {
        $("#event-" + event_counter + "-location").val( event_dict.location_id );
        $("#event-" + event_counter + "-event_date").datepicker("setDate", event_dict.event_date);
        $("#event-" + event_counter + "-type").val( event_dict.type_id ).change();
        $("#event-" + event_counter + "-subtype").val( event_dict.subtype_id );
        $("#event-" + event_counter + "-description").val( event_dict.description );
        $("#event-" + event_counter + "-publication_date").datepicker("setDate", event_dict.publication_date);
        if(find_if_human(event_dict.actor_id)) {
            $("#event-" + event_counter + "-actor_human_yes").attr("checked", "checked").change();
        } else {
            $("#event-" + event_counter + "-actor_human_no").attr("checked", "checked").change();
        }
        $("#event-" + event_counter + "-actor").val( event_dict.actor_id );
        $("#event-" + event_counter + "-actor_type").val( event_dict.actor_type_id );
        $("#event-" + event_counter + "-actor_role").val( event_dict.actor_role_id );
        $("#event-" + event_counter + "-actor_affiliation").val( event_dict.actor_affiliation_id );
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
                var id = $(request["caller"]).parents("li").data('id');

                var params = {};
                params["name"] = $("#dialog_option").val();
                if(request["realm"] === "scandal_subtypes") params["parent"] = $("#scandal_type").val();
                else if(request["realm"] === "event_subtypes") params["parent"] = $("#event-" + id + "-type").val();
                else if(request["realm"] === "actors" || request["realm"] === "actor_types" || request["realm"] === "actor_roles" || request["realm"] === "actor_affiliations") {
                    if($("#event-" + id + "-actor_human_yes").attr("checked") === "checked") {
                        params["human"] = 1;
                        var human = 1;
                    } else {
                        params["human"] = 0;
                        var human = 0;
                    }
                }

                $.post("/options/" + request["realm"], params, function(data) {
                    var request = $("#dialog").data("request");
                    var el = {
                        "id": data.id,
                        "name": $("#dialog_option").val()
                    }
                    if(request["realm"] === "scandal_types") {
                        // TODO: append to cuckoo
                        $("#scandal_type").append(Mustache.render(tpl_select_option, el));
                        $("#scandal_type").val(data.id);
                    } else if(request["realm"] === "scandal_subtypes") {
                        // TODO: append to cuckoo
                        $("#scandal_subtype").append(Mustache.render(tpl_select_option, el));
                        $("#scandal_subtype").val(data.id);
                    } else if(request["realm"] === "scandal_consequences") {
                        // TODO: append to cuckoo
                        $("#scandal_consequences_btn").before(Mustache.render(tpl_consequence, el));
                    } else if(request["realm"] === "locations") {
                        cuckoo.locations.push(el);
                        $("#event-" + id + "-location").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-location").val(data.id);
                    } else if(request["realm"] === "event_types") {
                        cuckoo.event_types.push(el);
                        $("#event-" + id + "-type").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-type").val(data.id);
                    } else if(request["realm"] === "event_subtypes") {
                        insert_subtype(cuckoo.event_types, $("#event-" + id + "-type").val(), el);
                        $("#event-" + id + "-subtype").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-subtype").val(data.id);
                    } else if(request["realm"] === "actors") {
                        cuckoo.actors[human].push(el);
                        $("#event-" + id + "-actor").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-actor").val(data.id);
                    } else if(request["realm"] === "actor_types") {
                        cuckoo.actor_types[human].push(el);
                        $("#event-" + id + "-actor_type").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-actor_type").val(data.id);
                    } else if(request["realm"] === "actor_roles") {
                        cuckoo.actor_roles[human].push(el);
                        $("#event-" + id + "-actor_role").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-actor_role").val(data.id);
                    } else if(request["realm"] === "actor_affiliations") {
                        cuckoo.actor_affiliations[human].push(el);
                        $("#event-" + id + "-actor_affiliation").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-actor_affiliation").val(data.id);
                    }

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
        cuckoo.scandal_consequences = data;
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

    /* actors */
    $.getJSON("/options/actors", {"human": 1}, function(data) {
        cuckoo.actors[1] = data;
        initCount();
    });
    $.getJSON("/options/actors", {"human": 0}, function(data) {
        cuckoo.actors[0] = data;
        initCount();
    });

    /* actor_types */
    $.getJSON("/options/actor_types", {"human": 1}, function(data) {
        cuckoo.actor_types[1] = data;
        initCount();
    });
    $.getJSON("/options/actor_types", {"human": 0}, function(data) {
        cuckoo.actor_types[0] = data;
        initCount();
    });

    /* actor_roles */
    $.getJSON("/options/actor_roles", {"human": 1}, function(data) {
        cuckoo.actor_roles[1] = data;
        initCount();
    });
    $.getJSON("/options/actor_roles", {"human": 0}, function(data) {
        cuckoo.actor_roles[0] = data;
        initCount();
    });

    /* actor_affiliations */
    $.getJSON("/options/actor_affiliations", {"human": 1}, function(data) {
        cuckoo.actor_affiliations[1] = data;
        initCount();
    });
    $.getJSON("/options/actor_affiliations", {"human": 0}, function(data) {
        cuckoo.actor_affiliations[0] = data;
        initCount();
    });
}

function initCount() {
    init_counter--;
    if(!init_counter) initDone();
}

function initDone() {
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

            if(data.events.length === 0) {
                add_event_form();
            } else {
                /* load event data */
                $.each(data.events, function(index, value) {
                    add_event_form(value);
                });
            }

            /* hide init label */
            $("#status-line").hide();
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

        scandal["events"] = new Array;
        $("#events li.event").each(function(index, value) {
            var description = $(this).children('[id$="-description"]').val();
            if(description !== "") {
                scandal["events"].push({
                    "location_id": ($(this).children('[id$="-location"]').val() === "0") ? null : parseInt($(this).children('[id$="-location"]').val()),
                    "event_date": $(this).children('[id$="-event_date"]').datepicker("getDate"),
                    "type_id": ($(this).children('[id$="-type"]').val() === "0") ? null : parseInt($(this).children('[id$="-type"]').val()),
                    "subtype_id": ($(this).children('[id$="-subtype"]').val() === "0") ? null : parseInt($(this).children('[id$="-subtype"]').val()),
                    "description": description,
                    "publication_date": $(this).children('[id$="-publication_date"]').datepicker("getDate"),
                    "actor_id": ($(this).children("fieldset").children('[id$="-actor"]').val() === "0") ? null : parseInt($(this).children("fieldset").children('[id$="-actor"]').val()),
                    "actor_type_id": ($(this).children("fieldset").children('[id$="-actor_type"]').val() === "0") ? null : parseInt($(this).children("fieldset").children('[id$="-actor_type"]').val()),
                    "actor_role_id": ($(this).children("fieldset").children('[id$="-actor_role"]').val() === "0") ? null : parseInt($(this).children("fieldset").children('[id$="-actor_role"]').val()),
                    "actor_affiliation_id": ($(this).children("fieldset").children('[id$="-actor_affiliation"]').val() === "0") ? null : parseInt($(this).children("fieldset").children('[id$="-actor_affiliation"]').val())
                });
            }
        });

        var post_url = (scandal_id === null) ? "/api/scandal/new" : "/api/scandal/" + scandal_id;
        $.post(post_url, {"payload": JSON.stringify(scandal)}, function(data) {
            $("#dialog").dialog({ autoOpen: false, title: "Afera zapisana", buttons: {} }).html( "Afera została zapisana w bazie." ).dialog("open");

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
