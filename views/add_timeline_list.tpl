<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Pontano+Sans&subset=latin,latin-ext">
    <script src="/static/js/jquery-1.7.1.min.js"></script>
    <script src="/static/js/forms.js"></script>
</head>
<body>
    <header>
        <h1>Dodaj aferę</h1>
        <p>Formularz dodawania afery</p>
    </header>
    <section>
        <ul>
%for file in filelist:
            <li><a href="/add-timeline/{{file['name']}}">{{file['title']}}</a></li>
%end
        </ul>
    </section>
</body>
