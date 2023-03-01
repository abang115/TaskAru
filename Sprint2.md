Detail Work Completed in Sprint 2
---

Front-End

  - Post requests were added to the sign-in and sign-up components to connect front-end to back-end
  - Created sign-in service to determine whether a user was signed in and used that to determine whether to show the sign-in and sign-up buttons on the navigation bar
  - Made more error handling in sign-in component to address if user tries to sign in with an email not found in the database
  - Added quick link to sign-up page on sign-in page if a user clicks sign-in but doesn't have an account yet
  - Configured cypress and implemented several e2e tests as well as started implementing component tests for the calendar

Back-End

  - MYSQL database was setup and is being hosted on Microsoft Azure
  - Sign-in and Register handler functions were implmented to handle post requests to connect the front-end to the back-end
  - Utilized bcrypt to securely hash passwords and store them in the database
  - Created calendar and event structs to handle events users add to the calendar
  - Stores event information into event objects, stores these objects and calendar information into calendar objects, and stores calendar objects with users

Unit Tests and Cypress Tests for Frontend
---

  - Cypress e2e tests for sign-in
    - Catches when a user tries to press the sign-in buttons if no fields are entered
    - Successfully signs-in a user if their email and password are found in the database
    - Successfully visits sign-up page when sign-up link is clicked  
  - Cypress component tests for sign-in
    - Successfully mounts the sign-in component 
  - Cypress component tests for sign-up
    - Successfully mounts the sign-up component
  - Cypress component tests for calendar

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

