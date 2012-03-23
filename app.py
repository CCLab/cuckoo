#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bottle import route, run, template, static_file, request
import simplejson as js
import codecs, os

file_path = os.path.dirname( __file__ )
data_dir = os.path.join( file_path, 'data' ) + "/"

@route('/')
def index():
    template_dict = {
        'title': 'Afery'
    }

    files = []
    for fn in sorted(os.listdir(data_dir)):
        name, _ = os.path.splitext(fn)
        f = codecs.open(data_dir + fn, 'r', 'utf-8')
        json = f.read()
        f.close()
        title = js.loads(json)['name-1']
        files.append({
            'name': name,
            'title': title
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

#    for key, value in request.forms.items():
#        if key == 'name-1' or key == 'name-2' or key == 'name-3':
#            scandal['name'].append(value)
#        elif key == 'description':
#            scandal['description'] = value
#        else:
#            first, rest = key.split('-', 1)
#            if first == "character":
#                second, rest = rest.split('-', 1)
#                scandal['characters'][int(second) - 1][rest] = value
#            elif first in scandal:
#                if rest in scandal[first]:
#                    scandal[first][rest] = True
#            else:
#                print "unrecognized form key:", key
#
#    # filter empty characters
#    # TODO: moar debug
#    for character in scandal['characters']:
#        if character.values() == ['','','']:
#            scandal['characters'].remove(character)

    next_file = str("{0:>04}".format(int(sorted(os.listdir(data_dir)).pop().split('.')[0])+1))
    f = codecs.open(data_dir + next_file + ".json", 'w', 'utf-8')
    f.write(request.forms.json)
    f.close()

    return {'scandal_id': next_file}

@route('/add-timeline/<scandal_id>')
def add_timeline_by_id(scandal_id):
    template_dict = {
        'title': 'Dodaj wydarzenia'
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
