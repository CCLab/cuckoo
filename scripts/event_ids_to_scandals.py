#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""\
upgrade procedure
moves event ids to []scandals/events
"""

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

cur.execute('SELECT id FROM scandals')
scandals = cur.fetchall();

for scandal in scandals:
    print "Scandal #" + str(scandal['id'])
    
    # compile event list
    event_ids = []
    cur.execute('SELECT id FROM events WHERE scandal_id = %s ORDER BY event_date ASC', (scandal['id'],))
    for event in cur.fetchall():
        event_ids.append(event['id'])
    print "  Event IDs:", ', '.join([ str(eid) for eid in event_ids ])

    # save it to []scandals/events
    cur.execute('UPDATE scandals SET events = %s WHERE id = %s', (event_ids, scandal['id']))

conn.commit()
