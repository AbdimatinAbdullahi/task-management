from sqlalchemy import ForeignKey, DateTime, Column, Boolean, String, Integer
from mongoengine import Document, StringField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField, IntField, connect, ObjectIdField
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta



import bcrypt 
db = SQLAlchemy() # Creating instance of a db
from bson import ObjectId

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


class Project(db.Model):
    project_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("user.id"), nullable=False)
    description = db.Column(db.String)
    name = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    finished_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "project_id": self.project_id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "finished_at": self.finished_at.isoformat() if self.finished_at else None
        }

class Invitations(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    email_address = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer,  ForeignKey("project.project_id"), nullable=False,)
    username = db.Column(db.String(100), nullable=False)
    status = db.Column(db.Boolean,nullable=False)
    token = db.Column(db.String(1000), nullable=False)
    
    def to_dict(self):
        return {
            "projectId" : self.project_id,
            "username": self.username,
            "email": self.email_address,
            "id": self._id,
            "status": self.status,
        }


# Tasks Managment on MongoDB
connect("projectTasks", host="mongodb://127.0.0.1:27017/")
class Task(Document):
    meta = {
        "collection" : "tasks"
    }
    _id = ObjectIdField(default=ObjectId, primary_key=True)
    project_id = IntField()
    task_name= StringField()
    status = StringField(default='To-do')
    created_at =  DateTimeField(default=datetime.utcnow())
    due_date = StringField(default=None)
    started_at = StringField(default=None)
    task_notes = StringField()
    priority = StringField()
    project_name = StringField()
    assigned_users = ListField(StringField(), max_length=5)