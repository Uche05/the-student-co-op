import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask import Flask, render_template, request
from dotenv import load_dotenv
import os

# 1. Initialize Firebase using environment variables

#.env file
load_dotenv()
cred = credentials.Certificate(os.getenv("FIREBASE_KEY_PATH"))
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

@app.route('/submit-test', methods=['POST'])
def submit_test():
    # Example: Receiving psychometric data from a form
    user_id = "student_01" # In a real app, get this from Firebase Auth
    data = {
        "comm_score": request.form.get("comm"),
        "goal": "Lawyer",
        "awareness_gap": 80 - int(request.form.get("comm"))
    }
    # 2. Save to Firestore joints
    db.collection('students').document(user_id).set(data)
    return "Awareness Profile Created!"