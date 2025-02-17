# This file is used to manage and organize configuration settings for application.
# It helps in centralizing all configuration variabls making it easier to maintain, update and switch
#  between different variables for development and Production


class developmentConfig(config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = ""


class ProductionConfig(config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = ""