# Use the official Python image as the base image
FROM python:3.8-slim

# Set the working directory
WORKDIR /user_management_2

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required Python packages
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port that your Flask app listens on
EXPOSE 5000

# Start the Flask app
CMD ["flask", "--app", "index", "run", "--host=0.0.0.0", "--port=5000"]
