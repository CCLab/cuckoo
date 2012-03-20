<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{scandal_title}} - {{title}}</title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/jquery-ui-1.8.18.custom.css" />
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Pontano+Sans&subset=latin,latin-ext">
    <script src="/static/js/jquery-1.7.1.min.js"></script>
    <script src="/static/js/jquery-ui-1.8.18.custom.min.js"></script>
    <script src="/static/js/forms.js"></script>
    <script>
        $(document).ready(function() {
%for i in range(1,51):
            $("#datepicker-{{i}}").datepicker({changeMonth: true, changeYear: true, firstDay: 1, yearRange: "1970:2012"});
%end
        });
    </script>
</head>
<body>
    <header>
        <h1>Dodaj wydarzenia</h1>
        <p>Afera {{scandal_id}}: {{scandal_title}}</p>
    </header>
    <section>
        <div id="post-box">
        </div>
        <form action="/add-timeline" method="post" id="form-add-timeline">
            <input type="hidden" id="scandal_id" value="{{scandal_id}}" />
            <div id="dialog-timeline"></div>
%for i in range(1,51):
            <fieldset>
                <legend>Wydarzenie {{i}}</legend>
                <div id="datepicker-{{i}}"></div>
                <br><textarea name="description-{{i}}" rows="12" cols="80"></textarea>
            </fieldset>
%end
            <input type="submit" value="Dodaj" /> <a href="/">Anuluj</a>
        </form>
    </section>
</body>
