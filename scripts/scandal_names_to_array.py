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

print "== Scandal names before change"
cur.execute('SELECT id, name FROM scandals')
for sc in cur.fetchall():
    print sc
cur.execute("SELECT data_type FROM information_schema.columns WHERE table_name = 'scandals' AND column_name = 'name'")
print "Name column type:", cur.fetchone()['data_type']

cur.execute('ALTER TABLE scandals ADD COLUMN nametmp character varying(128)[]')
cur.execute('UPDATE scandals SET nametmp = ARRAY[name]')
cur.execute('ALTER TABLE scandals DROP COLUMN name')
cur.execute('ALTER TABLE scandals RENAME COLUMN nametmp TO name')

print "== Scandal names after change"
cur.execute('SELECT id, name FROM scandals')
for sc in cur.fetchall():
    print sc
cur.execute("SELECT data_type FROM information_schema.columns WHERE table_name = 'scandals' AND column_name = 'name'")
print "Name column type:", cur.fetchone()['data_type']

conn.commit()
