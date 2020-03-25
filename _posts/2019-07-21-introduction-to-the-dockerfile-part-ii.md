---
layout: post
title: Introduction to the Dockerfile Part II
date: 2019-07-21 05:01:00 +0000
categories: docker dockerfile

---
Create Dockerfile

    vim Dockerfile

Dockerfile content:

    # Use an official Python runtime as a parent image
    FROM python:2.7-slim
    # Set the working directory to /app
    WORKDIR /app
    # Copy the current directory contents into the container at /app
    ADD . /app
    # Install any needed packages specified in requirements.txt
    RUN pip install — trusted-host pypi.python.org -r requirements.txt
    # Make port 80 available to the world outside this container
    EXPOSE 80
    # Define environment variable
    ENV NAME World
    # Run app.py when the container launches
    CMD ["python", "app.py"]

Create requirements.txt file

    Flask
    Redis

Create app.py file

    from flask import Flask
    from redis import Redis, RedisError
    import os
    import socket
    # Connect to Redis
    redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)
    app = Flask(__name__)
    @app.route("/")
    def hello():
     try:
     visits = redis.incr("counter")
     except RedisError:
     visits = "<i>cannot connect to Redis, counter disabled</i>"
    html = "<h3>Hello {name}!</h3>" \
     "<b>Hostname:</b> {hostname}<br/>" \
     "<b>Visits:</b> {visits}"
     return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)
    if __name__ == "__main__":
     app.run(host=’0.0.0.0', port=80)

Build image from Dockerfile

    sudo docker build -t friendlyhello .

See image friendlyhello

    sudo docker image ls

Run image friendlyhello

    sudo docker run -d -p 4000:80 friendlyhello

See container :

    sudo docker container ls

Test app using curl

curl [http://localhost:4000](http://localhost:4000/)

![](/uploads/1_OZ5O_qIclMIEBLfPTscCwQ.png)