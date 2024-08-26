document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: '/appointments',
        editable: true,  // Enable drag and drop
        droppable: true, // Enable external dragging
        eventResizableFromStart: true, // Allow resizing from start
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        dateClick: function (info) {
            clearForm();
            $('#bookingModal').modal('show');

            const clickedDate = new Date(info.dateStr);
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;
            const localTime = new Date(now.getTime() - offset);

            clickedDate.setHours(localTime.getHours());
            clickedDate.setMinutes(localTime.getMinutes());

            const startTime = clickedDate.toISOString().slice(0, 16);
            const endDate = new Date(clickedDate.getTime() + 30 * 60000);
            const endTime = endDate.toISOString().slice(0, 16);

            document.getElementById('start').value = startTime;
            document.getElementById('end').value = endTime;
        },
        eventClick: function (info) {
            clearForm();
            var appointment = info.event.extendedProps;

            document.getElementById('appointmentId').value = info.event.id;
            document.getElementById('title').value = info.event.title || appointment.title;

            const options = { timeZone: 'Europe/Berlin', hour12: false };

            if (info.event.start) {
                const start = new Date(info.event.start.getTime());
                document.getElementById('start').value = new Intl.DateTimeFormat('sv-SE', { ...options, hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(start).replace(' ', 'T');
            }
            if (info.event.end) {
                const end = new Date(info.event.end.getTime());
                document.getElementById('end').value = new Intl.DateTimeFormat('sv-SE', { ...options, hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' }).format(end).replace(' ', 'T');
            }

            document.getElementById('description').value = appointment.description || '';
            document.getElementById('eventColor').value = appointment.color || '#3788d8'; // Set the color picker value
            $('#deleteButton').show();
            $('#bookingModal').modal('show');
        },
        eventDrop: function(info) {
            updateEvent(info.event);  // Update the event when dragged
        },
        eventResize: function(info) {
            updateEvent(info.event);  // Update the event when resized
        },
        eventDidMount: function(info) {
            // Apply custom styles to the event
            const eventElement = info.el;

            // Set a very light gray background color
            eventElement.style.backgroundColor = '#f5f5f5';
            // Apply border with the color of the event
            eventElement.style.border = `2px solid ${info.event.extendedProps.color || '#3788d8'}`;
            eventElement.style.color = '#000'; // Set text color to black
            eventElement.style.padding = '2px 5px'; // Optional padding
        }
    });
    calendar.render();

    // Function to update today's meetings panel
    function updateTodaysMeetings() {
        fetch('/appointments')
            .then(response => response.json())
            .then(appointments => {
                const today = new Date().toISOString().split('T')[0];
                const todayMeetings = appointments.filter(appointment =>
                    appointment.start.startsWith(today) ||
                    appointment.end.startsWith(today)
                );
                const list = document.getElementById('todayMeetingsList');
                list.innerHTML = '';
                todayMeetings.forEach(meeting => {
                    const listItem = document.createElement('li');
                    const startTime = new Date(meeting.start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                    const endTime = new Date(meeting.end).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                    listItem.textContent = `${meeting.title} - ${startTime} to ${endTime}`;
                    list.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching appointments:', error));
    }

    // Initial load of today's meetings
    updateTodaysMeetings();

    // Validate end time on change
    document.getElementById('end').addEventListener('change', function () {
        validateDateTime();
    });

    // Validate start time on change
    document.getElementById('start').addEventListener('change', function () {
        validateDateTime();
    });

    document.getElementById('bookingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Validate date and time
        if (!validateDateTime()) {
            $('#validationErrorModal').modal('show'); // Show validation error modal
            return; // Stop form submission if validation fails
        }

        const id = document.getElementById('appointmentId').value;
        const url = id ? `/appointments/${id}` : '/appointments';
        const method = id ? 'PUT' : 'POST';
        const title = document.getElementById('title').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        const description = document.getElementById('description').value;
        const color = document.getElementById('eventColor').value; // Get the selected color

        const appointment = {
            title,
            start,
            end,
            description,
            color // Include color in the event data
        };

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        })
        .then(response => response.json())
        .then(data => {
            $('#bookingModal').modal('hide');
            calendar.refetchEvents();
            updateTodaysMeetings(); // Refresh today's meetings panel
        })
        .catch(error => console.error('Error saving appointment:', error));
    });
    
    // Store the appointment ID to delete
    let appointmentIdToDelete = null;

    document.getElementById('deleteButton').addEventListener('click', function () {
        appointmentIdToDelete = document.getElementById('appointmentId').value;
        $('#deleteConfirmationModal').modal('show'); // Show delete confirmation modal
    });

    document.getElementById('deleteConfirmButton').addEventListener('click', function () {
        if (appointmentIdToDelete) {
            fetch(`/appointments/${appointmentIdToDelete}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    $('#deleteConfirmationModal').modal('hide');
                    $('#bookingModal').modal('hide'); // Close the booking modal
                    calendar.refetchEvents(); // Refresh events after delete
                    updateTodaysMeetings(); // Refresh today's meetings panel
                } else {
                    console.error('Error deleting appointment:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting appointment:', error));
        }
    });

    function updateEvent(event) {
        const id = event.id;
        const title = event.title;
        const start = event.start.toISOString();
        const end = event.end ? event.end.toISOString() : start;  // Use start if end is undefined
        const color = event.extendedProps.color || '#3788d8'; // Default color if not specified

        const updatedEvent = {
            title,
            start,
            end,
            color // Include color in the update
        };

        fetch(`/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEvent)
        })
        .then(response => response.json())
        .then(data => {
            calendar.refetchEvents();  // Refresh events after update
            updateTodaysMeetings(); // Refresh today's meetings panel
        })
        .catch(error => console.error('Error updating appointment:', error));
    }

    function clearForm() {
        document.getElementById('appointmentId').value = '';
        document.getElementById('title').value = '';
        document.getElementById('start').value = '';
        document.getElementById('end').value = '';
        document.getElementById('description').value = '';
        document.getElementById('eventColor').value = '#3788d8'; // Reset color to default
        $('#deleteButton').hide();
    }

    function validateDateTime() {
        const start = new Date(document.getElementById('start').value);
        const end = new Date(document.getElementById('end').value);
        return start < end;
    }

    // Function to create color swatch options
    function createColorSwatches() {
        const colorOptions = [
            '#c62828',  // Darker Red
            '#ad1457',  // Darker Pink
            '#fbc02d',  // Darker Yellow
            '#f57f17',  // Darker Orange
            '#f9a825',  // Darker Gold
            '#ec407a',  // Darker Light Pink
            '#2196f3',  // Darker Light Blue
            '#004d40',  // Darker Mint Green
            '#00796b',  // Darker Teal
            '#757575'   // Darker Gray
        ];        
        const colorContainer = document.getElementById('colorContainer');

        colorOptions.forEach(color => {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = color;
            colorSwatch.style.width = '24px';
            colorSwatch.style.height = '24px';
            colorSwatch.style.borderRadius = '4px';
            colorSwatch.style.cursor = 'pointer';
            colorSwatch.addEventListener('click', function() {
                document.getElementById('eventColor').value = color;
            });
            colorContainer.appendChild(colorSwatch);
        });
    }

    // Create color swatches on page load
    createColorSwatches();
});
