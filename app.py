#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import route, run, template, static_file, request, abort
import simplejson as js
import codecs, os
import psycopg2 as psql
import psycopg2.extras as psqlextras

file_path = os.path.dirname( __file__ )
data_dir = os.path.join( file_path, 'data' ) + "/"

option_tables = ["scandal_types", "scandal_subtypes"]

def db_cursor():
    conn_string = "dbname='cuckoo' user='postgres' host='localhost' password='EmooroK4'"
    conn = psql.connect(conn_string)
    return conn.cursor(cursor_factory=psqlextras.RealDictCursor)

@route('/')
def index():
    template_dict = {
        "title": "Afery",
        "add_scandal": "Dodaj aferę"
    }

    cursor = db_cursor()
    cursor.execute("SELECT id, name, description FROM scandals")
    template_dict['scandals'] = [ row for row in cursor.fetchall()]

    return template("index", template_dict)

@route('/scandal/<scandal_id:re:new|\d+>', method='GET')
def scandal_show(scandal_id):
    # new scandal data
    template_dict = {
        "title": "Nowa afera",
        "save": "Zapisz",
        "cancel": "Anuluj",
        "scandal": {
            "name": "Nowa afera",
            "description": ""
        }
    }

    # get available scandal types
    cursor = db_cursor()
    cursor.execute("SELECT id, value FROM options_scandal_type")
    template_dict["scandal_types"] = [ {'id': scandal_type['id'], 'value': scandal_type['value'], 'selected': 0} for scandal_type in cursor.fetchall() ]

    if scandal_id != "new":
        # retrieve data and overwrite
        scandal_id = int(scandal_id)
        cursor.execute("SELECT name, description FROM scandals WHERE id = {0}".format(scandal_id))
        template_dict["scandal"] = cursor.fetchone()

    return template("scandal", template_dict)

@route('/scandal/<scandal_id:re:new|\d+>', method='POST')
def scandal_save(scandal_id):
    return "scandal save: {0}".format(scandal_id)

@route('/options/<realm>', method='GET')
def options_get(realm):
    if realm in option_tables:
        cursor = db_cursor()
        cursor.execute("SELECT id, name FROM {0}".format(realm))
        options = [ row for row in cursor.fetchall() ]
        return js.dumps(options)
    else:
        abort(404, "Bad options endpoint: {0}.".format(realm))

@route('/options/<realm>', method='POST')
def options_get(realm):
    return "adding realm: " + str(realm)

@route('/static/<path:path>')
def serve_static(path):
    return static_file(path, root='./static/')

# run(...) should be the last line in app.py
# (automatically removed on deploy)
run(host='localhost', port=8080, debug=True, reloader=True)
