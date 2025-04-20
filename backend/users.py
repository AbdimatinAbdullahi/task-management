import secrets, string
from mail_routes import sendInvitationEmail
from flask import  request, jsonify, Blueprint
from models import Invitations, Task, db

users_bp = Blueprint("users", __name__, url_prefix='/api')

@users_bp.route('/fetch_assigness/<projectId>', methods=["GET"])
def fetch_assigness(projectId):
    try:
        _assigness = Invitations.query.filter_by(project_id=projectId).all()
        assigness = [a.to_dict() for a in _assigness]
        return jsonify({"message" : "Fetched successfuly", "assigness" : assigness})
    except Exception as e:
        print("Something is going wrong while fetching users: ",str(e))
        return jsonify({"error" : f"{str(e)}"})



@users_bp.route('/project_progress/<projectId>', methods=["GET"])
def get_project_progress(projectId):
    try:
        complete_tasks = Task.objects(project_id=projectId, status="Complete")
        all_tasks = Task.objects(project_id=projectId)

        total_tasks = len(all_tasks)
        total_complete_tasks = len(complete_tasks)

        if total_tasks == 0:
            percent_complete = 0
        else:
            percent_complete = round((total_complete_tasks / total_tasks) * 100)

        print(f"Percent Complete: {percent_complete}")

        return jsonify({
            "message": "Successfully calculated",
            "percentComplete": percent_complete
        }), 200

    except Exception as e:
        print("Something went wrong!", str(e))
        return jsonify({"error": str(e)}), 500


def generate_verification_code(length=16):
    charset = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
    return ''.join(secrets.choice(charset) for _ in range(length))


@users_bp.route('/invites_users', methods=["POST"])
def invites_user():
    try:
        data = request.get_json()
        email = data.get("email")
        fullname = data.get("username")
        project_id = data.get("project_id")
        invitedUser = Invitations.query.filter_by(email_address=email, project_id=project_id).first()
        if invitedUser:
            print("user alreadt exist!")
            return jsonify({"error": "User already invited!"}), 500
        
        code = generate_verification_code()
        print(code)

        try:
            newInvitedUser = Invitations(
                email_address=email,
                project_id=project_id,
                username=fullname,  # ✅ corrected variable name
                status=False,
                token=code
            )
        except Exception as e:
            print(f"Creation of new user failed! {str(e)}")
            return jsonify({"error" : "something went wrong"}), 500

        db.session.add(newInvitedUser)
        db.session.commit()
        sendInvitationEmail(email=newInvitedUser.email_address, code=code, user_id=newInvitedUser._id, projectName="Ecommerce Website")

        print(data)
        return jsonify({"message": "User invited successfully"}), 200

    except Exception as e:
        print(f"Something went wrong: {str(e)}")
        return jsonify({"error": "Something went wrong"}), 500



@users_bp.route('/accept-invitations', methods=["POST"])
def accept_invitations():
    try:
        data = request.get_json()
        print(data)
        return jsonify({"message" : "User accepted successfuly"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error" : "Something went wrong while accepting the inviation"}), 500

