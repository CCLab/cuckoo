#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import route, get, post, delete, run, template, static_file, request, abort
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
    "event_types",
    "event_subtypes",
    "locations",
    "actor_types",
    "actor_roles",
    "actor_affiliations",
    "actors"
]
option_tables_with_children = ["scandal_types", "event_types", "actor_types", "actor_roles", "actor_affiliations"]
option_tables_may_be_human = ["actor_types", "actor_roles", "actor_affiliations", "actors"]

def db_cursor():
    # TODO: deal with conn.commit() somehow
    # maybe turn autocommit on?
    conn = psql.connect(conn_string)
    return conn.cursor(cursor_factory=psqlextras.RealDictCursor)

def find_children(elements, parent):
    parent['children'] = [ {'id': e['id'], 'title': e['name'], 'children': []}\
        for e in elements if e['parent'] == parent['id'] ]
    for c in parent['children']:
        find_children(elements, c)

@get('/')
def index():
    template_dict = {
        "title": "Afery",
        "add_scandal": "Dodaj aferę"
    }

    cursor = db_cursor()
    cursor.execute("SELECT id, name, description FROM scandals")
    template_dict['scandals'] = [ {'id': row['id'],\
        'name': ' / '.join(row['name']),\
        'description': row['description']}\
        for row in cursor.fetchall()]

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
    query = '''SELECT name, description, types, tags, events
               FROM scandals
               WHERE id = %s
            ''' % scandal_id
    cursor.execute( query )

    scandal = cursor.fetchone()
    # add id to the mix
    scandal["id"] = scandal_id

    if scandal["events"]:
        # fetch events for that scandal
        eids_str = [ str(eid) for eid in scandal["events"] ]
        query = '''SELECT id, description, location_id, event_date, types, refs
                   FROM events
                   WHERE id IN (%s)
                ''' % ",".join(eids_str)
        # looks awful, but the only way to guarantee order without
        # doing a lot of queries
        query = query + " ORDER BY id = " + " DESC, id = ".join(eids_str) + " DESC"
        cursor.execute(query)
        events = cursor.fetchall()
    else:
        events = []

    # TODO: mill through events, find actors and their attributes
    # TODO: check and operator instead of ifs
    for event in events:
        event['event_date'] = None if not event['event_date']\
                                   else   event["event_date"].strftime("%Y-%m-%d")

        # actors
        query = '''SELECT actor_id as id, types, roles, affiliations, tags
                   FROM actors_events
                   WHERE event_id = %s
                ''' % event['id']

        cursor.execute( query )
        event["actors"] = [ row for row in cursor.fetchall() ]

        # references
        if event["refs"]:
            query = '''SELECT id, art_title, pub_title, url, pub_date
                       FROM refs
                       WHERE id IN (%s)
                    ''' % ",".join([ str(ref) for ref in event["refs"] ])

            cursor.execute( query )
            event["refs"] = [ row for row in cursor.fetchall() ]

            for ref in event["refs"]:
                ref["pub_date"] = None if not ref["pub_date"]\
                    else ref["pub_date"].strftime("%Y-%m-%d")
        else:
            event["refs"] = []

    scandal["events"] = events

    return js.dumps(scandal)

@post('/api/scandal/<scandal_id:re:new|\d+>')
def api_scandal_post(scandal_id):
    data = js.loads(request.forms.payload)

    conn = psql.connect(conn_string)
    cursor = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

    # prepare the data
    data["tags"] = [ tag.strip() for tag in data["tags"] ]

    if scandal_id == "new":
        cursor.execute("INSERT INTO scandals (name, description, types, tags) VALUES (%s, %s, %s, %s) RETURNING id", (data["name"], data["description"], data["types"], data["tags"]))
        scandal_id = cursor.fetchone()["id"]
        response = {
            "message": "Data stored.",
            "id": scandal_id
        }
    else:
        scandal_id = int(scandal_id)
        cursor.execute("UPDATE scandals SET name = %s, description = %s, types = %s, tags = %s WHERE id = %s", (data["name"], data["description"], data["types"], data["tags"], scandal_id))
        response = {
            "message": "Data stored."
        }

        # get old event IDs to know which one need to be deleted
        cursor.execute('SELECT id FROM events WHERE scandal_id = %s', (scandal_id,))
        old_event_ids = [ event['id'] for event in cursor.fetchall() ]

    # TODO: we could process each and every one of the events
    # keeping the ids in hidden inputs
    # for now we'll just clean event data for the scandal
    # and add new events

    # we'll gather event IDs to update []scandals/events
    event_ids = []

    # NOTE: We need to add a day to the returning dates because of
    # some strange behaviour of the jQuery datepicker.
    for event in data["events"]:
        if event["event_date"] is not None:
            dt = datetime.strptime(event["event_date"][:19], "%Y-%m-%dT%H:%M:%S") + timedelta(1,0)
            event["event_date"] = dt.strftime("%Y-%m-%d")

    # sort events by event_date
    data["events"].sort(key=lambda x: x["event_date"])

    for event in data["events"]:
        # insert/update references
        ref_ids = []
        for ref in event["refs"]:
            # we add one day, see the NOTE above events
            if ref["pub_date"] is not None:
                dt = datetime.strptime(ref["pub_date"][:19], "%Y-%m-%dT%H:%M:%S") + timedelta(1,0)
                ref["pub_date"] = dt.strftime("%Y-%m-%d")

            if ref["id"] != '0':
                cursor.execute( 'UPDATE refs SET pub_title = %s, art_title = %s,'\
                    ' url = %s, pub_date = %s WHERE id = %s',\
                    (ref["pub_title"], ref["art_title"], ref["url"], ref["pub_date"], ref["id"]) )
                ref_ids.append( int(ref["id"]) )
            else:
                cursor.execute( 'INSERT INTO refs (pub_title, art_title, url, pub_date)'\
                    ' VALUES (%s, %s, %s, %s) RETURNING id',\
                    (ref["pub_title"], ref["art_title"], ref["url"], ref["pub_date"]) )
                ref_ids.append( cursor.fetchone()["id"] )

        # insert/update the event
        if event["id"] != '0':
            event_id = int(event["id"])
            cursor.execute( 'UPDATE events'\
                ' SET description = %s, location_id = %s, event_date = %s,'\
                ' types = %s, refs = %s WHERE id = %s',\
                (event["description"], event["location_id"], event["event_date"],\
                event["types"], ref_ids, event_id) )

            # delete event-actor links so they could later be inserted
            # (they are not tracked via IDs)
            cursor.execute('DELETE FROM actors_events WHERE event_id = %s', (event_id,))
        else:
            cursor.execute( 'INSERT INTO events'\
                ' (description, location_id, event_date, types, refs)'\
                ' VALUES (%s, %s, %s, %s, %s) RETURNING id',\
                (event["description"], event["location_id"], event["event_date"],\
                event["types"], ref_ids) )
            event_id = cursor.fetchone()["id"]

        event_ids.append(event_id)

        # insert into actors_events
        for actor in event["actors"]:
            actor["tags"] = [ tag.strip() for tag in actor["tags"] ]
            cursor.execute("INSERT INTO actors_events (actor_id, event_id, roles, types, affiliations, tags) VALUES (%s, %s, %s, %s, %s, %s)", (actor["id"], event_id, actor["roles"], actor["types"], actor["affiliations"], actor["tags"]))

    # TODO: old refs are not deleted
    to_delete = [ eid for eid in old_event_ids if eid not in event_ids ]
    if to_delete:
        cursor.execute('''DELETE FROM events 
                          WHERE id IN (%s)
                       ''' % ",".join([ str(eid) for eid in to_delete ]) )

    # update []scandals/events
    cursor.execute("UPDATE scandals SET events = %s WHERE id = %s", (event_ids, scandal_id))

    conn.commit()

    return js.dumps(response)

@get('/api/<realm>')
def options_get(realm):
    if realm in option_tables:
        cursor = db_cursor()

        if realm in option_tables_with_children:
            if realm in option_tables_may_be_human:
                cursor.execute('SELECT id, name, parent FROM {0} WHERE human = %s ORDER BY name ASC'.format(realm),\
                    (request.query.human,))
            else:
                cursor.execute('SELECT id, name, parent FROM {0} ORDER BY name ASC'.format(realm))
            types = cursor.fetchall()

            # add top nodes to a tree
            tree = [ {'id': t['id'], 'title': t['name'], 'children': []}\
                for t in types if t['parent'] is None ]
            types = [ t for t in types if t['parent'] is not None ]

            # now find children recursively
            for leaf in tree:
                find_children(types, leaf)

        elif realm in option_tables_may_be_human:
            # Note: elements in those tables have no children
            cursor.execute('SELECT id, name FROM {0} WHERE human = %s'.format(realm),\
                (request.query.human,))
            types = cursor.fetchall()

            tree = [ {'id': t['id'], 'title': t['name']} for t in types ]

        else:
            cursor.execute('SELECT id, name FROM {0}'.format(realm))
            types = cursor.fetchall()

            tree = [ {'id': t['id'], 'title': t['name']} for t in types ]

        return js.dumps(tree)

    else:
        abort(404, "Resource '{0}' does not exist.".format(realm))

@post('/api/<realm>')
def options_create(realm):
    if realm in option_tables:
        conn = psql.connect(conn_string)
        cursor = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

        if realm in option_tables_may_be_human:
            # human (boolean) must be specified
            # parent (integer) may be specified
            if realm in option_tables_with_children and request.forms.parent:
                cursor.execute("INSERT INTO {0} (human, name, parent)"\
                    " VALUES (%s, %s, %s) RETURNING id".format(realm),\
                    (request.forms.human, request.forms.name, request.forms.parent))
            else:
                cursor.execute("INSERT INTO {0} (human, name)"\
                    " VALUES (%s, %s) RETURNING id".format(realm),\
                    (request.forms.human, request.forms.name))

        elif realm in option_tables_with_children:
            # parent (integer) may be specified
            if request.forms.parent:
                cursor.execute("INSERT INTO {0} (parent, name) VALUES (%s, %s) RETURNING id".format(realm), (request.forms.parent, request.forms.name))
            else:
                cursor.execute("INSERT INTO {0} (parent, name) VALUES (NULL, %s) RETURNING id".format(realm), (request.forms.name,))

        else:
            cursor.execute("INSERT INTO {0} (name) VALUES (%s) RETURNING id".format(realm), (request.forms.name,))

        # returning {'id': *new_row_id*}
        info = cursor.fetchone()
        conn.commit()
        return info

    else:
        abort(404, "Resource '{0}' does not exist.".format(realm))

@post('/api/<realm>/<id:int>')
def options_update(realm, id):
    if realm in option_tables:
        conn = psql.connect(conn_string)
        cursor = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

        cursor.execute("UPDATE {0} SET name = %s WHERE id = %s".format(realm), (request.forms.name, id))

        conn.commit()
        return None

    else:
        abort(404, "Resource '{0}' does not exist.".format(realm))

@delete('/api/<realm>/<id:int>')
def options_delete(realm, id):
    if realm in option_tables:
        conn = psql.connect(conn_string)
        cursor = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

        cursor.execute("DELETE FROM {0} WHERE id = %s".format(realm), (id,))

        conn.commit()
        return None

    else:
        abort(404, "Resource '{0}' does not exist.".format(realm))

@route('/options/<realm>', method='GET')
def options_get(realm):
    if realm in ["locations", "actors"]:
        cursor = db_cursor()

        if realm == "actors":
            cursor.execute("SELECT id, name FROM actors WHERE human = %s ORDER BY name", (request.query.human,))
        elif realm == "locations":
            cursor.execute("SELECT id, name FROM locations ORDER BY id")

        return js.dumps(cursor.fetchall())
    else:
        abort(404, "Bad options endpoint: {0}.".format(realm))

@route('/options/<realm>', method='POST')
def options_post(realm):
    if realm in ["locations", "actors"]:
        conn = psql.connect(conn_string)
        cursor = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

        if realm == "actors":
            # specify human (boolean)
            cursor.execute("INSERT INTO actors (human, name) VALUES (%s, %s) RETURNING id", (request.forms.human, request.forms.name))
        elif realm == "locations":
            cursor.execute("INSERT INTO locations (name) VALUES (%s) RETURNING id", (request.forms.name,))

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
