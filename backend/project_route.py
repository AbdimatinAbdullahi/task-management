from flask import Blueprint, current_app, jsonify, json, request
from models import Task, Project
from bson import ObjectId
from datetime import datetime

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
        project_id = data.get("projectId")

        task_id = ObjectId(taskId)
        projectid = ObjectId(project_id)

        # Finding the project
        project = Project.objects(id=projectid).first() # Finding the project with the project id

        updated =False
        for task in project.tasks:
            if task._id == task_id:
                task.task_name = task_name
                if not task.started_at:
                    task.started_at = None  # Avoid empty string issues
                updated = True
                break
        
        if not updated:
            print("Not updated")
            return jsonify({"message": "The update not successfull"}), 500

        project.save()

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
        projectId = data.get("projectId")
        newStatus = data.get("status")

        
        task_id = ObjectId(taskId)
        project_id = ObjectId(projectId)
        
        project = Project.objects(id=project_id).first()

        updated = False

        for task in project.tasks:
            if task._id == task_id:
                task.status = newStatus
                updated = True
                break

        if not updated:
            print("Not updated")
            return jsonify({"message": "The update not successfull"}), 500

        project.save()

        print("The Status update successfull")
        return jsonify({"message": "Update successfull"}), 200

    except Exception as e:
        print(f"Error while updating task status {str(e)}")
        return jsonify({"message" : "Error while updating task status"}), 500



# Function to update task dates
@project_bp.route("/update_task_dates/<taskId>", methods=["PUT"])
def updateTaskDates(taskId):
    try:
        data = request.get_json()

        print(data)

        task_id = ObjectId(taskId)
        projectId = data["payload"]["projectId"]
        print(projectId)
        project_Id = ObjectId(projectId)


        project = Project.objects(id=project_Id).first()
        print(project)
        updated = False

        for task in project.tasks:
            if task._id == task_id:
                task.due_date = datetime.strptime(data["payload"]["due_date"], "%Y-%m-%d") if data["payload"]["due_date"] else None
                updated = True


        print(f"Updating task with start_date : {data["payload"]["started_at"]} and End date : {data["payload"]["due_date"]}" )
        return jsonify({"message": "Update Successfull"}), 200
    except Exception as e:
        print(f"Error while updating task dates {str(e)}")
        return jsonify({"message" : "Error while updating task dates"}), 500



# Function to update task priority
@project_bp.route("/update_task_priority/<taskId>", methods=["PUT"])
def updateTaskPriority(taskId):
    try:
        data = request.get_json()

        task_id = ObjectId(taskId)
        project_id = data.get("projectId")
        projectId = ObjectId(project_id)

        project = Project.objects(id=projectId).first()

        updated = False

        for task in project.tasks:
            if task._id == task_id:
                task.priority = data.get("priority")
                updated = True
                break

        project.save()

        print(f"New task priority : {data.get("priority")}")
        return jsonify({"message": "Update Successfull"}), 200
    except Exception as e:
        print(f"Error while updating task priority {str(e)}")
        return jsonify({"message" : "Error while updating task priority"}), 500






@project_bp.route("/update_task_description/<taskId>", methods=["PUT"])
def UpdateTaskDescription(taskId):
    try:
        data = request.get_json()
        print(f"New task description : {data.get("description")}")
        return jsonify({"message": "Update Successfull"}), 200
    except Exception as e:
        print(f"Error while updating task description {str(e)}")
        return jsonify({"message" : "Error while updating task description"})
   