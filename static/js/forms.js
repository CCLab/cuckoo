function groupByPrefix(dict, prefix) {
    console.log("prefix is " + prefix);
    for (var key in dict) {
        console.log(key + " :: " + dict[key]);
    }
}

$(document).ready(function() {
    $("#form-add-scandal").submit(function() {
        var scandal = {};
        $('input[type="text"]').each(function() {
            scandal[$(this).attr('name')] = $(this).val();
        });
        $('input[type="checkbox"]').each(function() {
            scandal[$(this).attr('name')] = ( $(this).attr('checked') == "checked" ? true : false );
        });

        groupByPrefix(scandal, "name");

        $.post("/add-scandal", {'json': JSON.stringify(scandal)}, function(data) {
            $("#dialog-scandal").dialog({ autoOpen: false, title: "Afera dodana" }).html('Dodaj <a href="/add-timeline/'+data.scandal_id+'">wydarzenia do tej afery</a> lub przejdź do <a href="/">strony głównej</a>.').dialog("open")
        });

        return false;
    });

    $("#form-add-timeline").submit(function() {
        var scandal = {};
        $('input[type="text"]').each(function() {
            scandal[$(this).attr('name')] = $(this).val();
        });
        $('textarea').each(function() {
            scandal[$(this).attr('name')] = $(this).val();
        });
        for (var i = 1; i<51; i++)
        {
            // TODO get the right date strings
            scandal['date-'+i] = $("#datepicker-"+i).datepicker("getDate");
        }

        groupByPrefix(scandal, "name");

        var scandal_id = $("#scandal_id").val();

        $.post("/add-timeline/" + scandal_id, {'json': JSON.stringify(scandal)}, function(data) {
            $("#dialog-timeline").dialog({ autoOpen: false, title: "Wydarzenia dodane" }).html('Dodaj <a href="/add-scandal">nową aferę</a> lub przejdź do <a href="/">strony głównej</a>.').dialog("open")
        });

        return false;
    });
});
