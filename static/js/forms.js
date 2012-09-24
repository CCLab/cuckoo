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
var tpl_input_text = '<input type="text" value="{{value}}">';
var tpl_consequence = '<input type="checkbox" id="scandal_consequence-{{id}}" value="{{id}}"><label for="scandal_consequence-{{id}}">{{name}}</label>';
// FIXME: this is nasty
var tpl_event_form = '<li class="event">'
    + '{{{select_locations}}}'
    + ' <input type="button" onclick="add_option_popup(this, \'locations\')" class="button-small" value="+">'
    + '<br>Data wydarzenia'
    + '<br><div id="event-{{id}}-event_date"></div>'
    + '<br>Typ wydarzenia'
    + '<br><div id="event-{{id}}-type_tree"></div>'
    + '<br><label for="event-{{id}}-description">Opis</label>'
    + '<br><textarea id="event-{{id}}-description" rows="8" cols="50"></textarea>'
    + '<br><input type="checkbox" id="event-{{id}}-publication_date_flag"> <label for="event-{{id}}-publication_date_flag">Data publikacji</label>'
    + '<br><div id="event-{{id}}-publication_date"></div>'
    + '<h3>Aktorzy</h3>'
    + '<ul class="actors boxed-list">'
    + '<li class="btn-add-actor"><input class="flat-button" type="button" onclick="add_actor_form(this)" value="Dodaj aktora"></li>'
    + '</ul>'
    + '</li>';
/* TODO: actor form accessablility (add label for and input id attributes) */
var tpl_actor_form = '<li class="actor">'
    + '<input type="radio" value="0"> <label>instytucja</label>'
    + '<input type="radio" value="1"> <label>osoba</label>'
    + '<br><label>Nazwa</label> <select class="actor_name"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actors\')" class="button-small" value="+">'
    + '<br><label>Typ</label> <select class="actor_type"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actor_types\')" class="button-small" value="+">'
    + '<br><label>Rola</label> <select class="actor_role"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actor_roles\')" class="button-small" value="+">'
    + '<br><label>Afiliacja</label> <select class="actor_affiliation"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actor_affiliations\')" class="button-small" value="+">'
    + '<br><label>Tagi (oddzielone średnikiem)</label> <input type="text" class="actor_tags">'
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
    return [];
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

function add_scandal_name_field(name) {
    tpl_data = {};
    if(typeof(name) !== "undefined") {
        tpl_data["value"] = name;
    }
    $("#toolbar .scandal_names #add_scandal_name").before(Mustache.render(tpl_input_text, tpl_data));
    $("body.scandal-form").css("padding-top", $("#toolbar").outerHeight());
}

function add_event_form(event_dict) {
    form_dict = { "id": event_counter };

    var locations = $.extend(true, {}, select_stub);
    locations["items"] = cuckoo.locations;
    locations["id"] = "event-" + event_counter + "-location";
    locations["name"] = "Lokacja";
    form_dict["select_locations"] = Mustache.render(tpl_select, locations);

    /* add new event form to the bottom, just before the button */
    $("#btn-add-event").before(Mustache.render(tpl_event_form, form_dict));


    /* enable datepicker */
    $("#event-" + event_counter + "-event_date").datepicker({changeMonth: true, changeYear: true, firstDay: 1, yearRange: "1980:2012", dateFormat: "yy-mm-dd"});
    $("#event-" + event_counter + "-publication_date").datepicker({changeMonth: true, changeYear: true, firstDay: 1, yearRange: "1980:2012", dateFormat: "yy-mm-dd"});

    /* bind change event to publication date flag */
    $("#event-" + event_counter + "-publication_date_flag").change(function() {
        var id = $(this).parents("li").data("id");
        if($(this).is(":checked")) {
            $("#event-" + id + "-publication_date").show();
        } else {
            $("#event-" + id + "-publication_date").hide();
        }
    });

    if(typeof(event_dict) !== "undefined") {
        // fill with data from event_dict
        $("#event-" + event_counter + "-location").val( event_dict.location_id );
        $("#event-" + event_counter + "-event_date").datepicker("setDate", event_dict.event_date);
        $("#event-" + event_counter + "-description").val( event_dict.description );

        if(event_dict.publication_date === null) {
            $("#event-" + event_counter + "-publication_date_flag").removeAttr("checked").change();
        } else {
            $("#event-" + event_counter + "-publication_date_flag").attr("checked", "checked").change();
        }
        $("#event-" + event_counter + "-publication_date").datepicker("setDate", event_dict.publication_date);

        cuckootree.init( $('#event-' + event_counter + '-type_tree'), 'event_types' )
            .select(event_dict.types).render();

        var link = $("#event-" + event_counter + "-type").parent().find(".btn-add-actor > input");
        $.each(event_dict.actors, function(index, value) {
            add_actor_form(link, value);
        });
    } else {
        // prepare empty
        cuckootree.init( $('#event-' + event_counter + '-type_tree'), 'event_types' ).render();
    }

    event_counter++;
}

function add_actor_form(link, actor_dict) {
    var form_dict = {};
    $(link).parents(".actors").children(".btn-add-actor").before(Mustache.render(tpl_actor_form, form_dict));
    var actor_form = $(link).parents(".actors").children(".actor").last();
    actor_form.children(".actor_name").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    actor_form.children(".actor_type").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    actor_form.children(".actor_role").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
    actor_form.children(".actor_affiliation").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

    /* bind change event to actor_affiliation to create a new tag */
    actor_form.children('.actor_affiliation').change(function() {
        if(actor_form.children('.actor_tags').val() === "") {
            var human = 0;
            if(actor_form.children('input[type="radio"][value="1"]').attr("checked") === "checked") { 
                human = 1;
            }

            var affs = cuckoo.actor_affiliations[human];
            var aff_id = actor_form.children('.actor_affiliation').val();
            for(var i = 0; i < affs.length; i++) {
                if(affs[i]['id'] == aff_id) {
                    actor_form.children('.actor_tags').val(affs[i]['name']);
                }
            }
        }
    });

    /* bind change event to actor_human radio button */
    actor_form.children('input[type="radio"][value="0"]').change(function() {
        // HACK for lack of input radio name
        actor_form.children('input[type="radio"][value="1"]').removeAttr("checked");
        // end HACK

        /* disable controls */
        actor_form.children(".actor_name").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        actor_form.children(".actor_type").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        actor_form.children(".actor_role").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        actor_form.children(".actor_affiliation").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

        /* reload values and enable */
        $.each(cuckoo.actors[0], function(index, value) {
            actor_form.children(".actor_name").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_name").removeAttr("disabled");
        $.each(cuckoo.actor_types[0], function(index, value) {
            actor_form.children(".actor_type").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_type").removeAttr("disabled");
        $.each(cuckoo.actor_roles[0], function(index, value) {
            actor_form.children(".actor_role").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_role").removeAttr("disabled");
        $.each(cuckoo.actor_affiliations[0], function(index, value) {
            actor_form.children(".actor_affiliation").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_affiliation").removeAttr("disabled");
    });
    actor_form.children('input[type="radio"][value="1"]').change(function() {
        // HACK for lack of input radio name
        actor_form.children('input[type="radio"][value="0"]').removeAttr("checked");
        // end HACK

        /* disable controls */
        actor_form.children(".actor_name").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        actor_form.children(".actor_type").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        actor_form.children(".actor_role").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        actor_form.children(".actor_affiliation").attr("disabled", "disabled").html('<option value="0">(brak)</option>');

        /* reload values and enable */
        $.each(cuckoo.actors[1], function(index, value) {
            actor_form.children(".actor_name").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_name").removeAttr("disabled");
        $.each(cuckoo.actor_types[1], function(index, value) {
            actor_form.children(".actor_type").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_type").removeAttr("disabled");
        $.each(cuckoo.actor_roles[1], function(index, value) {
            actor_form.children(".actor_role").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_role").removeAttr("disabled");
        $.each(cuckoo.actor_affiliations[1], function(index, value) {
            actor_form.children(".actor_affiliation").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_affiliation").removeAttr("disabled");
    });

    /* insert data form actor_dict */
    if(typeof(actor_dict) !== "undefined") {
        if(find_if_human(actor_dict.id)) {
            actor_form.children('input[type="radio"][value="1"]').attr("checked", "checked").change();
        } else {
            actor_form.children('input[type="radio"][value="0"]').attr("checked", "checked").change();
        }
        actor_form.children(".actor_name").val(actor_dict.id);
        actor_form.children(".actor_type").val(actor_dict.type_id);
        actor_form.children(".actor_role").val(actor_dict.role_id);
        actor_form.children(".actor_affiliation").val(actor_dict.affiliation_id);
        if(actor_dict.tags !== null) {
            actor_form.children(".actor_tags").val(actor_dict.tags.join("; "));
        }
    }
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
    else if(option_realm === "actors")               dialog_title = "Dodaj nazwę aktora";
    else if(option_realm === "actor_types")          dialog_title = "Dodaj typ aktora";
    else if(option_realm === "actor_roles")          dialog_title = "Dodaj rolę aktora";
    else if(option_realm === "actor_affiliations")   dialog_title = "Dodaj afiliację aktora";

    /* create dialog box */
    $("#dialog").data("request", request).dialog({
        title: dialog_title,
        buttons: {
            "Dodaj": function() {
                var request = $(this).data("request");
                var id = $(request["caller"]).parents("li").data('id');
                
                var actor_form = $(request["caller"]).parents(".actor");

                var params = {};
                params["name"] = $("#dialog_option").val();
                if(request["realm"] === "scandal_subtypes") params["parent"] = $("#scandal_type").val();
                else if(request["realm"] === "event_subtypes") params["parent"] = $("#event-" + id + "-type").val();
                else if(request["realm"] === "actors" || request["realm"] === "actor_types" || request["realm"] === "actor_roles" || request["realm"] === "actor_affiliations") {
                    if(actor_form.children('input[type="radio"][value="1"]').attr("checked") === "checked") {
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
                        $("#scandal_type").val(data.id).change();
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
                        cuckoo.event_types.push({"id": el.id, "name": el.name, "children": []});
                        $("#event-" + id + "-type").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-type").val(data.id).change();
                    } else if(request["realm"] === "event_subtypes") {
                        insert_subtype(cuckoo.event_types, $("#event-" + id + "-type").val(), el);
                        $("#event-" + id + "-subtype").append(Mustache.render(tpl_select_option, el));
                        $("#event-" + id + "-subtype").val(data.id);
                    } else if(request["realm"] === "actors") {
                        cuckoo.actors[human].push(el);
                        actor_form.children(".actor_name").append(Mustache.render(tpl_select_option, el));
                        actor_form.children(".actor_name").val(data.id);
                    } else if(request["realm"] === "actor_types") {
                        cuckoo.actor_types[human].push(el);
                        actor_form.children(".actor_type").append(Mustache.render(tpl_select_option, el));
                        actor_form.children(".actor_type").val(data.id);
                    } else if(request["realm"] === "actor_roles") {
                        cuckoo.actor_roles[human].push(el);
                        actor_form.children(".actor_role").append(Mustache.render(tpl_select_option, el));
                        actor_form.children(".actor_role").val(data.id);
                    } else if(request["realm"] === "actor_affiliations") {
                        cuckoo.actor_affiliations[human].push(el);
                        actor_form.children(".actor_affiliation").append(Mustache.render(tpl_select_option, el));
                        actor_form.children(".actor_affiliation").val(data.id);
                    }

                    $("#dialog").dialog("close");
                }, "json");
            }
        }
        }).html('<input type="text" id="dialog_option">');

        $("#dialog_option").keyup(function(event){
            if(event.keyCode == 13){
                $(".ui-dialog .ui-dialog-buttonset button").click();
            }
        }).focus();
}

function init() {
    /* scandal_types */
    $.getJSON("/options/scandal_types", function(data) {
        cuckoo.scandal_types = data;
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
            for(i=0; i<data.name.length; i++) {
                add_scandal_name_field(data.name[i]);
            }

            $("#scandal_description").val(data.description);

            if(data.tags !== null) {
                $("#scandal_tags").val(data.tags.join("; "));
            }
    
            cuckootree.init( $('#scandal_type'), 'scandal_types' )
                .select(data.types)
                //.addRequestParam('human', 0)
                .render();

            $.each(data.consequences, function(index, value) {
                $("#scandal_consequence-"+value).attr("checked", "checked");
            });
            
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
    else
    {
        /* hide init label */
        $("#status-line").hide();

        /* add one scandal name field */
        add_scandal_name_field();
    }

    /* form handlers */

    $("#form-scandal").submit(function() {
        var scandal = {
            "description": $("#scandal_description").val(),
            "type_id": ($("#scandal_type").val() === "0") ? null : parseInt($("#scandal_type").val()),
            "subtype_id": ($("#scandal_subtype").val() === "0") ? null : parseInt($("#scandal_subtype").val()),
            "tags": $("#scandal_tags").val().split(";")
        };

        scandal["name"] = new Array();
        $('#toolbar .scandal_names input[type="text"]').each(function(index, value) {
            if($(this).val() !== "") {
                scandal["name"].push($(this).val());
            }
        });

        scandal["consequences"] = new Array();
        $("#scandal_consequences input:checkbox:checked").each(function(index, value) {
            scandal["consequences"].push(parseInt($(this).val()));
        });

        scandal["types"] = cuckootree.getSelected( $("#scandal_type") );

        scandal["events"] = new Array;
        $("#events li.event").each(function(index, value) {
            var description = $(this).children('[id$="-description"]').val();
            if(description !== "") {
                var event_dict = {
                    "location_id": ($(this).children('[id$="-location"]').val() === "0") ? null : parseInt($(this).children('[id$="-location"]').val()),
                    "event_date": $(this).children('[id$="-event_date"]').datepicker("getDate"),
                    "description": description,
                    "publication_date": $(this).children('[id$="-publication_date"]').datepicker("getDate"),
                    "actors": []
                };
                if(!$(this).children('[id$="-publication_date_flag"]').is(":checked"))
                {
                    event_dict.publication_date = null;
                }

                event_dict["types"] = cuckootree.getSelected( $(this).children('[id$="-type_tree"]') );

                $(this).children(".actors").children(".actor").each(function(index, value) {
                    event_dict["actors"].push({
                        "id": ($(value).children(".actor_name").val() === "0" ? null : $(value).children(".actor_name").val()),
                        "type_id": ($(value).children(".actor_type").val() === "0" ? null : $(value).children(".actor_type").val()),
                        "role_id": ($(value).children(".actor_role").val() === "0" ? null : $(value).children(".actor_role").val()),

                        "affiliation_id": ($(value).children(".actor_affiliation").val() === "0" ? null : $(value).children(".actor_affiliation").val()),
                        "tags": $(value).children(".actor_tags").val().split(";")
                    });
                });

                // references go in here

                scandal["events"].push(event_dict);
            }
        });

        var post_url = (scandal_id === null) ? "/api/scandal/new" : "/api/scandal/" + scandal_id;
        $.post(post_url, {"payload": JSON.stringify(scandal)}, function(data) {
            window.location.href = "/";
        }, "json");

        // prevent the form from being sent the old-fashioned way
        return false;
    });
}

$(document).ready(function() {
    init();
});
