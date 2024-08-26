from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__, static_folder='static')

# Define the base directory and ensure instance directory exists
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'instance', 'appointments.db')
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Configuration for the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Model to store appointments
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    start = db.Column(db.DateTime, nullable=False)
    end = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.Text, nullable=True)
    recurrence_pattern = db.Column(db.String(50), nullable=True)  
    recurrence_end = db.Column(db.DateTime, nullable=True) 
    color = db.Column(db.String(7), default='#ff9f89')  # Store color as a string

# Create the database
with app.app_context():
    try:
        db.create_all()
        print("Database created successfully.")
    except Exception as e:
        print(f"Failed to create database: {e}")

# Home page route
@app.route('/')
def index():
    return render_template('index.html')

# Route to fetch all appointments
@app.route('/appointments')
def get_appointments():
    appointments = Appointment.query.all()
    appointments_list = [{
        "id": appointment.id,
        "title": appointment.title,
        "start": appointment.start.isoformat(),
        "end": appointment.end.isoformat(),
        "description": appointment.description,
        "recurrence_pattern": appointment.recurrence_pattern,
        "recurrence_end": appointment.recurrence_end,
        "color": appointment.color  # Include color in response
    } for appointment in appointments]
    return jsonify(appointments_list)

# Route to create a new appointment
@app.route('/appointments', methods=['POST'])
def add_appointment():
    data = request.get_json()
    title = data.get('title')
    start = datetime.fromisoformat(data.get('start'))
    end = datetime.fromisoformat(data.get('end'))
    description = data.get('description')
    recurrence_pattern = data.get('recurrence_pattern')
    recurrence_end = datetime.fromisoformat(data.get('recurrence_end')) if data.get('recurrence_end') else None
    color = data.get('color', '#ff9f89')  # Default color

    new_appointment = Appointment(
        title=title, start=start, end=end, description=description,
        recurrence_pattern=recurrence_pattern, recurrence_end=recurrence_end, color=color
    )
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({"message": "Appointment booked successfully"}), 201

@app.route('/appointments/<int:id>', methods=['PUT'])
def update_appointment(id):
    data = request.get_json()
    appointment = Appointment.query.get_or_404(id)
    
    appointment.title = data.get('title')
    appointment.start = datetime.fromisoformat(data.get('start'))
    appointment.end = datetime.fromisoformat(data.get('end'))
    appointment.description = data.get('description')
    appointment.recurrence_pattern = data.get('recurrence_pattern')
    appointment.recurrence_end = datetime.fromisoformat(data.get('recurrence_end')) if data.get('recurrence_end') else None
    appointment.color = data.get('color', appointment.color)  # Update color

    db.session.commit()

    return jsonify({"message": "Appointment updated successfully"}), 200

@app.route('/appointments/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    db.session.delete(appointment)
    db.session.commit()

    return jsonify({"message": "Appointment deleted successfully"}), 200

@app.route('/appointments/today', methods=['GET'])
def get_todays_appointments():
    today = datetime.today().date()
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())

    appointments = Appointment.query.filter(
        Appointment.start >= start_of_day,
        Appointment.end <= end_of_day
    ).all()

    appointments_list = [{
        "id": appointment.id,
        "title": appointment.title,
        "start": appointment.start.isoformat(),
        "end": appointment.end.isoformat(),
        "description": appointment.description,
        "color": appointment.color  # Include color in response
    } for appointment in appointments]

    return jsonify(appointments_list)

if __name__ == '__main__':
    app.run(debug=True)
