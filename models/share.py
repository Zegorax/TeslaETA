from config import db
from marshmallow_dataclass import dataclass
@dataclass
class Share(db.Model):
    shortuuid: str
    lat: float
    lng: float
    expiry: int
    carid: int
    
    shortuuid = db.Column(db.Text(22), unique=True, nullable=False, primary_key=True)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)
    expiry = db.Column(db.Integer, nullable=False)
    carid = db.Column(db.Integer, nullable=True)