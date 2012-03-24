import sys, os

sys.path = ['/var/www/afery/'] + sys.path
os.chdir(os.path.dirname(__file__))

import bottle, run

application = bottle.default_app()
