# Use the official Python image as the base image
FROM python:3.8-slim

# Set the working directory
WORKDIR /backend

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required Python packages
RUN pip install -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Define una variable de entorno
ENV SECRET_KEY=mysecretkey
ENV JWT_KEY=mysecretkey
# Expose the port that your Flask app listens on
EXPOSE 8080

# Start the Flask app
CMD ["python", "index.py"]