#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import route, run, template, static_file, request, abort
import simplejson as js
import codecs, os
import psycopg2 as psql
import psycopg2.extras as psqlextras

file_path = os.path.dirname( __file__ )
data_dir = os.path.join( file_path, 'data' ) + "/"

# some database structure description
option_tables = [
    "scandal_types",
    "scandal_subtypes",
    "scandal_consequences",
    "actor_types",
    "actor_roles",
    "actor_affiliations",
    "locations"
]
option_tables_with_parents = ["scandal_subtypes"]
option_tables_may_be_human = ["actor_types", "actor_roles", "actor_affiliations"]

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
    cursor.execute("SELECT id, name FROM scandal_types")
    template_dict["scandal_types"] = [ {'id': t['id'], 'name': t['name'], 'selected': 0} for t in cursor.fetchall() ]

    if scandal_id != "new":
        # retrieve data and overwrite
        scandal_id = int(scandal_id)
        cursor.execute("SELECT name, description FROM scandals WHERE id = {0}".format(scandal_id))
        template_dict["scandal"] = cursor.fetchone()

    return template("scandal", template_dict)

@route('/scandal/<scandal_id:re:new|\d+>', method='POST')
def scandal_save(scandal_id):
    return "scandal save: {0}".format(scandal_id)

@route('/api/scandal/<scandal_id:int>', method='GET')
def api_scandal_get(scandal_id):
    cursor = db_cursor()
    cursor.execute("SELECT name, description, type_id, subtype_id, consequences FROM scandals WHERE id = {0}".format(scandal_id))
    scandal = cursor.fetchone()
    # add id to the mix
    scandal["id"] = scandal_id
    # mill through consequences
    if scandal["consequences"] == None:
        scandal["consequences"] = []
    else:
        scandal["consequences"] = [ int(c) for c in scandal["consequences"].split(",") ]
    return js.dumps(scandal)

@route('/api/scandal/<scandal_id:int>', method='POST')
def api_scandal_post(scandal_id):
    response = {
        "message": "Data stored.",
    }
    return js.dumps(response)

@route('/options/<realm>', method='GET')
def options_get(realm):
    if realm in option_tables:
        cursor = db_cursor()
        if realm in option_tables_with_parents:
            # display only children of requested parent
            parent_id = int(request.query.parent)
            cursor.execute("SELECT id, name FROM {0} WHERE parent_id = {1}".format(realm, parent_id))
        else:
            # just dump all of them
            cursor.execute("SELECT id, name FROM {0}".format(realm))
        options = [ row for row in cursor.fetchall() ]
        return js.dumps(options)
    else:
        abort(404, "Bad options endpoint: {0}.".format(realm))

@route('/options/<realm>', method='POST')
def options_get(realm):
    if realm in option_tables:
        cursor = db_cursor()
        if realm in option_tables_with_parents:
            # save with the requested parent
            parent_id = int(request.query.parent)
            cursor.execute("INSERT INTO {0} (parent_id, name) VALUES ({1}, {2}) RETURNING id".format(realm, parent_id, request.query.name))
        else:
            # it does not need a parent, it'll live
            cursor.execute("INSERT INTO {0} (name) VALUES ({1}) RETURNING id".format(realm, request.query.name))
        new_row_id = cursor.fetchone()[0]
        cursor.commit()
        return js.dumps(new_row_id)
    else:
        abort(404, "Bad options endpoint: {0}.".format(realm))

@route('/static/<path:path>')
def serve_static(path):
    return static_file(path, root='./static/')

# run(...) should be the last line in app.py
# (automatically removed on deploy)
run(host='localhost', port=8080, debug=True, reloader=True)
