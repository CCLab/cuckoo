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

$(document).ready(function() {
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

        /* load scandal data */
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
        });
    });

    $.getJSON("/options/scandal_consequences", function(data) {
        $.each(data, function(index, value) {
            $("#consequences").append('<input type="checkbox" id="consequence-'+value.id+'"><label for="consequence-'+value.id+'">'+value.name+'</label>');
        });
    });
});
