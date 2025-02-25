# This file is used to manage and organize configuration settings for application.
# It helps in centralizing all configuration variabls making it easier to maintain, update and switch
# between different variables for development and Production
import os

class Config:
    SECRET_KEY = 'ABDI21563452'  # Use environment variable for secret key
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable unnecessary tracking of modifications
    SQLALCHEMY_ECHO = False  # Turn off SQL query logging


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:123456@localhost/task'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = "abdimatabdullahi@gmail.com"
    MAIL_PASSWORD = "nfpc kfmm uxvf yfat"
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    # Here we use an environment variable for the database URI to keep it flexible


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI ='postgresql://postgres:abdi2156@online-store.c9gomek04ine.us-east-1.rds.amazonaws.com/task'
    # Here we use an environment variable for the database URI to ensure security and flexibility

