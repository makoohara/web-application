# Import necessary libraries and modules
from flask import Blueprint, jsonify, request, g
from .models import db, User, Task, SubTask, SubSubTask
from functools import wraps
import jwt as pyjwt
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

# Create a Blueprint for the main routes
main = Blueprint('main', __name__)

# Define the secret key for JWT encoding/decoding
SECRET_KEY = '5624a198809cd986e35e2b880c97d58d'

# Decorator function to ensure the route requires a valid token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check if the Authorization header is present in the request
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace('Bearer ', '')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode the token and set the current user in the global context
            data = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            print(e)
            return jsonify({'message': str(e)}), 500

        return f(*args, **kwargs)
    return decorated

@main.route('/login', methods=['POST'])
def login():
    print('log in page loaded')
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    if check_password_hash(user.password, password):
        # User authenticated. Let's generate the token.
        token_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)  # Token expiration set to 24 hours. Adjust as needed.
        }
        print(token_payload)
        token = pyjwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
        print("Generated token:", token)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Incorrect password!'}), 401

# Route to check if a user is authenticated based on the provided token
@main.route('/is_authenticated', methods=['GET'])
def is_authenticated():
    token = None
    # Check if the Authorization header is present in the request
    if 'Authorization' in request.headers:
        token = request.headers['Authorization'].replace('Bearer ', '')
    
    # If token exists, try to decode it
    if token:
        try:
            # Attempt to decode the token
            pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return jsonify({'is_authenticated': True}), 200
        except:
            pass
    
    return jsonify({'is_authenticated': False}), 200



# Route to get the current authenticated user's username
@main.route('/get_current_user', methods=['GET'])
@token_required
def get_current_user():
    try:
        return jsonify({'username': g.current_user.username}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Route to register a new user
@main.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        # Check for missing username or password
        if not username:
            return jsonify({'message': 'Username is required!'}), 400
        if not password:
            return jsonify({'message': 'Password is required!'}), 400

        # Check if the user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'message': 'User already exists!'}), 400

        # Hash the password and create a new user
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)

        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Route to get all tasks for the authenticated user
@main.route('/tasks', methods=['GET'])
@token_required
def get_tasks():
    tasks = Task.query.filter_by(user_id=g.current_user.id).all()
    return jsonify([task.to_dict() for task in tasks])

# Route to create a new task for the authenticated user
@main.route('/tasks', methods=['POST'])
@token_required
def create_task():
    data = request.json
    new_task = Task(title=data['title'], user_id=g.current_user.id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

# Route to update a specific task for the authenticated user
@main.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task or task.user_id != g.current_user.id:
        return jsonify({"error": "Task not found"}), 404
    data = request.json
    task.title = data['title']
    db.session.commit()
    return jsonify(task.to_dict())

# Route to delete a specific task for the authenticated user
@main.route('/tasks/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task or task.user_id != g.current_user.id:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"})

# Route to get all subtasks for a specific task
@main.route('/tasks/<int:task_id>/subtasks', methods=['GET'])
@token_required
def get_subtasks(task_id):
    subtasks = SubTask.query.filter_by(task_id=task_id).all()
    return jsonify([subtask.to_dict() for subtask in subtasks])

# Route to create a new subtask for a specific task
@main.route('/tasks/<int:task_id>/subtasks', methods=['POST'])
@token_required
def create_subtask(task_id):
    data = request.json
    new_subtask = SubTask(title=data['title'], task_id=task_id)
    db.session.add(new_subtask)
    db.session.commit()
    return jsonify(new_subtask.to_dict()), 201

# Route to delete a specific subtask
@main.route('/subtasks/<int:subtask_id>', methods=['DELETE'])
@token_required
def delete_subtask(subtask_id):
    subtask = SubTask.query.get(subtask_id)
    if not subtask:
        return jsonify({"error": "SubTask not found"}), 404
    db.session.delete(subtask)
    db.session.commit()
    return jsonify({"message": "SubTask deleted successfully"})

# Route to get all subsubtasks for a specific subtask
@main.route('/subtasks/<int:subtask_id>/subsubtasks', methods=['GET'])
@token_required
def get_subsubtasks(subtask_id):
    subsubtasks = SubSubTask.query.filter_by(subtask_id=subtask_id).all()
    return jsonify([subsubtask.to_dict() for subsubtask in subsubtasks])

# Route to create a new subsubtask for a specific subtask
@main.route('/subtasks/<int:subtask_id>/subsubtasks', methods=['POST'])
@token_required
def create_subsubtask(subtask_id):
    data = request.json
    new_subsubtask = SubSubTask(title=data['title'], subtask_id=subtask_id)
    db.session.add(new_subsubtask)
    db.session.commit()
    return jsonify(new_subsubtask.to_dict()), 201
                   
def login():
    print('log in page loaded')
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'message': 'User not found!'}), 404

    if check_password_hash(user.password, password):
        # User authenticated. Let's generate the token.
        token_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)  # Token expiration set to 24 hours. Adjust as needed.
        }
        print(token_payload)
        token = pyjwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
        print("Generated token:", token)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Incorrect password!'}), 401


@main.route('/subsubtasks/<int:subsubtask_id>', methods=['DELETE'])
@token_required
def delete_subsubtask(subsubtask_id):
    subsubtask = SubSubTask.query.get(subsubtask_id)
    # Similarly, you might want to add an additional check here to make sure the SubSubTask
    # belongs to the current authenticated user.
    if not subsubtask:
        return jsonify({"error": "SubSubTask not found"}), 404
    db.session.delete(subsubtask)
    db.session.commit()
    return jsonify({"message": "SubSubTask deleted successfully"})

@main.route('/tasks/<int:task_id>', methods=['GET'])
@token_required
def get_task(task_id):
    task = Task.query.filter_by(id=task_id).first()
    print(task.to_dict())
    return jsonify(task.to_dict())

@main.route('/subtasks/<int:subtask_id>', methods=['GET'])
@token_required
def get_subtask(subtask_id):
    subtask = SubTask.query.filter_by(id=subtask_id).first()
    print(subtask)
    print(subtask.to_dict())
    return jsonify(subtask.to_dict())

@main.route('/subsubtasks/<int:subtask_id>', methods=['GET'])
@token_required
def get_subsubtask(subsubtask_id):
    subsubtask = SubTask.query.filter_by(id=subsubtask_id).first()
    print(subsubtask)
    print(subsubtask.to_dict())
    return jsonify(subsubtask.to_dict())