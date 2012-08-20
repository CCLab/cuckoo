#!/usr/bin/env python
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

print "== locations"
cur.execute('SELECT id, name FROM locations')
for loc in cur.fetchall():
    print loc
print "== events"
cur.execute('SELECT id, location_id FROM events')
for loc in cur.fetchall():
    print loc

# drop constraints
cur.execute('ALTER TABLE events DROP CONSTRAINT events_locations')
cur.execute('ALTER TABLE locations DROP CONSTRAINT locations_pk')

print "==== we're gonna do The Thing™ ===="

# mess with the values
cur.execute('UPDATE locations SET id = id + 1')
cur.execute('UPDATE events SET location_id = location_id + 1')
cur.execute('INSERT INTO locations (id, name) VALUES (%s, %s)', (1, 'Trudne do ustalenia'))

# restart the id sequence
cur.execute('SELECT id FROM locations ORDER BY id DESC LIMIT 1')
next_id = cur.fetchone()['id'] + 1
print "Setting next id in locations to", next_id
cur.execute('ALTER SEQUENCE locations_id_seq RESTART WITH %s', (next_id,))

# create constraints
cur.execute('ALTER TABLE locations ADD CONSTRAINT locations_pk PRIMARY KEY (id)')
cur.execute('ALTER TABLE events ADD CONSTRAINT events_locations FOREIGN KEY (location_id) REFERENCES locations(id)')

print "==== we've done The Thing™ ===="

print "== locations"
cur.execute('SELECT id, name FROM locations')
for loc in cur.fetchall():
    print loc
print "== events"
cur.execute('SELECT id, location_id FROM events')
for loc in cur.fetchall():
    print loc

conn.commit()
