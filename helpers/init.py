from config import db
from models.user import User
import bcrypt, os
from flask import current_app as app

def provision_admin_user():
    # with app.app_context():
    
    user = User.query.where(User.username == "admin").first()
    
    if not user:
        print("Admin user already exists, skipping insert.")
        return
    
    print("Adding admin user...")
    
    admin_password = os.getenv("ADMIN_PASSWORD")
    hashed_password = bcrypt.hashpw(admin_password)
    
    admin_user = User(username="admin", password=hashed_password)
    db.session.add(admin_user)
    db.session.commit()