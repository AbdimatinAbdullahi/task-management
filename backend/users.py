import secrets, string
from mail_routes import sendInvitationEmail
from flask import  request, jsonify, Blueprint
from models import WorkSpaceMember, db

users_bp = Blueprint("users", __name__, url_prefix='/api')

def generate_verification_code(length=16):
    charset = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
    return ''.join(secrets.choice(charset) for _ in range(length))


@users_bp.route('/invites_users', methods=["POST"])
def invites_user():
    try:
        data = request.get_json()
        print(data)
        email = data.get("email")
        fullname = data.get("username")
        workspace_id = data.get("wsId")
        workspaceName = data.get("wsName")
        user_id = data.get("userId")
        role = data.get("role")

        invitedUser = WorkSpaceMember.query.filter_by(email=email, workspace_id=workspace_id).first()
        if invitedUser:
            print("user alreadt exist!")
            return jsonify({"error": "User already invited!"}), 500
        
        code = generate_verification_code()
        print(code)
        try:
            newInvitedUser = WorkSpaceMember(
                username=fullname,  # ✅ corrected variable name
                email=email,
                workspace_id=workspace_id,
                user_id=user_id,
                role=role,
                accepted=True
            )
        except Exception as e:
            print(f"Creation of new user failed! {str(e)}")
            return jsonify({"error" : "something went wrong"}), 500

        db.session.add(newInvitedUser)
        db.session.commit()
        sendInvitationEmail(email=newInvitedUser.email, user_id=newInvitedUser.id, workspaceName=workspaceName)

        print(data)
        return jsonify({"message": "User invited successfully"}), 200

    except Exception as e:
        print(f"Something went wrong: {str(e)}")
        return jsonify({"error": "Something went wrong"}), 500



@users_bp.route('/accept-invitations/<userId>', methods=["POST"])
def accept_invitations(userId):
    try:
        data = request.get_json()
        user = WorkSpaceMember.query.filter_by(id=userId).first()
        if not user:
            return jsonify({"error" : "User not found"}), 404
        
        user.set_hashed_password(password=data.get("password"))
        try:
            db.session.commit()
            print("Saved!")
        except Exception as e:
            print("Updating the password field not successful!: ", str(e))
            return jsonify({"error": "Not saved"}), 500           
        return jsonify({"message" : "User accepted successfuly"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error" : "Something went wrong while accepting the inviation"}), 500
    
@users_bp.route('/get-workspace_members')
def get_workspace_members():
    try:
        wsId = request.args.get("id")
        print("Worspace id: ___ ", wsId)
        wsMembers = WorkSpaceMember.query.filter_by(workspace_id=wsId).all()
        wsMembersArr = []
        for member in wsMembers:
            wsMembersArr.append({
                "fullname" : member.username,
                "email" : member.email,
                "id" : member.id
            })
        return jsonify({"members" : wsMembersArr}), 200
    except Exception as e:
        print(f"Request failed while fetching Mmebers: {str(e)}")
        return jsonify({"error" : "Member fetch failed!"}), 500
