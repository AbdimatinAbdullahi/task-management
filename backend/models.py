from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, DateTime, Column, Boolean, String, Integer
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import bcrypt 
db = SQLAlchemy() # Creating instance of a db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    hashed_password = db.Column(db.String(256), nullable=False)
    is_verified = db.Column(db.Boolean)

    # Method to hash the password
    def set_hashed_password(self, password):
        self.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    

    # Method to check and verify password
    def check_password(self, password):
        return bcrypt.checkpw(password=password.encode('utf-8'), hashed_password=self.hashed_password.encode('utf-8'))


class Verification(db.Model):
    __tablename__ = 'verifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    create_at = db.Column(db.DateTime, default=datetime.utcnow())
    expires_at = db.Column(db.DateTime)
    used = db.Column(db.Boolean, default=False)

    user = relationship('User', backref='verifications')

    def __init__(self, user_id, code):
        self.user_id = user_id
        self.code = code
        self.expires_at = datetime.utcnow() + timedelta(minutes=10)