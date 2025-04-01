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
    

# Function to update the task name
@project_bp.route("/update_task_name/<taskId>", methods=["PUT"])
def updateTaskName(taskId):
    try:
        data = request.get_json()
        task_name = data.get("task_name")
        print(f"Updating the task with task id {taskId} and task name {task_name}")
        return jsonify({"message": "success"}), 200
    except Exception as e:
        print(f"Error updating the task name {str(e)}")
        return  jsonify({"message" :"error"}), 500



# Function to update task status
@project_bp.route("/update_task_status/<taskId>", methods=["PUT"])
def updateTaskStatus(taskId):
    try:
        data = request.get_json()
        print(f"New task status : {data.get("status")}")
        return jsonify({"message": "Update Successfull"}), 200
    except Exception as e:
        print(f"Error while updating task status {str(e)}")
        return jsonify({"message" : "Error while updating task status"}), 500



# Function to update task dates
@project_bp.route("/update_task_dates/<taskId>", methods=["PUT"])
def updateTaskDates(taskId):
    try:
        data = request.get_json()
        print(f"Updating task with start_date : {data.get("start_date")} and End date : {data.get("due_date")} " )
        return jsonify({"message": "Update Successfull"}), 200
    except Exception as e:
        print(f"Error while updating task dates {str(e)}")
        return jsonify({"message" : "Error while updating task dates"}), 500



# Function to update task priority
@project_bp.route("/update_task_priority/<taskId>", methods=["PUT"])
def updateTaskPriority(taskId):
    try:
        data = request.get_json()
        print(f"New task priority : {data.get("priority")}")
        return jsonify({"message": "Update Successfull"}), 200
    except Exception as e:
        print(f"Error while updating task priority {str(e)}")
        return jsonify({"message" : "Error while updating task priority"})






@project_bp.route("/update_task_description/<taskId>", methods=["PUT"])
def UpdateTaskDescription(taskId):
    try:
        data = request.get_json()
        print(f"New task description : {data.get("description")}")
        return jsonify({"message": "Update Successfull"}), 200
    except Exception as e:
        print(f"Error while updating task description {str(e)}")
        return jsonify({"message" : "Error while updating task description"})
   