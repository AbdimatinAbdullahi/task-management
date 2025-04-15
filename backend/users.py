from flask import  request, jsonify, Blueprint
from models import Invitations

users_bp = Blueprint("users", __name__, url_prefix='/api')


@users_bp.route('/invites_users', methods=["POST"])
def invites_user():
    try:
        data = request.get_json()
        print(data)
        return jsonify({"message": "User invited successfully"}), 200

    except Exception as e:
        print("Something went wrong")
        return jsonify({"error": "Something went wrong"}), 500

@users_bp.route('/fetch_assigness/<projectId>', methods=["GET"])
def fetch_assigness(projectId):
    try:
        print(projectId)
        _assigness = Invitations.query.filter_by(project_id=projectId).all()
        assigness = [a.to_dict() for a in _assigness]
        print("Hello world!", assigness)
        return jsonify({"message" : "Fetched successfuly", "assigness" : assigness})
    except Exception as e:
        print("Something is going wrong while fetching users: ",str(e))
        return jsonify({"error" : f"{str(e)}"})