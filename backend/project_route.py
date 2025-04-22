from flask import Blueprint, current_app, jsonify, json, request
from models import Task, Project, Workspace, db
from bson import ObjectId
from datetime import datetime

project_bp = Blueprint("project", __name__, url_prefix='/api')




@project_bp.route('/create-workspace', methods=["POST"])
def create_workspace():
    try:
        data = request.get_json()
        owner_id = data.get("owner_id")
        name = data.get("name")
        workspace = Workspace.query.filter_by(owner_id=owner_id).first()
        if workspace:
            return jsonify({"error" : "Workspace already exist"}), 401
        
        new_workspace = Workspace(name=name, owner_id=owner_id)
        db.session.add(new_workspace)
        db.session.commit()
        return jsonify({"message" : "Workspace create successfully"}), 200
    except Exception as e:
        print(f"Something went wrong while creating workspace: {str(e)}")
        return jsonify({"error" : "Something went wrong"}), 500


@project_bp.get('/projects/<user_id>')
def get_projects(user_id):
    try:
        projects = Project.query.filter_by(user_id=user_id).all()
        # project_json = [project.to_dict() for project in projects]
        # Convert each project to a dictionary
        projects_json = [project.to_dict() for project in projects]
        print(projects_json)
        return jsonify({"projects": projects_json})
    
    except Exception as e:
        print("Error occured while accessing project: ", str(e))
        return jsonify({"error": f"Errow occrs while accessing data from database: {str(e)}"}), 500



@project_bp.get('/get_tasks/<projectId>')
def get_project_by_id(projectId):
    try:
        # Fetch all tasks for the given projectId
        tasks = Task.objects(project_id=projectId)
        if not tasks:
            print(f"No tasks found for project with ID {projectId}")
            return jsonify({"message": f"No tasks found for project with ID {projectId}"}), 404

        # Convert tasks to JSON (no need to use json.loads here)
        tasks_json = tasks.to_json()
        # Return the response
        return jsonify({"message": "Success fetching the project", "tasks": json.loads(tasks_json)}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": f"Error while getting the project with ID {projectId}"}), 500


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
        new_task_name = data.get("task_name")
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
@project_bp.route("/update_task_status/<taskId>", methods=["PUT"])
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
@project_bp.route("/update_task_dates/<taskId>", methods=["PUT"])
def updateTaskDates(taskId):
    try:
        data = request.get_json()
        print(data)
        newStartDate = data.get("newStartDate")
        newDueDate = data.get("newDueDate")

        task_id = ObjectId(taskId)

        task = Task.objects(_id=task_id).first()

        if task:
            print(taskId)
            task.due_date = newDueDate
            task.started_at = newStartDate
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






@project_bp.route("/update_task_description/<taskId>", methods=["PUT"])
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
