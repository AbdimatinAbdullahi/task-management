from flask import Flask, request, jsonify, json, Blueprint
from models import Task, Workspace, WorkSpaceMember, Project, User, db
import redis


aggregation_bp = Blueprint("dashboard" , __name__, url_prefix='/api')

r = redis.Redis(host="redis-14924.c246.us-east-1-4.ec2.redns.redis-cloud.com", port=14924, password="OOt2VD4HlqlPBk23RcYzGUAoMrPGSYdB", decode_responses=True)

# r = redis.Redis(
#     host="redis-14924.c246.us-east-1-4.ec2.redns.redis-cloud.com",  # ✅ Host only
#     port=14924,                                                     # ✅ Port separately
#     password="OOt2VD4HlqlPBk23RcYzGUAoMrPGSYdB",
#     decode_responses=True
# )


def aggregation_job(user_id):
    try:
        print(user_id)

        members  = [] # It will hold members of the task and total task that is assigned to the
        project_summary = {
            "to_do_tasks_numbers" : 0,
            "in_progress_tasks_numbers": 0,
            "unassigned_tasks_numbers" : 0,
            "done_task_numbers" : 0,
            "total_number_of_tasks" : 0,
            "number_of_projects"  : 0
        }
        workspace = Workspace.query.filter_by(owner_id=user_id).first()
        project_tasks = []
        if workspace:
            ws_members = WorkSpaceMember.query.filter_by(workspace_id=workspace.id).all()
            for member in ws_members:
                members.append({
                    "fullname" : member.username,
                    "email" : member.email,
                    "role" : member.role,
                    "accepted" : member.accepted,
                    "joined_at" : member.joined_at,
                    "member_id" :member.id
                })

            projects = Project.query.filter_by(workspace_id=workspace.id).all()
            if projects:
                for project in projects:
                    tasks = Task.objects(project_id=project.id)

                    for task in tasks:
                        task_dict = task.to_mongo().to_dict()
                        task_dict["_id"] = str(task_dict["_id"]) 
                        project_tasks.append(task_dict)
                    
                    total_tasks = tasks.count()
                    done_tasks = tasks.filter(status="Done").count()
                    inprogress_tasks = tasks.filter(status="In Progress").count()
                    todo_tasks = tasks.filter(status="To-do").count()
                    unassigned_tasks = tasks.filter(assigned_users__size=0).count()

                    project_summary["done_task_numbers"] += done_tasks
                    project_summary["in_progress_tasks_numbers"] += inprogress_tasks
                    project_summary["total_number_of_tasks"] += total_tasks
                    project_summary["unassigned_tasks_numbers"] += unassigned_tasks
                    project_summary["to_do_tasks_numbers"] += todo_tasks
                    project_summary["number_of_projects"] += 1
            else:
                print("No project is found!")
                return
        else:
            print("No workspace data is found!")
            return        

        redis_key = f"workspace:{user_id}:dashboard"
        dashboard_data = {
            "members" : members,
            "project_summary" : project_summary,
            "tasks" : project_tasks
        }


        r.set(redis_key, json.dumps(dashboard_data), ex=3600)
    except Exception as e:
        print(f"Something went wromg: {str(e)}")
        return jsonify({"error" : "Something went wrong"}), 500

@aggregation_bp.route('/dashboard')
def get_workspace_data():
    try:
        use_id = request.args.get("user_id")
        redis_key = f"workspace:{use_id}:dashboard"

        cached_data = r.get(redis_key)
        if cached_data:
            return jsonify({"data" : json.loads(cached_data)}), 200
        
        aggregation_job(use_id)
        cached_data = r.get(redis_key)
        return jsonify({"data" : json.loads(cached_data)}), 200
    except Exception as e:
        print("Something went wrong while getting the dashboard data: +++ ", str(e))
        return jsonify({"error" : "Something went wrong"}), 500