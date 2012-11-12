var cuckoo = {}
cuckoo.scandal_types = [];
cuckoo.event_types = [];
cuckoo.locations = [];
cuckoo.actors = {};
cuckoo.actor_types = {};
cuckoo.actor_roles = {};
cuckoo.actor_affiliations = {};

var scandal_id = null;
var event_counter = 1;
var init_counter = 11;

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
// FIXME: this is nasty
var tpl_event_form = '<li class="event">'
    + '<span class="delete-toolbar">'
    + '<input type="button" class="button-small" value="↑" onclick="move_event(this, \'up\')">'
    + ' <input type="button" class="button-small" value="↓" onclick="move_event(this, \'down\')">'
    + ' <input type="button" class="button-small" value="Usuń wydarzenie" onclick="delete_event(this)">'
    + '</span>'
    + '<input type="hidden" class="event_id" value="0">'
    + '{{{select_locations}}}'
    + ' <input type="button" onclick="add_option_popup(this, \'locations\')" class="button-small" value="+">'
    + '<br>Data wydarzenia'
    + '<br><div id="event-{{id}}-event_date"></div>'
    + '<br>Typ wydarzenia'
    + '<br><div id="event-{{id}}-type_tree"></div>'
    + '<br><label for="event-{{id}}-description">Opis</label>'
    + '<br><textarea id="event-{{id}}-description" rows="8" cols="50"></textarea>'
    + '<h3>Aktorzy</h3>'
    + '<ul class="actors boxed-list">'
    + '<li class="btn-add-actor"><input class="flat-button" type="button" onclick="add_actor_form(this)" value="Dodaj aktora"></li>'
    + '</ul>'
    + '<h3>Bibliografia</h3>'
    + '<ul class="refs boxed-list">'
    + '<li class="btn-add-ref"><input class="flat-button" type="button" onclick="add_ref_form(this)" value="Dodaj pozycję"></li>'
    + '</ul>'
    + '</li>';
/* TODO: actor form accessablility (add label for and input id attributes) */
var tpl_actor_form = '<li class="actor">'
    + '<input type="radio" value="0"> <label>instytucja</label>'
    + '<input type="radio" value="1"> <label>osoba</label>'
    + '<br><label>Nazwa</label> <select class="actor_name"></select>'
    + ' <input type="button" onclick="add_option_popup(this, \'actors\')" class="button-small" value="+">'
    + '<br><label>Typy</label><br><div class="actor_type"></div>'
    + '<br><label>Role</label><br><div class="actor_role"></div>'
    + '<br><label>Afiliacje</label><br><div class="actor_affiliation"></div>'
    + '<br><label>Tagi (oddzielone średnikiem)</label> <input type="text" class="actor_tags">'
    + '</li>';
/* TODO: ref form accessability (see actor form TODO) */
var tpl_ref_form = '<li class="ref">'
    + '<input type="hidden" class="ref_id" value="0">'
    + '<label>Tytuł publikacji</label> <input type="text" class="ref_pub_title">'
    + '<br><label>Tytuł artykułu</label> <input type="text" class="ref_art_title">'
    + '<br><label>URL</label> <input type="text" class="ref_url">'
    + '<br><input type="checkbox" class="ref_pub_date_flag"> <label>Data publikacji</label>'
    + '<br><div class="ref_pub_date"></div>'
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

    if(typeof(event_dict) !== "undefined") {
        // fill with data from event_dict

        // set event_id
        $("#event-" + event_counter + "-location").parent().find("input.event_id").val(event_dict.id);

        $("#event-" + event_counter + "-location").val( event_dict.location_id );
        $("#event-" + event_counter + "-event_date").datepicker("setDate", event_dict.event_date);
        $("#event-" + event_counter + "-description").val( event_dict.description );

        cuckootree.init( $('#event-' + event_counter + '-type_tree'), 'event_types' )
            .select(event_dict.types).render();

        // actors
        var link = $("#event-" + event_counter + "-type_tree").parent().find(".btn-add-actor > input");
        $.each(event_dict.actors, function(index, value) {
            add_actor_form(link, value);
        });

        // refs
        var reflink = $("#event-" + event_counter + "-type_tree").parent().find(".btn-add-ref > input");
        $.each(event_dict.refs, function(index, value) {
            add_ref_form(reflink, value);
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

    /* bind change event to actor_affiliation to create a new tag */
    /*actor_form.children('.actor_affiliation').change(function() {
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
    });*/

    // bind change event to actor_human radio button
    actor_form.children('input[type="radio"][value="0"]').change(function() {
        // HACK for lack of input radio name
        actor_form.children('input[type="radio"][value="1"]').removeAttr("checked");
        // end HACK

        actor_form.children(".actor_name").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $.each(cuckoo.actors[0], function(index, value) {
            actor_form.children(".actor_name").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_name").removeAttr("disabled");

        cuckootree.init( actor_form.children(".actor_type"), 'actor_types' )
            .addRequestParam('human', 0)
            .render();
        cuckootree.init( actor_form.children(".actor_role"), 'actor_roles' )
            .addRequestParam('human', 0)
            .render();
        cuckootree.init( actor_form.children(".actor_affiliation"), 'actor_affiliations' )
            .addRequestParam('human', 0)
            .render();
    });
    actor_form.children('input[type="radio"][value="1"]').change(function() {
        // HACK for lack of input radio name
        actor_form.children('input[type="radio"][value="0"]').removeAttr("checked");
        // end HACK

        actor_form.children(".actor_name").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
        $.each(cuckoo.actors[1], function(index, value) {
            actor_form.children(".actor_name").append(Mustache.render(tpl_select_option, value));
        });
        actor_form.children(".actor_name").removeAttr("disabled");

        cuckootree.init( actor_form.children(".actor_type"), 'actor_types' )
            .addRequestParam('human', 1)
            .render();
        cuckootree.init( actor_form.children(".actor_role"), 'actor_roles' )
            .addRequestParam('human', 1)
            .render();
        cuckootree.init( actor_form.children(".actor_affiliation"), 'actor_affiliations' )
            .addRequestParam('human', 1)
            .render();
    });

    // insert data form actor_dict
    if(typeof(actor_dict) !== "undefined") {
        if(find_if_human(actor_dict.id)) {
            actor_form.children('input[type="radio"][value="1"]').attr("checked", "checked");

            actor_form.children(".actor_name").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
            $.each(cuckoo.actors[1], function(index, value) {
                actor_form.children(".actor_name").append(Mustache.render(tpl_select_option, value));
            });
            actor_form.children(".actor_name").removeAttr("disabled");
        } else {
            actor_form.children('input[type="radio"][value="0"]').attr("checked", "checked");

            actor_form.children(".actor_name").attr("disabled", "disabled").html('<option value="0">(brak)</option>');
            $.each(cuckoo.actors[0], function(index, value) {
                actor_form.children(".actor_name").append(Mustache.render(tpl_select_option, value));
            });
            actor_form.children(".actor_name").removeAttr("disabled");
        }

        actor_form.children(".actor_name").val(actor_dict.id);

        if(actor_dict.tags !== null) {
            actor_form.children(".actor_tags").val(actor_dict.tags.join("; "));
        }

        var human_param = find_if_human(actor_dict.id) ? 1 : 0;
        cuckootree.init( actor_form.children(".actor_type"), 'actor_types' )
            .addRequestParam('human', human_param)
            .select(actor_dict.types).render();
        cuckootree.init( actor_form.children(".actor_role"), 'actor_roles' )
            .addRequestParam('human', human_param)
            .select(actor_dict.roles).render();
        cuckootree.init( actor_form.children(".actor_affiliation"), 'actor_affiliations' )
            .addRequestParam('human', human_param)
            .select(actor_dict.affiliations).render();
    }
}

function add_ref_form(link, ref_dict) {
    var form_dict = {};
    $(link).parents(".refs").children(".btn-add-ref").before(Mustache.render(tpl_ref_form, form_dict));
    var ref_form = $(link).parents(".refs").children(".ref").last();

    ref_form.children(".ref_pub_date").datepicker({changeMonth: true, changeYear: true, firstDay: 1, yearRange: "1980:2012", dateFormat: "yy-mm-dd"});

    // insert data form ref_dict
    if(typeof(ref_dict) !== "undefined") {
        ref_form.children(".ref_id").val(ref_dict.id);
        ref_form.children(".ref_pub_title").val(ref_dict.pub_title);
        ref_form.children(".ref_art_title").val(ref_dict.art_title);
        ref_form.children(".ref_url").val(ref_dict.url);
        if(ref_dict.pub_date !== null) {
            ref_form.children(".ref_pub_date_flag").attr("checked", "checked");
            ref_form.children(".ref_pub_date").datepicker("setDate", ref_dict.pub_date);
        }
    }
}

function add_option_popup(link, option_realm) {
    /* possible realms:
     *
     * scandal_types, scandal_subtypes (parent from #scandal_type)
     * event_types
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

function delete_event(button) {
    $(button).parents('.event').hide('slow', function() {
        $(this).remove();
    });
}

function move_event(button, direction) {
    var event_div = $(button).parents('.event');

    if(direction === 'up')         var target = event_div.prev();
    else if(direction === 'down')  var target = event_div.next();
    
    if(target.length == 0) {
        if(direction === 'up')         alert('Nie można przenieść wyżej!');
        else if(direction === 'down')  alert('Nie można przenieść niżej!');
        return;
    }

    if(direction === 'up')         target.before(event_div);
    else if(direction === 'down')  target.after(event_div);
}

function init() {
    /* scandal_types */
    $.getJSON("/options/scandal_types", function(data) {
        cuckoo.scandal_types = data;
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
    // which scandal are we talking about, again?
    // TODO: don't extract it from the URL, put some JS
    // in the template instead
    var path = window.location.pathname.split("/");
    var scandal_str = parseInt(path[path.length-1]);
    scandal_id = isNaN(scandal_str) ? null : scandal_str;

    // if id was given, load me some scandal data
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
        // hide init label
        $("#status-line").hide();

        // add one scandal name field
        add_scandal_name_field();

        // add scandal type tree
        cuckootree.init( $('#scandal_type'), 'scandal_types' ).render();
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

        scandal["types"] = cuckootree.getSelected( $("#scandal_type") );

        scandal["events"] = new Array;
        $("#events li.event").each(function(index, value) {
            var description = $(this).children('[id$="-description"]').val();
            if(description !== "") {
                var event_dict = {
                    "id": $(this).children('.event_id').val(),
                    "location_id": ($(this).children('[id$="-location"]').val() === "0") ? null : parseInt($(this).children('[id$="-location"]').val()),
                    "event_date": $(this).children('[id$="-event_date"]').datepicker("getDate"),
                    "description": description,
                    "actors": [],
                    "refs": []
                };

                event_dict["types"] = cuckootree.getSelected( $(this).children('[id$="-type_tree"]') );

                $(this).children(".actors").children(".actor").each(function(index, value) {
                    var actor_dict = {
                        "id": ($(value).children(".actor_name").val() === "0" ? null : $(value).children(".actor_name").val()),

                        "tags": $(value).children(".actor_tags").val().split(";")
                    }

                    actor_dict['types'] = cuckootree.getSelected( $(value).children('.actor_type') );
                    actor_dict['roles'] = cuckootree.getSelected( $(value).children('.actor_role') );
                    actor_dict['affiliations'] = cuckootree.getSelected( $(value).children('.actor_affiliation') );

                    event_dict['actors'].push(actor_dict);
                });

                $(this).children(".refs").children(".ref").each(function(index, value) {
                    var pub_date = null;
                    if($(value).children('.ref_pub_date_flag').is(':checked')) {
                        pub_date = $(value).children('.ref_pub_date').datepicker("getDate");
                    }
                    event_dict["refs"].push({
                        "id": $(value).children(".ref_id").val(),
                        "pub_title": $(value).children(".ref_pub_title").val(),
                        "art_title": $(value).children(".ref_art_title").val(),
                        "url": $(value).children(".ref_url").val(),
                        "pub_date": pub_date
                    });
                });

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

    $.Shortcuts.add({
        type: 'down',
        mask: 'e',
        handler: function() {
            add_event_form();

            // scroll to the new event form
            var pos = $('#events .event:last').position().top - $("#toolbar").outerHeight();
            $(window).scrollTop(pos);
        }
    });
    $.Shortcuts.start();
});
