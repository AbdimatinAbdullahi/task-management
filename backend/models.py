from sqlalchemy import ForeignKey, DateTime, Column, Boolean, String, Integer
from mongoengine import Document, StringField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField, IntField, connect, ObjectIdField
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from bson import ObjectId
import bcrypt 
import uuid
db = SQLAlchemy() # Creating instance of a db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    fullname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    hashed_password = db.Column(db.String(256), nullable=False)
    is_verified = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Method to hash the password
    def set_hashed_password(self, password):
        self.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    # Method to check and verify password
    def check_password(self, password):
        return bcrypt.checkpw(password=password.encode('utf-8'), hashed_password=self.hashed_password.encode('utf-8'))


class Workspace(db.Model):
    __tablename__ = "workspaces"
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.String, ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    owner = db.relationship("User", backref="owned_workspaces")


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    workspace_id = db.Column(db.String, db.ForeignKey("workspaces.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text)
    workspace = db.relationship("Workspace", backref="projects")


class WorkSpaceMember(db.Model):
    __tablename__ = "workspace_members"
    id = db.Column(db.String, primary_key = True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String, ForeignKey("workspaces.id"), nullable=False)
    user_id = db.Column(db.String, ForeignKey("users.id"), nullable=False)
    role = db.Column(db.String, nullable=False, default="member")
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship("User", backref="workspace_memberships")
    workspace = db.relationship("Workspace", backref="members")



connect("projectTasks", host="mongodb://127.0.0.1:27017/")
class Task(Document):
    meta = {"collection": "tasks"}
    _id = ObjectIdField(primary_key=True, default=ObjectId)
    project_id = StringField(required=True)  # Should match project UUID from Postgres
    task_name = StringField(required=True)
    status = StringField(default='To-do', choices=['To-do', 'In Progress', 'Done'])
    created_at = StringField()
    due_date =  StringField()
    started_at =  StringField()
    task_notes = StringField()
    priority = StringField(choices=["Low", "Medium", "High"], default="Medium")
    assigned_users = ListField(StringField(), max_length=7)  # Should store user UUIDs
