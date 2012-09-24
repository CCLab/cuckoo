<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Scandal form</title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/jquery-ui-1.8.18.custom.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/ui.dynatree.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/cuckootree.css" />
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Pontano+Sans&subset=latin,latin-ext">
    <script src="/static/js/jquery-1.7.1.min.js"></script>
    <script src="/static/js/jquery-ui-1.8.18.custom.min.js"></script>
    <script src="/static/js/jquery.dynatree.min.js"></script>
    <script src="/static/js/mustache.js"></script>
    <script src="/static/js/cuckootree.js"></script>
    <script src="/static/js/forms.js"></script>
</head>
<body class="scandal-form">
    <section>
        <div id="status-line">Inicjalizacja</div>
        <div id="dialog"></div>
        <form action="/add-scandal" method="post" id="form-scandal">
            <div id="toolbar">
                <span class="label-scandal_names">Nazwa</span>
                <span class="buttons">
                    <input class="flat-button" type="submit" value="{{save}}" />
                    <a href="/">{{cancel}}</a>
                </span>
                <div class="scandal_names">
                    <input type="button" value="+" id="add_scandal_name" onclick="add_scandal_name_field()" class="button-small">
                </div>
            </div>

            <label for="scandal_description">Krótki opis</label><br><textarea id="scandal_description" rows="8" cols="50"></textarea>
            <br>Typ afery
            <br><div id="scandal_type"></div>
            <fieldset id="scandal_consequences">
                <legend>Szersze konsekwencje</legend>
                <input type="button" onclick="add_option_popup(this, 'scandal_consequences')" id="scandal_consequences_btn" class="button-small" value="+">
            </fieldset>
            <label for="scandal_tags">Tagi (oddzielone średnikiem)</label> <input type="text" id="scandal_tags" />

            <h2>Wydarzenia</h2>
            <ul class="boxed-list event-list" id="events">
                <!-- thou shalt load forms dynamically -->
                <li id="btn-add-event"><input class="flat-button" type="button" onclick="add_event_form()" value="Dodaj wydarzenie"></li>
            </ul>
        </form>
    </section>
</body>
