from flask_jwt_extended import create_access_token, get_jwt_identity, set_access_cookies, unset_access_cookies, jwt_required
from flask import request, make_response, jsonify
from flask_restful import Resource
from server.models import User
from server.config import db

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username:
            return make_response(jsonify({
                'error': 'Input an email to login'
            }), 401)
        
        if not password:
            return make_response(jsonify({
                'error': 'Input an password to login'
            }), 401)
        
        user = User.query.filter_by(username=username).first()

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
        
        try:
            user= User(
                firstName=data.get('firstName'),
                lastName=data.get('lastName'),
                email=data.get('email'),
                phone=data.get('phone')
            )

            user.password = data.get('password')

            db.session.add(user)
            db.session.commit()
        
        except:
            return make_response({'error': 'Could not create user account.'})

        return make_response(user.to_dict(), 201)
        