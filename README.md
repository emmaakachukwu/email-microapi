## A Dockerized Micro-service for sending Email Notifications by Team-microapi in conjuction with what team fierce did 

![alt text](https://res.cloudinary.com/echefulouis/image/upload/v1591716347/Capture_p1txz0.png)

# Description:
This is an Email micro-service that sends emails using Swagger UI template and an API. It was built to avoid development teams having to configure mail over and over on projects involving a micro-services infrastructure.

It was built using [Node](https://node.org/)  and [Django-Rest Framework](https://www.django-rest-framework.org/) and a Docker file was included for easy development. 
Documentation is managed by Swagger with the drf-yasg module.



# Features:
- Sending Email
- Sending Email with Template


# Requirements Using Node:
This Project requires the following Versions:
> Node (v12 upward) 

> Npm (v6 upward)


# Requirements Using Django:
This Project requires the following Versions:
> Python (3.5, 3.6, 3.7, 3.8) 

> Django (1.11, 2.0, 2.1, 2.2, 3.0)

# Installation Using Node:
To install all dependencies in this project, open your terminal and run:
```
npm install
```
# Then 

```
npm start
```
Using Post-Man Or Any Other Supported Application, send a post request to
/v1/user/register e.g http://localhost:3000/v1/user/register
include email, name, organistion in the body of the request message. e.g
{"name":"micheal", "email": "olawalejuwon@gmail.com", "organisation":"HNG"} 



# Installation Using Django:
To install all dependencies in this project and to run locally , open your terminal and run:
```
pip install -r requirements.txt

Pipenv install 
Pipenv shell
Python manage.py runserver 
```

#components:
1. [Swagger UI template] (https://swagger.io/tools/swagger-ui/)

2. [Docker-Compose file] (https://docs.docker.com/compose/) : was used to deploy, combine and configure multiple docker-container

3. [Sengrid SMTP] (https://sendgrid.com/docs/for-developers/sending-email/)

# Contributing:
Contributions are welcome and will be fully credited.

We accept contributions via Pull Requests on Github

# Credits:
HNGi7 team-fierce backend..would be working with team microapi 
