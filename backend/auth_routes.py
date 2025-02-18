from flask import Flask, request, jsonify, Blueprint, current_app
from datetime import datetime, timedelta
from models import db, User, Verification
from jwt import encode
import string, random


from mail_routes import send_verification_email

auth_bp = Blueprint('auth', __name__)



# Function to generate verification code
def generate_code():
    characters = string.digits
    return ''.join(random.choice(characters) for i in range(6))




@auth_bp.route('/signup', methods=["POST"])
def register_user():
    data = request.get_json()
    fullname = data.get("fullname")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User with this email already exist"}), 400
    

    new_user = User(email=email, fullname=fullname, is_verified=False)
    new_user.set_hashed_password(password=password)
    db.session.add(new_user)
    db.session.commit()

    verification_code = generate_code()
    verification = Verification(user_id=new_user.id, code=verification_code)
    send_verification_email(recipient=email, code=verification_code)

    return jsonify({"message": "User registration successful"}), 200



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

    # Lets assign payload here
    payload = {
        "sub": user.id,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }

    secret_key = current_app.config["SECRET_KEY"]

    token = encode(payload=payload, key=secret_key, algorithm='HS256')

    return jsonify({"message": "Login successful", "token": token, "id": user.id, "fullname": user.fullname, "email": user.email, "verified": user.is_verified})




@auth_bp.route("/send-verification", methods=["POST"])
def send_verification():
    try:
        data = request.get_json()
        email = data.get("email")


        # Query user id from User table on email
        user = User.query.filter_by(email=email).first()
        if user:
            user_id = user.id
        
            code = generate_code()
            verification = Verification.query.filter_by(user_id=user_id).first()

            # If verification exist
            if verification:
                verification.create_at = datetime.utcnow()
                verification.expires_at = datetime.utcnow() +timedelta(minutes=10)
                verification.code = code
            else:
                Verification(user_id=user_id, code=code)

            send_verification_email(recipient=email, code=code)

        return jsonify({"message" : "Verivication code sent successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"error {str(e)}"}), 500