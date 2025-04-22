from flask import Flask, request, jsonify, Blueprint, current_app
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from mail_routes import send_verification_email
from datetime import datetime, timedelta
from models import db, User, Workspace
from jwt import encode, decode
import string, random
import jwt


auth_bp = Blueprint("auth", __name__)




# Function to generate verification code
def generate_code():
    characters = string.digits
    return ''.join(random.choice(characters) for i in range(6))


@auth_bp.route('/signup', methods=["POST"])
def register_user():
    try:
        data = request.get_json()
        fullname = data.get("fullname")
        email = data.get("email")
        password = data.get("password")
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User with this email already exist"}), 400
        

        new_user = User(email=email, fullname=fullname, is_verified=True)
        new_user.set_hashed_password(password=password)
        db.session.add(new_user)
        db.session.commit()


        print(f"** New user id ** {new_user.id}")

        return jsonify({"message": "User registration successful", "owner_id": new_user.id}), 200
    except Exception as e:
        print(f"Something went wrong while creating account {str(e)}")
        return jsonify({"error" : "Sonething went wrong while creating account"}), 500


@auth_bp.route('/login', methods=["POST"])
def login_user():
    data = request.get_json()
    print(data)
    email = data.get("email")
    password  = data.get("password")

    # Query user from db by email => Check password
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid Email or password"}), 401

    workspace = Workspace.query.filter_by(owner_id=user.id).first()
    if not workspace:
        return jsonify({"message" : "Create Workspace", "owner_id" : user.id, "has_workspace": False}), 200

    # Lets assign payload here
    payload = {
        "sub": str(user.id), # Subject (User ID)
        "email": user.email,
        "role" : "admin",
        "fullname": user.fullname,
        "iat": datetime.utcnow(),  # Issued at time
        "exp": datetime.utcnow() + timedelta(hours=10)  # Expiration time
    }


    secret_key = current_app.config["SECRET_KEY"]

    token = jwt.encode(payload, secret_key, algorithm='HS256')
    print(f"Encoded Token: {token}")
    return jsonify({"message": "Login successful", "token": token, "id": user.id, "fullname": user.fullname, "email": user.email, "has_workspace" : True}), 200




@auth_bp.route("/protected", methods=["GET"])
def protected():
    try:
        # 1️⃣ Get token from request headers
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return jsonify({"message": "Token not found"}), 403
            
        # 2️⃣ Extract the token by removing the "Bearer" prefix
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Invalid Authorization header format"}), 401
        token = auth_header.split(" ")[1]  # Extract the actual token
        token = token.strip()
        # 3️⃣ Get the secret key inside an app context
        secret_key = current_app.config["SECRET_KEY"]

        # 4️⃣ Decode JWT Token
        decoded_token = jwt.decode(token, secret_key, algorithms=["HS256"])

        # Extract User Info
        user_id = decoded_token.get("sub")  # Use .get() to avoid KeyError
        email = decoded_token.get("email")
        fullname = decoded_token.get("fullname")

        return jsonify({
            "message": "Authentication successful",
            "token": token,
            "id": user_id,
            "fullname": fullname,
            "email": email
        }), 200

    except ExpiredSignatureError:
        print("Token Expired")
        return jsonify({"error": "Token has expired"}), 401
    except InvalidTokenError:
        print("Invalid Token")
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print(f"Error: {e}")  # Debugging
        return jsonify({"error": "Internal Server Error"}), 500
