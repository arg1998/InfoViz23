# Use the official Python 3 image as the base image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy requirements.txt into the working directory
COPY ./server/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application source code into the working directory
COPY ./server /app/server
COPY ./Data /app/Data
# Expose the port the app will run on
EXPOSE 8085

# Start the server
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8085", "--reload"]

