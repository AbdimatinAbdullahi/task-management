from config import DevelopmentConfig, ProductionConfig
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from auth_routes import auth_bp
from models import db, User
from flask_mail import Mail
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
#Loading configuration with flask app
app.config.from_object(DevelopmentConfig)
db.init_app(app) # Intializing the SQLAlchemy with flask app
JWTManager(app=app)
mail = Mail(app)
# Auth routes
app.register_blueprint(auth_bp, url_prefix='/auth')

with app.app_context():
    db.create_all()



if __name__ == "__main__":
    app.run(debug=True)