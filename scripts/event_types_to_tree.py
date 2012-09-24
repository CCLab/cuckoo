#!/USR/BIn/env python
# -*- coding: utf-8 -*-

import psycopg2 as psql
import psycopg2.extras as psqlextras
from ConfigParser import ConfigParser

cfg = ConfigParser()
cfg.read('../db.conf')

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

conn = psql.connect(conn_string)
cur = conn.cursor(cursor_factory=psqlextras.RealDictCursor)

# for each row in subtypess (save old id)
cur.execute('SELECT id, name, parent_id FROM event_subtypes')
for st in cur.fetchall():
    # copy subtype to types table (retrieve the new id)
    cur.execute('INSERT INTO event_types (name, parent) VALUES (%s, %s) RETURNING id',\
        (st['name'], st['parent_id']))
    new_id = cur.fetchone()['id']
    # change subtype_id to new one in events table
    cur.execute('UPDATE events SET subtype_id = %s WHERE subtype_id = %s', (new_id, st['id']))

# for each row in events
cur.execute('SELECT id, type_id, subtype_id, types FROM events')
for sc in cur.fetchall():
    # change types to [subtype_id], or [type_id] if no subtype set
    types = []
    if sc['subtype_id']:
        types.append(sc['subtype_id'])
    elif sc['type_id']:
        types.append(sc['type_id'])
    cur.execute('UPDATE events SET types = %s WHERE id = %s',\
        (types, sc['id']))

conn.commit()
