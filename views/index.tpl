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
        <h1>{{title or 'Afery'}}</h1>
    </header>
    <section>
        <ul>
%for scandal in scandals:
            <li><a href="/scandal/{{scandal['id']}}">{{scandal['name']}}</a><br>{{scandal['description']}}</li>
%end
        </ul>
        <a href="/scandal/new" class="button">{{add_scandal}}</a>
    </section>
</body>
