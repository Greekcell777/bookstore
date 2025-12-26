from server.controllers.auth import Login, Logout, Register

def addResource(api):
    api.add_resource(Login, "/api/login")
    api.add_resource(Logout, "/api/logout")
    api.add_resource(Register, "/api/register")