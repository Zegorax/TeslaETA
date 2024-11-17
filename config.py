# Shareable database configuration for flask-migrate

from apiflask import APIFlask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS

DATA_DIR = os.path.abspath(os.getenv('DATA_DIR', '/data/'))

app = APIFlask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DATA_DIR}/service.db"

db = SQLAlchemy(app)
migrate = Migrate(app,db)

app.app_context().push()
# with app.app_context():
db.create_all()