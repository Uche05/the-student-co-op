import os

import firebase_admin
import google.genai as genai
from dotenv import load_dotenv
from firebase_admin import auth, credentials, firestore
from flask import Flask, jsonify, render_template, request, session
from functools import wraps
from flask import flash, redirect, url_for
from google import genai # Note: the import is different now!


# 1. Initialize Firebase using environment variables

#.env file
load_dotenv()
cred = credentials.Certificate(os.getenv("FIREBASE_KEY_PATH"))
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET")


# the following create a decorator to ensure that the user is logged in
# # it was created by Google Gemini



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


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            id_token = data.get('token')
            
            # 1. Verify token with Firebase Admin
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid'] # This is the unique string we need
            email = decoded_token.get('email')
            
            # 2. DATABASE KEY STEP:
            # Initialize the user document in Firestore using their UID
            user_ref = db.collection('users').document(uid)
            
            # Check if user exists, if not, create basic profile
            if not user_ref.get().exists:
                user_ref.set({
                    'email': email,
                    'test_completed': False,
                    'created_at': firestore.SERVER_TIMESTAMP,
                    # Initialize scores at 0 so the Dashboard doesn't crash
                    'scores': {
                        'communication': 0,
                        'ei': 0,
                        'problem_solving': 0,
                        'leadership': 0,
                        'resilience': 0
                    }
                })
            
            # 3. Set the Flask session
            session['user_id'] = uid
            
            return jsonify({"status": "success", "message": "Logged in"}), 200
            
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 401

@app.route('/career')
#@login_required
def onboarding():
    return render_template('onboarding.html')

@app.route('/submit-onboarding', methods=['POST'])
def submit_onboarding():
    uid = session.get('user_id')
    if not uid:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    
    # Update the existing user document
    db.collection('users').document(uid).update({
        'next_step': data['nextStep'],
        'target_career': data['career']
    })
    
    return jsonify({"status": "success"}), 200

@app.route('/quiz')
#@login_required
def quiz():
    return render_template('test.html')

@app.route('/dashboard')
def dashboard():
    uid = session.get('user_id')
    if not uid:
        return redirect('/login')

    # Fetch user data from Firestore
    user_doc = db.collection('users').document(uid).get()
    
    if not user_doc.exists:
        return redirect('/onboarding')
    
    user_data = user_doc.to_dict()

    # If they haven't taken the test, send them to the test page
    if not user_data.get('test_completed'):
        return redirect('/quiz')

    # Define Benchmarks based on their career choice
    # You can expand this dictionary for more careers!
    benchmarks = {
        'Law': [9, 7, 7, 8, 8], # Comm, EI, Prob, Lead, Res
        'Software Engineering': [6, 5, 10, 5, 7],
        'Marketing': [9, 8, 6, 7, 6],
        'Finance': [7, 6, 9, 7, 8]
    }
    
    career = user_data.get('target_career', 'Law')
    current_benchmark = benchmarks.get(career, [7, 7, 7, 7, 7])

    return render_template('dashboard.html',
                        user=user_data,
                        benchmark=current_benchmark)

@app.route('/submit-test', methods=['POST'])
def submit_test():
    uid = session.get('user_id')
    data = request.json # This is the 'answers' object from JS
    
    # Logic: Calculate average for each category and scale to 10
    final_scores = {}
    total_sum = 0
    
    for category, values in data.items():
        # Average of 1-5 scale, then multiply by 2 for a 10-point scale
        avg = sum(values) / len(values)
        final_scores[category] = round(avg * 2, 1)
        total_sum += final_scores[category]
    
    # Overall awareness percentage
    overall_awareness = round((total_sum / 50) * 100)

    # Save to Firestore
    db.collection('users').document(uid).update({
        'scores': final_scores,
        'awareness_score': overall_awareness,
        'test_completed': True
    })

    return jsonify({"status": "success"}), 200

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


# Use the exact string from your list (minus the 'models/' prefix usually works)
model="gemini-2.5-flash-lite"

# 1. Initialize the Client (Replacing genai.configure)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.route('/comm-builder', methods=['GET', 'POST'])
def comm_builder():
    # 1. Handle the page load first (GET request)
    if request.method == 'GET':
        return render_template('comm_builder.html')

    # 2. Handle the AI Chat (POST request)
    # We only try to get JSON if the method is POST
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"reply": "I didn't receive any text. Try typing again!"}), 400
            
        user_input = data.get('message')
        if not user_input:
            return jsonify({"reply": "The message was empty."}), 400
            
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        return jsonify({"reply": "Technical glitch reading your message."}), 400

    # 3. Context gathering (User & Career)
    uid = session.get('user_id')
    career = "Professional" # Fallback
    
    if uid:
        try:
            user_doc = db.collection('users').document(uid).get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                career = user_data.get('target_career', 'Professional')
        except Exception as e:
            print(f"Firestore error: {e}")

    # 4. Gemini AI Call (2.0 SDK Syntax)
    try:
        # Using flash-lite for better quota stability
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite", 
            contents=user_input,
            config={
                "system_instruction": f"""
                You are the '10x Comm-Coach' for a student pursuing a career in {career}.
                Respond to their practice message in character as a mentor.
                Then, provide a 'Skill Check' with:
                - Clarity Score: X/10
                - Tone: [Analysis]
                - One '10x Tip' specific to {career}.
                """
            }
        )
        return jsonify({"reply": response.text})
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        return jsonify({"reply": "Coach is stuck in a meeting. Try again!"}), 500