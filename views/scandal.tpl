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
        <div id="dialog-scandal"></div>
        <form action="/add-scandal" method="post" id="form-scandal">
            <label for="name">Nazwa</label> <input type="text" id="name" />
            <input type="submit" value="{{save}}" /> <a href="/">{{cancel}}</a>

            <br><label for="description">Krótki opis</label><br><textarea id="description" rows="8" cols="50"></textarea>
            <br><label for="scandal_type">Typ</label> <select id="scandal_type">
                <option value="0">(brak)</option>
            </select>
            <br><label for="scandal_subtype">Podtyp</label> <select id="scandal_subtype" disabled="disabled">
                <option value="0">(brak)</option>
            </select>
            <fieldset id="consequences">
                <legend>Szersze konsekwencje</legend>
            </fieldset>

            <h2>Wydarzenia</h2>
            <ul class="boxed-list event-list" id="events">
                <!-- thou shalt load forms dynamically -->
                <li id="btn-add-event"><a href="#">Dodaj wydarzenie</a></li>
            </ul>
        </form>
    </section>
</body>
