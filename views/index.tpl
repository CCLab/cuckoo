<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{title or 'Afery'}}</title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Pontano+Sans&subset=latin,latin-ext">
</head>
<body>
    <header>
        <h1>Afery</h1>
    </header>
    <section>
        <ul>
%for file in filelist:
            <li><a href="/add-timeline/{{file['name']}}">{{file['title']}}</a></li>
%end
        </ul>
        <a href="/add-scandal" class="button">Dodaj aferę</a>
    </section>
</body>
