<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{title or 'Afery'}}</title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Pontano+Sans&subset=latin,latin-ext">
</head>
<body class="index">
    <header>
        <h1>{{title or 'Afery'}}</h1>
    </header>
    <section>
        <ul class="boxed-list scandal-list">
            <li class="navbar-parent">
                <ul class="navbar">
                    <li><a href="/scandal/new"><strong>{{add_scandal}}</strong></a></li><!--
                    --><!-- new items here to avoid spaces between <li/> -->
                </ul>
            </li>
%for scandal in scandals:
            <li><a href="/scandal/{{scandal['id']}}"><strong>{{scandal['name']}}</strong>: {{scandal['description']}}</a></li>
%end
        </ul>
    </section>
</body>
