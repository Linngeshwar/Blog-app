# Blog App

Simple application to post blogs inspired by a Specific app with a red theme 
  
## Steps for installation

Clone the backend and frontend repositories

### Frontend
1) Ensure that npm is installed
2) Execute the following command terminal at the location where you cloned frontend
```
  npm install
```
3) Run npm run dev to start the server
```
npm run dev
```

### Backend

1) Ensure postgres is installed
2) Make sure python is also installed
3) On your backend directory run the following commands
```
py -m venv env
env\scripts\activate
pip install -r requirements.txt
cd blog_backend
py manage.py makemigrations
py manage.py migrate
py manage.py runserver
```
