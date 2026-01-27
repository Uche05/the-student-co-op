import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import auth, credentials, firestore
from flask import Flask, render_template, request

# 1. Initialize Firebase using environment variables

#.env file
load_dotenv()
cred = credentials.Certificate(os.getenv("FIREBASE_KEY_PATH"))
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)


# the following create a decorator to ensure that the user is logged in
# # it was created by Google Gemini
from functools import wraps

from flask import flash, redirect, session, url_for


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if 'user_id' exists in the session
        if 'user_id' not in session:
            flash("Please log in first!")
            return redirect(url_for('login.html'))
        return f(*args, **kwargs)
    return decorated_function


# the following
@app.route('/')
def home():
    # Flask looks for 'templates/index.html' automatically
    return render_template('index.html')


@app.route('/login')
#@login_required
def login_page():
    return render_template('login.html')

@app.route('/career')
#@login_required
def onboarding():
    return render_template('onboarding.html')

@app.route('/quiz')
#@login_required
def quiz():
    return render_template('test.html')

@app.route('/dashboard')
#@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/submit_quiz', methods=['POST'])
#@login_required
def submit_quiz():
    # Process the submitted quiz data
    answers = request.form.to_dict()
    # Here you can add logic to store answers in Firestore or process them
    return "Quiz submitted successfully!"

@app.route('/profile/<user_id>')
#@login_required
def profile(user_id):
    # Fetch user profile from Firestore
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    if user_doc.exists:
        user_data = user_doc.to_dict()
        return render_template('profile.html', user=user_data)
    else:
        return "User not found", 404
