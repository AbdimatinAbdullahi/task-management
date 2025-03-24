from flask import Blueprint, current_app, jsonify, json, request
from models import Task, Project
from bson import ObjectId

project_bp = Blueprint("project", __name__, url_prefix='/api')



@project_bp.get('/projects/<user_id>')
def get_projects(user_id):
    try:
        projects = Project.objects(user_id=user_id)
        projects_json = json.loads(projects.to_json())

        
        return jsonify({"projects": projects_json})
    
    except Exception as e:
        return jsonify({"error": f"Errow occrs while accessing data from database: {str(e)}"}), 500



@project_bp.get('/get_project/<projectId>')
def get_project_by_id(projectId):
    try:
        project_id = ObjectId(projectId) 
        project = Project.objects.get(id=project_id)  
        project_json = json.loads(project.to_json())
        return jsonify({"message": "Success fetching the project", "project" : project_json}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": f"Error while getting the project with {projectId}"}), 500



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


# Function to create new task
@project_bp.route('/create-task', methods=["POST"])
def create_new_task():
    try:
        data = request.get_json()
        
        return jsonify({"message": "Task created successfuly"}), 200
    except Exception as e:
        return jsonify({"message": "Error while creating task"}), 500