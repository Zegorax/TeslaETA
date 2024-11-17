from config import db
from models.share import Share
from apiflask import HTTPError
import time

def is_share_valid(shortuuid: str) -> Share:
    share = db.session.query(Share).where(Share.shortuuid == shortuuid).first()
    
    if not share:
        raise HTTPError(404, "Link not found.")
    
    if share.expiry < time.time():
        raise HTTPError(403, "Link expired.")
    
    return share