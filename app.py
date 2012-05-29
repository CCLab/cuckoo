#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import route, get, post, run, template, static_file, request, abort
import simplejson as js
import psycopg2 as psql
import psycopg2.extras as psqlextras
from datetime import datetime, timedelta
from ConfigParser import ConfigParser

# read database connection settings
cfg = ConfigParser()
cfg.read('./db.conf')

host   = cfg.get( 'postgres', 'host' )
dbname = cfg.get( 'postgres', 'dbname' )
user   = cfg.get( 'postgres', 'user' )
try:
    password = cfg.get( 'postgres', 'password' )
except:
    password = None

conn_string = "host='"+ host +"' dbname='"+ dbname +"' user='"+ user +"'"
if password:
    conn_string += " password='"+ password +"'"


# some database structure description
option_tables = [
    "scandal_types",
    "scandal_subtypes",
    "scandal_consequences",
    "event_types",
    "event_subtypes",
    "locations",
    "actor_types",
    "actor_roles",
    "actor_affiliations",
    "actors"
]
option_tables_with_parents = ["scandal_subtypes", "event_subtypes"]
option_tables_with_children = ["scandal_types", "event_types"]
option_tables_may_be_human = ["actor_types", "actor_roles", "actor_affiliations", "actors"]

def db_cursor():
    # TODO: deal with conn.commit() somehow
    # maybe turn autocommit on?
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
        "save": "Zapisz",
        "cancel": "Anuluj"
    }

    return template("scandal", template_dict)

# new in url for bottle routing bug walkaround
@get('/api/scandal/<scandal_id:re:new|\d+>')
def api_scandal_get(scandal_id):
    cursor = db_cursor()
    query = '''SELECT name, description, type_id, subtype_id, consequences
               FROM scandals
               WHERE id = %s
            ''' % scandal_id
    cursor.execute( query )

    scandal = cursor.fetchone()
    # add id to the mix
    scandal["id"] = scandal_id
    # mill through consequences
    # TODO move consequences in postgres into array
    try:
        scandal["consequences"] = [ int(c) for c in scandal['consequences'].split(",") ]
    except:
        scandal["consequences"] = []

    # fetch events for that scandal
    query = '''SELECT id, description, location_id, event_date,
                      publication_date, type_id, subtype_id
               FROM events
               WHERE scandal_id = %s ORDER BY event_date ASC
            ''' % scandal_id
    cursor.execute( query )
    events = cursor.fetchall()

    # TODO: mill through events, find actors and their attributes
    for event in events:
        event['event_date'] = None if not event['event_date']\
                                   else   event["event_date"].strftime("%Y-%m-%d")
        event["publication_date"] = None if not event["publication_date"]\
                                         else event["publication_date"].strftime("%Y-%m-%d")

        query = '''SELECT actor_id as id, type_id, role_id, affiliation_id
                   FROM actors_events
                   WHERE event_id = %s
                ''' % event['id']

        cursor.execute( query )
        event["actors"] = [ row for row in cursor.fetchall() ]

    scandal["events"] = events

    return js.dumps(scandal)

@post('/api/scandal/<scandal_id:re:new|\d+>')
def api_scandal_post(scandal_id):
    data = js.loads(request.forms.payload)
    data["consequences"] = ",".join([ str(el) for el in data['consequences'] ])

    conn = psql.connect(conn_string)
    cursor = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

    if scandal_id == "new":
        cursor.execute("INSERT INTO scandals (name, description, type_id, subtype_id, consequences) VALUES (%s, %s, %s, %s, %s) RETURNING id", (data["name"], data["description"], data["type_id"], data["subtype_id"], data["consequences"]))
        scandal_id = cursor.fetchone()["id"]
        response = {
            "message": "Data stored.",
            "id": scandal_id
        }
    else:
        scandal_id = int(scandal_id)
        cursor.execute("UPDATE scandals SET name = %s, description = %s, type_id = %s, subtype_id = %s, consequences = %s WHERE id = %s", (data["name"], data["description"], data["type_id"], data["subtype_id"], data["consequences"], scandal_id))
        response = {
            "message": "Data stored."
        }

        # here we have to delete all events
        # links between actors and events will be automatically deleted
        # (ON DELETE CASCADE constraint)
        # actors will not be deleted

        cursor.execute("DELETE FROM events WHERE scandal_id = %s", (scandal_id,))

    # TODO: we could process each and every one of the events
    # keeping the ids in hidden inputs
    # for now we'll just clean event data for the scandal
    # and add new events

    for event in data["events"]:
        # We need to add a day to the returning dates because of
        # some strange behaviour of the jQuery datepicker.
        if event["event_date"] is not None:
            dt = datetime.strptime(event["event_date"][:19], "%Y-%m-%dT%H:%M:%S") + timedelta(1,0)
            event["event_date"] = dt.strftime("%Y-%m-%d")
        if event["publication_date"] is not None:
            dt = datetime.strptime(event["publication_date"][:19], "%Y-%m-%dT%H:%M:%S") + timedelta(1,0)
            event["publication_date"] = dt.strftime("%Y-%m-%d")

        # First, we need to insert the event
        cursor.execute("INSERT INTO events (description, scandal_id, location_id, event_date, publication_date, type_id, subtype_id) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id", (event["description"], scandal_id, event["location_id"], event["event_date"], event["publication_date"], event["type_id"], event["subtype_id"]))
        event_id = cursor.fetchone()["id"]
        # Then, we insert into actors_events
        for actor in event["actors"]:
            cursor.execute("INSERT INTO actors_events (actor_id, event_id, role_id, type_id, affiliation_id) VALUES (%s, %s, %s, %s, %s)", (actor["id"], event_id, actor["role_id"], actor["type_id"], actor["affiliation_id"]))

    conn.commit()

    return js.dumps(response)

@route('/options/<realm>', method='GET')
def options_get(realm):
    if realm in option_tables:
        cursor = db_cursor()

        if realm in option_tables_with_parents:
            # specify parent (integer)
            cursor.execute("SELECT id, name FROM {0} WHERE parent_id = %s".format(realm), (request.query.parent,))
        elif realm in option_tables_may_be_human:
            # specify human (boolean)
            cursor.execute("SELECT id, name FROM {0} WHERE human = %s".format(realm), (request.query.human,))
        else:
            cursor.execute("SELECT id, name FROM {0}".format(realm))

        options = [ row for row in cursor.fetchall() ]

        # display children for scandal_types, event_types
        if realm in option_tables_with_children:
            if realm == "scandal_types":
                children_table = "scandal_subtypes"
            elif realm == "event_types":
                children_table = "event_subtypes"

            for t in options:
                cursor.execute("SELECT id, name FROM {0} WHERE parent_id = %s".format(children_table), (t["id"],))
                t["children"] = [ row for row in cursor.fetchall() ]

        return js.dumps(options)
    else:
        abort(404, "Bad options endpoint: {0}.".format(realm))

@route('/options/<realm>', method='POST')
def options_get(realm):
    if realm in option_tables:
        conn = psql.connect(conn_string)
        cursor = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

        if realm in option_tables_with_parents:
            # specify parent (integer)
            cursor.execute("INSERT INTO {0} (parent_id, name) VALUES (%s, %s) RETURNING id".format(realm), (request.forms.parent, request.forms.name))
        elif realm in option_tables_may_be_human:
            # specify human (boolean)
            cursor.execute("INSERT INTO {0} (human, name) VALUES (%s, %s) RETURNING id".format(realm), (request.forms.human, request.forms.name))
        else:
            cursor.execute("INSERT INTO {0} (name) VALUES (%s) RETURNING id".format(realm), (request.forms.name,))

        # returning {'id': *new_row_id*}
        info = cursor.fetchone()
        conn.commit()
        return info
    else:
        abort(404, "Bad options endpoint: {0}.".format(realm))

@route('/static/<path:path>')
def serve_static(path):
    return static_file(path, root='./static/')

# run(...) should be the last line in app.py
# (automatically removed on deploy)
run(host='localhost', port=8080, debug=True, reloader=True)
