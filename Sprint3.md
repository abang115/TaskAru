GitHub Repository
---
[TaskAru](https://github.com/abang115/CEN3031)

Video Presentation
---
[Demo Video]()

Detail Work Completed in Sprint 3
---
 - 

Frontend Unit Tests
---
 - 

Backend Unit Tests
---

  - Unit tests for RegisterPostHandler()
    - Successfully registers a user when email and password are valid
    - Catches when a user attempts to register with an email that exists in the database
  - Unit tests for SignInPostHandler()
    - Successfully signs in a user when email and password are valid
    - Catches when a user attempts to sign in with the correct email, but wrong password
    - Catches when a user attempts to sign in with the wrong email, but right password
  - Unit tests for TestEventPutHandler()
    - 
  - Unit tests for EditEventPostHandler()
    - 

Updated Documentation for Backend API
---

User Authentication Routes

URL: <code>/api/register</code>
  - Integrated RegisterPostHandler() function which is a <code>POST</code> request. This function allows the backend team to create new users on TaskAru and stores their first name, last name, email address, and password in the database. The function uses an empty User struct and stores the user's information into the database after hashing the password and checking if the email exists in the database already. If no error was found, then it sets the HTTP status code to 200 (OK). If the email was already found in the database, then it sets the HTTP status code to 409 (Conflict). If the password could not be hashed, then it sets the HTTP status code to 404 (Not Found).

URL: <code>/api/signin</code>
  - Integrated SignInPostHandler() function which is a <code>POST</code> request. This function allows the user to sign in to their account utlizing the information they registered with. When the user enters their email address and password the function checks whether they match and exist in the database. If the email address or password don't match, it will notify the user that either the email address or password is incorrect. If no error was found, then it sets the HTTP status code to 200 (OK). If the email was not found in the database, then it sets the HTTP status code to 404 (Not Found). If the password entered does not match the password associated with the entered email, then it sets the HTTP status code to 401 (Unauthorized).

URL: 
  - Integrated ForgotPasswordPutHandler() function which is a <code>PUT</code> request. This function allows the user to press a button to indicate that they have forgotten their password that they registered with and will be able to reset it using the email address they registered with.

URL: 
  - Integrated EventPostHandler() function which is a <code>PUT</code> request. This function allows the user to create an event in their desired calendar by entering in a title, description, date, start time, and end time.

URL: 
  - Integrated EditEventPutHandler() function which is a <code>PUT</code> request. The function allows the user to edit any feature of the event in their calendar which includes the title, description, date, start time, and end time.
