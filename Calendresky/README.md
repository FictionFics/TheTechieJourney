# Calendresky

Calendresky is a web-based calendar application that allows users to manage events and appointments. It is built using FullCalendar, Flask (a Python web framework), and Bootstrap for styling. Users can create, edit, and delete events, view today's meetings, and navigate through different calendar views.

## Features

- **Add Events**: Click on a date to open a modal for creating a new event.
- **Edit Events**: Click on an existing event to modify its details such as title, start time, end time, description, and color.
- **Delete Events**: Events can be deleted directly from the modal.
- **Drag and Drop**: Events can be moved around the calendar by dragging and dropping.
- **Resize Events**: Events can be resized to change their duration.
- **View Today's Meetings**: A panel displaying all the meetings scheduled for the current day.

## Setup Instructions

### Prerequisites

To run Calendresky locally, you'll need to have the following software installed:

- Python 3.x
- pip (Python package manager)
- Virtual environment (optional but recommended)

### Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/FictionFics/TheTechieJourney.git
   cd Calendresky
   ```
2. **Install all the modules in your python environment**

    ```bash
   pip install Flask render_template request jsonify SQLAlchemy datetime
   python app.py
   ```
