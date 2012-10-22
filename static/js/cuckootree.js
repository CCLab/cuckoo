// -> cuckootree.init( parent, ...) -> parent
// parent -> select() -> parent
// parent -> addRequestParam -> parent
// parent -> render -> parent (whynot)
// cuckootree.getSelected( parent ) -> [..]
// cuckootree.refreshTrees( realm )

var cuckootree = {
    'init': function(parent_div, realm, options) {
        // parent class for easy styling
        // realm class to help with tree refresh
        parent_div.addClass('cuckootree-parent ' + realm);

        parent_div.html('');

        // add toolbar
        $('<div/>').addClass('cuckootree-toolbar').appendTo(parent_div);

        $('<input type="button" value="Dodaj">').addClass('insert')
            .click(function() {
                var active_node = parent_div.children('.cuckootree-wrapper')
                    .dynatree("getTree").getActiveNode();
                var realm = parent_div.data('cuckootree').realm;
                var params = parent_div.data('cuckootree').requestParams;

                $("#cuckootree-dialog").data('caller', parent_div)
                    .html('<input type="text"><input type="hidden">')
                    .dialog('option', {
                        'title': 'Nowy element',
                        'buttons': {
                            "Zmień": function() {
                                var new_name = $(this).children('input[type="text"]').val();

                                var post_data = { 'name': new_name };
                                if(active_node !== null && $('#cuckootree-dialog-checkbox').is(":checked")) {
                                    post_data['parent'] = active_node.data.id;
                                }
                                if(params["human"] !== undefined)
                                    post_data['human'] = params["human"];

                                $.ajax({
                                    url: '/api/' + realm,
                                    type: 'POST',
                                    data: post_data,
                                    success: function(data, textStatus, jqXHR) {
                                        cuckootree.refreshTrees(realm);
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        alert('Wystąpił błąd podczas dodawania elementu.');
                                    }
                                });

                                $(this).dialog('close');
                            }
                        }
                    });

                if(active_node !== null) {
                    $('#cuckootree-dialog').prepend('<input type="checkbox" checked="checked"'
                        + ' id="cuckootree-dialog-checkbox">'
                        + ' <label for="cuckootree-dialog-checkbox">dodaj pod <em>'
                        + active_node.data.title + '</em></label><br>');
                }

                $('#cuckootree-dialog').dialog('open');
                $('#cuckootree-dialog input[type="text"]').focus();
            })
            .appendTo(parent_div.children('.cuckootree-toolbar'));

        $('<input type="button" value="Zmień nazwę">').addClass('rename')
            .click(function() {
                var active_node = parent_div.children('.cuckootree-wrapper')
                    .dynatree("getTree").getActiveNode();
                var realm = parent_div.data('cuckootree').realm;

                if(active_node !== null) {
                    $("#cuckootree-dialog")
                        .html('<input type="text">')
                        .dialog('option', {
                            'title': 'Zmiana nazwy',
                            'buttons': {
                                "Zmień": function() {
                                    var new_name = $(this).children('input[type="text"]').val();

                                    $.ajax({
                                        url: '/api/' + realm + '/' + active_node.data.id,
                                        type: 'POST',
                                        data: { 'name': new_name },
                                        success: function(data, textStatus, jqXHR) {
                                            cuckootree.refreshTrees(realm);
                                        },
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            alert('Wystąpił błąd podczas zmiany elementu.');
                                        }
                                    });

                                    $(this).dialog('close');
                                }
                            }
                        })
                        .dialog('open');
                } else alert('Nie wybrano elementu do zmiany.');
            })
            .appendTo(parent_div.children('.cuckootree-toolbar'));

        $('<input type="button" value="Usuń">').addClass('delete')
            .click(function() {
                var active_node = parent_div.children('.cuckootree-wrapper')
                    .dynatree("getTree").getActiveNode();
                var realm = parent_div.data('cuckootree').realm;

                if(active_node !== null) {
                    $.ajax({
                        url: '/api/' + realm + '/' + active_node.data.id,
                        type: 'DELETE',
                        success: function(data, textStatus, jqXHR) {
                            cuckootree.refreshTrees(realm);
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            alert('Wystąpił błąd podczas usuwania elementu.');
                        }
                    });
                } else alert('Nie wybrano elementu do usunięcia.');
            })
            .appendTo(parent_div.children('.cuckootree-toolbar'));

        // add div for dynatree
        $('<div/>').addClass('cuckootree-wrapper').appendTo(parent_div);

        // create returned object
        var ctree = {
            'parent_div': parent_div,
            'realm': realm,
            'selected': [],
            'requestParams': {},
            'select': function(selected) {
                if(typeof(selected) !== "undefined") {
                    this.selected = selected;
                }

                return this;
            },
            'addRequestParam': function(name, value) {
                this.requestParams[name] = value;

                return this;
            },
            'render': function() {
                // WTF below
                var treeId = Math.floor(Math.random()*1001);
                this.parent_div.children('.cuckootree-wrapper')
                    .dynatree({
                        onPostInit: function(isReloading, isError) {
                            var cuckootree = $(this.divTree).parents('.cuckootree-parent').data('cuckootree');
                            this.visit(function(node) {
                                if($.inArray(node.data.id, cuckootree.selected) >= 0) {
                                    node.select(true);
                                    node.makeVisible();
                                }
                            }, false);
                        },
                        checkbox: true,
                        selectMode: 3,
                        initAjax: {
                            url: '/api/' + this.realm,
                            data: this.requestParams
                        },
                        // for multiple trees on one page
                        cookieId: treeId,
                        idPrefix: treeId
                    });
            }
        };
        parent_div.data('cuckootree', ctree);
        return ctree;
    },
    'getSelected': function(parent_div) {
        var selected = new Array();
        parent_div.children('.cuckootree-wrapper').dynatree("getRoot").visit(function(node) {
            if(node.isSelected()) { selected.push(node.data.id); }
        });
        return selected;
    },
    'refreshTrees': function(realm) {
        $('.cuckootree-parent.' + realm + ' .cuckootree-wrapper').each(function(index, element) {
            var dynatree = $(this).dynatree('getTree');

            var cuckootree = $(dynatree.divTree).parents('.cuckootree-parent').data('cuckootree');
            cuckootree.selected = new Array();
            dynatree.visit(function(node) {
                if(node.isSelected()) { cuckootree.selected.push(node.data.id); }
            }, false);

            dynatree.reload();
        });
    }
};

$(function() {
    $("body").prepend('<div id="cuckootree-dialog"></div>');
    $("#cuckootree-dialog").dialog({
        autoOpen: false,
        resizable: false
    });
});
