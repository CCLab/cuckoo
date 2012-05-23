<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Scandal form</title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/jquery-ui-1.8.18.custom.css" />
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Pontano+Sans&subset=latin,latin-ext">
    <script src="/static/js/jquery-1.7.1.min.js"></script>
    <script src="/static/js/jquery-ui-1.8.18.custom.min.js"></script>
    <script src="/static/js/mustache.js"></script>
    <script src="/static/js/forms.js"></script>
</head>
<body>
    <section>
        <div id="status-line">Inicjalizacja</div>
        <div id="dialog"></div>
        <form action="/add-scandal" method="post" id="form-scandal">
            <label for="scandal_name">Nazwa</label> <input type="text" id="scandal_name" />
            <input type="submit" value="{{save}}" /> <a href="/">{{cancel}}</a>

            <br><label for="scandal_description">Krótki opis</label><br><textarea id="scandal_description" rows="8" cols="50"></textarea>
            <br><label for="scandal_type">Typ</label> <select id="scandal_type">
                <option value="0">(brak)</option>
            </select>
                <a href="javascript:add_option_popup(this, 'scandal_types')" id="scandal_type_btn" class="button-small">+</a>
            <br><label for="scandal_subtype">Podtyp</label> <select id="scandal_subtype" disabled="disabled">
                <option value="0">(brak)</option>
            </select>
            <a href="javascript:add_option_popup(this, 'scandal_subtypes')" id="scandal_subtype_btn" class="button-small">+</a>
            <fieldset id="scandal_consequences">
                <legend>Szersze konsekwencje</legend>
                <a href="javascript:add_option_popup(this, 'scandal_consequences');" id="scandal_consequences_btn" class="button separate">Dodaj konsekwencję</a>
            </fieldset>

            <h2>Wydarzenia</h2>
            <ul class="boxed-list event-list" id="events">
                <!-- thou shalt load forms dynamically -->
                <li id="btn-add-event"><a href="#">Dodaj wydarzenie</a></li>
            </ul>
        </form>
    </section>
</body>
