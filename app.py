#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import route, run, template, static_file, request
import simplejson as js
import codecs, os
import psycopg2 as pg

file_path = os.path.dirname( __file__ )
data_dir = os.path.join( file_path, 'data' ) + "/"

conn = pg.connect("dbname='cuckoo' user='postgres' host='localhost' password='EmooroK4'")

@route('/')
def index():
    template_dict = {
        'title': 'Afery'
    }

    cur = conn.cursor()
    cur.execute("SELECT id, name, description FROM scandals")
    rows = cur.fetchall()

    print rows

    files = []
    for r in rows:
        files.append({
            'name': r[0],
            'title': r[1]
        })

    template_dict['filelist'] = files

    return template('index', template_dict)

@route('/add-scandal')
def add_scandal():
    template_dict = {
        'title': 'Dodaj aferę'
    }
    return template('add_scandal', template_dict)

@route('/add-scandal', method='POST')
def add_scandal_submit():

    next_file = str("{0:>04}".format(int(sorted(os.listdir(data_dir)).pop().split('.')[0])+1))
    f = codecs.open(data_dir + next_file + ".json", 'w', 'utf-8')
    f.write(request.forms.json)
    f.close()

    return {'scandal_id': next_file}

@route('/add-timeline/<scandal_id>')
def add_timeline_by_id(scandal_id):
    template_dict = {
        'title': 'Edycja wydarzenia'
    }

    f = codecs.open(data_dir + scandal_id + ".json", 'r', 'utf-8')
    json = f.read()
    f.close()
    template_dict['scandal_title'] = js.loads(json)['name-1']
    template_dict['scandal_id'] = scandal_id

    return template('add_timeline', template_dict)

@route('/add-timeline/<scandal_id>', method='POST')
def add_timeline_by_id_submit(scandal_id):
    f = codecs.open(data_dir + scandal_id + ".json", 'r', 'utf-8')
    json = f.read()
    f.close()
    scandal = js.loads(json)
    scandal['timeline'] = js.loads(request.forms.json)

    f = codecs.open(data_dir + scandal_id + ".json", 'w', 'utf-8')
    f.write(js.dumps(scandal))
    f.close()

    return "Wydarzenia dodane"

@route('/static/css/<filename>')
def send_static(filename):
    return static_file(filename, root='static/css')

@route('/static/js/<filename>')
def send_static(filename):
    return static_file(filename, root='static/js')

@route('/static/img/<filename>')
def send_static(filename):
    return static_file(filename, root='static/img')

# run(...) should be the last line in app.py
# (automatically removed on deploy)
run(host='localhost', port=8080, debug=True, reloader=True)
