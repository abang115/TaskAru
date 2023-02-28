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
  - Throws an error if the password constraints aren't followed
  - Throws an  error if the password can't be hashed
  - Adds the user if password can be hashed and user doesn't exist yet
  - Stores event information into event objects, stores these objects and calendar information into calendar objects, and stores calendar objects with users

Unit Tests and Cypress Tests for Frontend
---


Unit Tests for Backend
---

  - Unit tests register post handler
    - Successfully regsiters a user when email and password are valid
    - Catches when a user attempts to register with an email that exists in the database
  - Unit tests for sign in handler
    - Successfully signs in a user when email and password are valid
    - Catches when a user attempts to sign in with the correct email, but wrong password
    - Catches when a user attempts to sign in with the wrong email, but right password

Documentation for Backend API
---

