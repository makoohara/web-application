# Import necessary libraries and modules
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import secrets
from flask_cors import CORS

# Initialize SQLAlchemy to be used later in our models
db = SQLAlchemy()

def create_app():
    # Create a Flask application instance
    app = Flask(__name__)
    
    # Enable CORS for the app
    CORS(app)

    # Generate a secret key for the app
    app.config['SECRET_KEY'] = secrets.token_hex(16)
    
    # Set the database URI for SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'

    # Initialize the database with the app
    db.init_app(app)
    
    # Register the main blueprint to the app
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # Create all database tables within the app context
    with app.app_context():
            db.create_all()

    # Return the app instance
    return app
