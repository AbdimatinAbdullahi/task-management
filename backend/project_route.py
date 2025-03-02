from flask import Blueprint, current_app, jsonify, json, request
from models import Task, Project
project_bp = Blueprint("project", __name__, url_prefix='/api')



@project_bp.get('/projects/<user_id>')
def get_projects(user_id):
    try:
        projects = Project.objects(user_id=user_id)
        project_json = json.loads(projects.to_json())

        
        return jsonify({"projects": project_json})
    
    except Exception as e:
        return jsonify({"error": f"Errow occrs while accessing data from database: {str(e)}"}), 500



@project_bp.route("/create-new-project", methods=["POST"])
def create_new_project():
    try:
        data = request.get_json()
        print(data)
        new_project = Project(name=data.get("name"), user_id=data.get("user_id"))
        new_project.save()
        return jsonify({"message":"Creatation success"}), 200
    except Exception as e:
        return jsonify({"error": f"{str(e)}"})