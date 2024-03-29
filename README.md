# TaskAru

TaskAru is a scheduling/tasking application designed to allow its users to plan out and keep track of how they spend their days, weeks, and even months. TaskAru users will be able to mark, log, and differentiate important events in a calendar and will receive notifications when those events are near. Along with this, users can share their schedules with other users and view whether they have overlaps or if they are both free to coordinate an event. 



Front-End Engineers: 
---

Alvin Bang and Eric Wang

Back-End Engineers: 
---

Aaron Song and Amanda Yu

Instructions
---
The front-end is located in the Client folder and the back-end is located in the TaskAru folder. 
1. Clone the repo into the directory of your choice
2. Install [Node.js](https://nodejs.org/en/), [Go](https://go.dev/), and the [Angular CLI](https://angular.io/cli)
3. Navigate to the **Client** folder and run ```npm install``` to install all dependencies
4. Then in the **TaskAru** folder, create a ```.env file```, replacing the values with the desired cloud hosting service for the MySQL database(AWS, Azure, etc.) and Email service(MailTrap, PostMark, etc.) used in the website as well as a JWT key
```
USER=example
PASSWORD=examplepassword
HOST=examplehost
DBNAME=exampledb

EMAIL_FROM=example@example.com
SMTP_HOST=examplehost
SMTP_USER=exampleuser
SMTP_PASS=examplepass

JWT_KEY=super_secret_key
```
5. Then navigate to the **Client** folder and run ```npm start``` to run the app
7. The website can then be accessed at http://localhost:4200/ and the back-end can be reached at http://localhost:8080/ 
8. (Optional) Testing can be done in the front-end with e2e and component tests using cypress via  ```npx cypress open``` and can be done in the back-end through the ```server_test.go``` file via ```go run server_test.go```
