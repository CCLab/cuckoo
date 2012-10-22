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

cur.execute('SELECT actor_id, event_id, type_id, role_id, affiliation_id FROM actors_events')
data = cur.fetchall()
for row in data:
    print row['actor_id'], row['event_id'], row['type_id'], row['role_id'], row['affiliation_id']
    types = [ row['type_id'] ] if row['type_id'] else []
    roles = [ row['role_id'] ] if row['role_id'] else []
    affiliations = [ row['affiliation_id'] ] if row['affiliation_id'] else []
    cur.execute('UPDATE actors_events SET types = %s, roles = %s, affiliations = %s'\
        ' WHERE actor_id = %s AND event_id = %s',\
        (types, roles, affiliations, row['actor_id'], row['event_id']))

print '==='
cur.execute('SELECT actor_id, event_id, types, roles, affiliations FROM actors_events')
for row in cur.fetchall():
    print row['actor_id'], row['event_id'], row['types'], row['roles'], row['affiliations']

conn.commit()
