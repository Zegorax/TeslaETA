# Shareable database configuration for flask-migrate

from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import os

DATA_DIR = os.path.abspath(os.getenv('DATA_DIR', '/data/'))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DATA_DIR}/service.db"

db = SQLAlchemy(app)
migrate = Migrate(app,db)

app.app_context().push()
# with app.app_context():
db.create_all()