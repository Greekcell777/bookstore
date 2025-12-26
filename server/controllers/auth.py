from flask_jwt_extended import create_access_token, get_jwt_identity, set_access_cookies, unset_access_cookies, jwt_required
from flask import request, make_response, jsonify
import re
from flask_restful import Resource
from server.models import User
from server.config import db

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email:
            return make_response(jsonify({
                'error': 'Input an email to login'
            }), 401)
        
        if not password:
            return make_response(jsonify({
                'error': 'Input an password to login'
            }), 401)
        
        user = User.query.filter_by(email=email).first()

        if not user:
            return make_response(jsonify({
                'error': 'Incorrect email or password'
            }), 401)
        if not user.authenticate(password):
            return make_response(jsonify({
                'error': 'Incorrect email or password'
            }),401)
        
        token = create_access_token(identity=user.id)
        
        response = jsonify({
            'msg': 'Login successful',
            'user': user.to_dict()
        })

        set_access_cookies(response, token)

        return make_response(response, 200)  


    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        return make_response(user, 200)
        

class Logout(Resource):
    @jwt_required()
    def post(self):
        response = jsonify({'msg': 'Successfully logged out'})
        unset_access_cookies()
        return make_response(response, 204)
    
class Register(Resource):
    def post(self):
        data = request.get_json()
        
        # Validation
        required_fields = ['firstName', 'secondName', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return make_response(jsonify({
                    'error': f'{field} is required'
                }), 400)
        
        # Validate email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, data.get('email')):
            return make_response(jsonify({
                'error': 'Invalid email format'
            }), 400)
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data.get('email')).first()
        if existing_user:
            return make_response(jsonify({
                'error': 'Email already registered'
            }), 409)
        
        # Check password strength
        password = data.get('password', '')
        if len(password) < 8:
            return make_response(jsonify({
                'error': 'Password must be at least 8 characters long'
            }), 400)
        
        # Create user
        try:
            user = User(
                firstName=data.get('firstName'),
                secondName=data.get('secondName'),
                email=data.get('email'),
                phone=data.get('phone', '')
            )
            
            user.password_hash = data.get('password')
            
            db.session.add(user)
            db.session.commit()
            
            # Create token for auto-login after registration
            token = create_access_token(identity=user.id)
            response = {
                'message': 'Registration successful',
                'user': user.to_dict(),
                'token': token
            }
            set_access_cookies(response, token)
            return make_response(jsonify(response), 201)
            
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({
                'error': 'Could not create user account',
                'details': str(e)
            }), 500)