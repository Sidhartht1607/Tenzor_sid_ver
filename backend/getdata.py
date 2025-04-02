from flask import Flask, jsonify, request, session
from flask_session import Session  # Import Session
import os
from data_gemini import generate

app = Flask(__name__)
app.config["SECRET_KEY"] = 'your_secret_key_here'  # Secret key for session management
app.config["SESSION_TYPE"] = 'filesystem'  # Session type to filesystem
app.config["SESSION_FILE_DIR"] = 'path/to/session/files'  # Optional: specify directory
Session(app)  # Initialize session handling

@app.route('/save_post', methods=['POST'])
def save_post():
    content = request.json.get('content', 'No content received')
    session['chat_history'] = []  # Initialize chat history

    response, chat_history = generate(content)
    session['chat_history'] = chat_history  # Save chat history to session

    return jsonify({"status": "success", "message": "Received content", "content": response})

@app.route('/user_query', methods=['POST'])
def user_query():
    query = request.json.get('query', '')
    chat_history = session.get('chat_history', [])  # Retrieve chat history from session
    setup="Give me short precise answers."
    query=query+setup
    response, chat_history = generate(query, chat_history)
    session['chat_history'] = chat_history  # Update chat history in session

    return jsonify({"status": "success", "content": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
