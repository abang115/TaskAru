GitHub Repository
---
[TaskAru](https://github.com/abang115/CEN3031)

Video Presentation
---
[Demo Video](https://youtu.be/imHiLSYAW0M)

Detail Work Completed in Sprint 2
---

Front-End

  - Post requests were added to the sign-in and sign-up components to connect front-end to back-end
  - Created sign-in service to determine whether a user was signed in and used that to determine whether to show the sign-in and sign-up buttons on the navigation bar
  - Made more error handling in sign-in component to address if user tries to sign in with an email not found in the database
  - Added quick link to sign-up page on sign-in page if a user clicks sign-in, but doesn't have an account yet
  - Configured cypress and implemented several e2e tests as well as started implementing component tests for the calendar

Back-End

  - MYSQL database was setup and is being hosted on Microsoft Azure
  - Sign-in and Register handler functions were implmented to handle post requests to connect the front-end to the back-end
  - Utilized bcrypt to securely hash passwords and store them in the database
  - Created calendar and event structs to handle events users add to the calendar
  - Started storing event information into event objects, stores these objects and calendar information into calendar objects, and store calendar objects with users using nested structs

Unit (Cypress Component) Tests and Cypress E2E Tests for Frontend
---

  - Cypress e2e tests for sign-in
    - Catches when a user attempts to press the sign-in button if no fields are entered
    - Successfully tests whether it signs-in a user if their email and password are found in the database
    - Successfully tests whether it visits sign-up page when sign-up link is clicked  
  -Cypress e2e tests for sign-up
    - Catches when a user attempts to press the sign-up button if no fields are entered
    - Successfully tests whether it registers a user if their email is not found in the database
    - Catches when a user attempts to register, but have non-matching passwords
  - Cypress component tests for sign-in
    - Successfully tests whether it mounts the sign-in component 
  - Cypress component tests for sign-up
    - Successfully tests whether it mounts the sign-up component
  - Cypress component tests for calendar
    - Successfully tests whether it mounts the calendar component
    - Successfully tests opening the add event modal 
    - Successfully tests filling out the event from, submitting, and creating a new event
    - Successfully tests opening an existing event modal

Unit Tests for Backend
---

  - Unit tests for RegisterPostHandler()
    - Successfully registers a user when email and password are valid
    - Catches when a user attempts to register with an email that exists in the database
  - Unit tests for SignInPostHandler()
    - Successfully signs in a user when email and password are valid
    - Catches when a user attempts to sign in with the correct email, but wrong password
    - Catches when a user attempts to sign in with the wrong email, but right password

Documentation for Backend API
---

User Authentication Routes

URL: <code>/api/register</code>
  - Integrated RegisterPostHandler() function which is a <code>POST</code> request. This function allows the backend team to create new users on TaskAru and stores their first name, last name, email address, and password in the database. The function uses an empty User struct and stores the user's information into the database after hashing the password and checking if the email exists in the database already. If no error was found, then it sets the HTTP status code to 200 (OK). If the email was already found in the database, then it sets the HTTP status code to 409 (Conflict). If the password could not be hashed, then it sets the HTTP status code to 404 (Not Found).

URL: <code>/api/signin</code>
  - Integrated SignInPostHandler() function which is a <code>POST</code> request. This function allows the user to sign in to their account utlizing the information they registered with. When the user enters their email address and password the function checks whether they match and exist in the database. If the email address or password don't match, it will notify the user that either the email address or password is incorrect. If no error was found, then it sets the HTTP status code to 200 (OK). If the email was not found in the database, then it sets the HTTP status code to 404 (Not Found). If the password entered does not match the password associated with the entered email, then it sets the HTTP status code to 401 (Unauthorized).
