from flask import Flask, render_template, request, redirect, url_for
import requests, os, time, shortuuid, flask_login, dotenv
from datetime import datetime
from geopy.distance import geodesic


# Important to have before "from helpers import init"
dotenv.load_dotenv(".env")

from interfaces.backendfactory import BackendProviderFactory

from helpers import init
from config import app

# Import models for automated database migration
from models.share import Share
from models.user import User


MAPBOX_TOKEN = os.getenv('MAPBOX_TOKEN')
BASE_URL = os.getenv('BASE_URL')
PORT = os.getenv('PORT', 5051)
DATA_DIR = os.path.abspath(os.getenv('DATA_DIR', '/data/'))

BACKEND_PROVIDER = os.getenv('BACKEND_PROVIDER', 'teslalogger')
BACKEND_PROVIDER_BASE_URL = os.getenv('BACKEND_PROVIDER_BASE_URL')
BACKEND_PROVIDER_CAR_ID = os.getenv('BACKEND_PROVIDER_CAR_ID', 1)
BACKEND_PROVIDER_MULTICAR = os.getenv('BACKEND_PROVIDER_MULTICAR', False)

# Backend provider instanciation
BackendProviderFactory(BACKEND_PROVIDER, BACKEND_PROVIDER_BASE_URL, BACKEND_PROVIDER_CAR_ID)


app.secret_key = os.getenv('SECRET_KEY')

# Fix static folder BASE_URL
app.view_functions["static"] = None
a_new_static_path = BASE_URL + '/static'

# Set the static_url_path property.
app.static_url_path = a_new_static_path

# Remove the old rule from Map._rules.
for rule in app.url_map.iter_rules('static'):
    app.url_map._rules.remove(rule)  # There is probably only one.

# Remove the old rule from Map._rules_by_endpoint. In this case we can just 
# start fresh.
app.url_map._rules_by_endpoint['static'] = []  

# Add the updated rule.
app.add_url_rule(f'{a_new_static_path}/<path:filename>',
                 endpoint='static',
                 view_func=app.send_static_file)




if __name__ == '__main__':
    init.provision_admin_user()
    app.run(host='0.0.0.0', port=PORT)
