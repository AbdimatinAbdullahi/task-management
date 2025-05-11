from flask import Blueprint, current_app, jsonify, json, request
from models import Task, Project, Workspace, db
from datetime import datetime
from functools import wraps
from bson import ObjectId
import asyncio
import jwt

project_bp = Blueprint("project", __name__, url_prefix='/api')



def require_role(allowed_roles): # Decorator factory and it passes allowed roles to decorator
    def decorator(f): # Actual decorator that takes the function to be wrapped!
        @wraps(f)
        def wrapper(*args, **kwargs): # What is this args and kwargs now ???
            auth_header = request.headers.get("Authorization", None)
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"error" : "Misssing credintials or invalid token"}), 401
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=['HS256'])
                user_role = payload.get("role")
                if user_role not in allowed_roles:
                    return jsonify({"error" : "Forbidden: Insufficient permission!"}), 403
                return f(*args, **kwargs) # returns proceeds to original functin if everything is okay!
            except jwt.ExpiredSignatureError:
                print("Error due to expired token", str(e))
                return jsonify({"error" : "Expired Token!"}), 401
            except jwt.InvalidTokenError as e:
                print("Error due to invalid token", str(e))
                return jsonify({"error" : "Invalid Token"}), 401
        return wrapper
    return decorator


@project_bp.route('/create-workspace', methods=["POST"])
def create_workspace():
    try:
        data = request.get_json()
        owner_id = data.get("owner_id")
        name = data.get("name")
        workspace = Workspace.query.filter_by(owner_id=owner_id).first()
        if workspace:
            return jsonify({"error" : "You already have workspace"}), 401
        
        new_workspace = Workspace(name=name, owner_id=owner_id)
        db.session.add(new_workspace)
        db.session.commit()
        return jsonify({"message" : "Workspace create successfully"}), 200
    except Exception as e:
        print(f"Something went wrong while creating workspace: {str(e)}")
        return jsonify({"error" : "Something went wrong"}), 500



@project_bp.route("/create-new-project", methods=["POST"])
@require_role(["admin"])
def create_new_project():
    try:
        data = request.get_json()
        new_project = Project(name=data.get("name"), workspace_id=data.get("workspace_id"),description=data.get("description"))
        db.session.add(new_project)
        db.session.commit()
        project ={
            "name" : new_project.name,
            "id" : new_project.id,
            "description" : new_project.description,
            "created_at" : new_project.created_at
        }
        return jsonify({"message":"Creatation success", "project" : project}), 200
    except Exception as e:
        return jsonify({"error": f"{str(e)}"})




@project_bp.get('/get_workspace_data/<user_id>')
async def get_workspaces(user_id):
    try:
        workspace = Workspace.query.filter_by(owner_id=user_id).first()
        if not workspace:
            return jsonify({"error" : "Now workspace avalable"}), 404
        workspace_data = {
            "name": workspace.name,
            "id" : workspace.id,
            "owner" :   workspace.owner_id,
        }

        projects = Project.query.filter_by(workspace_id=workspace.id).all();
        projects_data = []

        for project in projects:
            projects_data.append({
                "name" : project.name,
                "id" : project.id,
                "description" : project.description,
                "created_at" : project.created_at
            });        
        return jsonify({"workspace_data" : workspace_data, "projects" : projects_data}), 200
    except Exception as e:
        print("Error occured while accessing project: ", str(e))
        return jsonify({"error": f"Errow occrs while accessing data from database: {str(e)}"}), 500
    
# Function to create new task

def safe_parse_date(date_str):
    if date_str and isinstance(date_str, str) and date_str.strip():
        return datetime.strptime(date_str.strip(), "%Y-%m-%d")
    return None

@project_bp.route('/create-task', methods=["POST"])
@require_role(["admin"])
def create_new_task():
    try:
        data = request.get_json()
        print(data)
        task_name = data["newTask"]["task_name"]
        description = data["newTask"]["description"]
        priority = data["newTask"]["prioity"]
        start_date_str = data["newTask"]["start_date"]
        start_date = safe_parse_date(start_date_str)
        print(start_date)
        due_data = safe_parse_date(data["newTask"]["due_date"])
        status = data["newTask"]["status"]
        asignees = data["newTask"]["assignees"]
        project_id = data["project_id"]

        newTask = Task(
            task_name=task_name,
            project_id=project_id,
            status=status,
            due_date=due_data or None,
            started_at=start_date or None,
            task_notes=description,
            assigned_users=asignees or [],
            priority=priority
            )
        newTask.save()
        task = {
            "_id" : str(newTask._id),
            "project_id" : newTask.project_id,
            "task_name": newTask.task_name,
            "status" : newTask.status,
            "created_at": newTask.created_at,
            "due_date" : newTask.due_date,
            "started_at": newTask.started_at,
            "task_notes": newTask.task_notes,
            "priority" : newTask.priority,
            "assigned_users": newTask.assigned_users       
            }
        return jsonify({"message": "Task created successfuly", "task": task}), 200
    except Exception as e:
        print("Something went wrong while creating task: ", str(e))
        return jsonify({"message": "Server Error while creating task"}), 500
    


@project_bp.get('/get_tasks/<s_project_id>')
def get_tasks(s_project_id):
    try:
        tasks = Task.objects(project_id=s_project_id)
        tasks_json = tasks.to_json()
        return jsonify({"tasks" : json.loads(tasks_json)})
    except Exception as e:
        print("Something went wrong while getting tasks: ", str(e))
        return jsonify({"error" : "Server Error while getting tasks"}), 500




# Function to update the task name
@project_bp.route("/update_task_name/<taskId>", methods=["PATCH"])
def updateTaskName(taskId):
    try:
        data = request.get_json()
        new_task_name = data.get("name")
        print("Id of task: ", taskId)
        task_id = ObjectId(taskId)

        # Finding the project
        task = Task.objects(_id=task_id).first() # Finding the project with the project id

        if not task:
            print("Task is not received")
        
        task.task_name = new_task_name
        task.save()
        
        print(f"Updating the task with task id {taskId} and task name {new_task_name}")
        return jsonify({"message": "success"}), 200
    except Exception as e:
        print(f"Error updating the task name {str(e)}")
        return  jsonify({"message" :"error"}), 500



# Function to update task status
@project_bp.route("/update_task_status/<taskId>", methods=["PATCH"])
def updateTaskStatus(taskId):
    try:
        data = request.get_json()
        newStatus = data.get("status")

        
        task_id = ObjectId(taskId)
        print(task_id)
        
        task = Task.objects(_id=task_id).first()

        if task:
            task.status = newStatus
            task.save()
            print("The Status update successfull")
            return jsonify({"message": "Update successfull"}), 200
        else:
            print("Task not there")
            return jsonify({"error": "Task not there"}), 404

    except Exception as e:
        print(f"Error while updating task status {str(e)}")
        return jsonify({"message" : "Error while updating task status"}), 500



# Function to update task dates
@project_bp.route("/update_task_date/<taskId>", methods=["PATCH"])
def updateTaskDates(taskId):
    try:
        data = request.get_json()
        print(data)

        task_id = ObjectId(taskId)

        task = Task.objects(_id=task_id).first()

        if task:
            if "start_date" in data:
                new_start = datetime.fromtimestamp(data["start_date"] / 1000)
                task.started_at = new_start
                task.save()
                print("Start date updated! ✅")

            if "due_date" in data:
                new_due = datetime.fromtimestamp(data["due_date"] / 1000)
                task.due_date = new_due
                task.save()

            print("Task dates update successful")
            return jsonify({"message": "Task date update successful"}), 200
        else:
            print("Task not found")
            return jsonify({"error": "Task not found"}), 404
    
    except Exception as e:
        print(f"Error while updating task dates {str(e)}")
        return jsonify({"message" : "Error while updating task dates"}), 500



# Function to update task priority
@project_bp.route("/update_task_priority/<taskId>", methods=["PUT"])
def updateTaskPriority(taskId):
    try:
        data = request.get_json()

        task_id = ObjectId(taskId)

        task = Task.objects(_id=task_id).first()
        
        # If task exists make and update
        if task:
            task.priority = data.get("priority")
            task.save()
            print(f"New task priority : {data.get("priority")}")
            return jsonify({"message": "Update Successfull"}), 200
        else:
            print("Priority update not successfull")
            return jsonify({"error" : "Something went wrong"}), 404

    except Exception as e:
        print(f"Error while updating task priority {str(e)}")
        return jsonify({"message" : "Error while updating task priority"}), 500




@project_bp.route("/update_task_description/<taskId>", methods=["PATCH"])
def UpdateTaskDescription(taskId):
    try:
        data = request.get_json()
        
        task_id = ObjectId(taskId)

        task = Task.objects(_id=task_id).first()

        if task:
            task.task_notes = data.get("description")
            task.save()
            print("Task description update successful")
            return jsonify({"message": "update successful"}), 200
        else:
            print("Updating description not succesful")
            return jsonify({"error", "Something went wrong"}), 400

    except Exception as e:
        print(f"Error while updating task description {str(e)}")
        return jsonify({"message" : "Error while updating task description"})
   

@project_bp.route('/create_task', methods=["POST"])
def create_task():
    try:
        data = request.get_json()
        print(data)
        taskName = data.get("taskName")
        taskNotes = data.get("taskNotes")
        priority = data.get("priority")
        startDate = data.get("startDate")
        dueDate = data.get("dueDate")
        status = data.get("status")
        projectId = data.get("projectId")
        projectName = data.get("projectName")

        try:
            task = Task(
                project_id=projectId,
                project_name=projectName,
                task_name=taskName,
                task_notes=taskNotes,
                priority=priority,
                due_date=dueDate,
                started_at=startDate,
                status=status,
            )
            task.save()
            task_json = task.to_json()
            return jsonify({"message": "Tasked Added!", "task": json.loads(task_json)}), 200
        except Exception as e:
            print(f"Error occured: {str(e)}")
            return jsonify({"error" : "Task addition falied!"}), 500
        # return jsonify({"message" : "Error occured", "task": data}), 200

    except Exception as e:
        print(f"Error while adding task {str(e)}")
        return jsonify({"error" : "Error occured"}), 500
    

@project_bp.route('/delete_task/<taskId>', methods=["PUT"])
def delete_project(taskId):
    try:
        task_id = ObjectId(taskId)
        print("Task id:", task_id)
        try:
            task = Task.objects(_id=task_id).first()
            task.delete()
            return jsonify({"message": "Deleted successful"}), 200
        except Exception as e:
            return jsonify({"error" : "Something went wrong"}), 500
    except Exception as e:
        print(f"Error while delete task: ", str(e))
        return jsonify({"error" : "Error deleting task"}), 500




@project_bp.route('/update_task_members/<taskId>', methods=["PATCH"])
def update_task_members(taskId):
    try:
        data = request.get_json()
        print(data)
        task_id = ObjectId(taskId)
        try:
            task = Task.objects(_id=task_id).first()
            if len(data["addedMembers"]) != 0:
                for user_id in data["addedMembers"]:
                    task.update(add_to_set__assigned_users=user_id)
                    print("Added a user")
            if len(data["removedMembers"]) != 0:
                for user_id in data["removedMembers"]:
                    task.update(pull__assigned_users=user_id)
                    print("User removed successfully")
            return jsonify({"message" : "Task update successful"})
        except Exception as e:
            print(f"Failed {str(e)}")
            return jsonify({"error" : str(e)})                
    except Exception as e:
        print("Failed while updating task members: ", str(e))
        return jsonify({"error" : "Failed updating task members"}), 500



@project_bp.route('/delete-project/<projectId>', methods=["DELETE"])
def delete_project_and_project_resources(projectId):
    try:
        project = Project.query.filter_by(id=projectId).first()
        if not project:
            print("Project not found!")
            return jsonify({"error" : "Project not found"}), 404
        
        deleted_tasks = Task.objects(project_id=projectId).delete()
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message" : "Project deleted", "id" : projectId}), 200
    except Exception as e:
        print("Something went wrong while deleteing project: ", str(e))
        return jsonify({"error" : "Error while deleting project"}), 500
