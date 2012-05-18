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
    <script src="/static/js/forms.js"></script>
</head>
<body>
    <section>
        <div id="dialog-scandal"></div>
        <form action="/add-scandal" method="post" id="form-scandal">
            <label for="name">Nazwa</label> <input type="text" id="name" />
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
            <div class="event">
                <label for="event-1-location">Lokacja</label> <select name="event-1-location">
                    <option value="2">ogólnopolska</option>
                </select>
                <br>Czas
                <br><label for="event-1-type">Typ</label> <select name="event-1-type">
                    <option value="2">postępowanie sądowe</option>
                </select>
            </div>
            <div class="event">
                <input type="button" value="Dodaj wydarzenie">
            </div>
            <br><input type="submit" value="{{save}}" /> <a href="/">{{cancel}}</a>
        </form>
    </section>
</body>
