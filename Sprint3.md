GitHub Repository
---
[TaskAru](https://github.com/abang115/CEN3031)

Video Presentation
---
[Demo Video]()

Detail Work Completed in Sprint 3
---
Front-End

  - Implemented a light and dark mode toggle for the website
  - Updated website styling as a whole
  - Added ability to sign out when user is signed in
  - Created components to allow for users to reset their password when needed
  - Added abilty to save events to an account
  - Added ability to edit and remove events
  - Allows events to be retrived upon refresh or signing in 

Back-End

  - Added the events table to the database using the automigrate in dbsetup.go to save data about each events
  - ForgetPasswordPost, ResetPasswordPatch, EventPost, EditEventPatch, ReceiveEventGet, and RemoveEventDelete handler functions were implmented to handle requests to connect the front-end to the back-end
  - Configured and implemented unit tests for event functions and forget/reset password functions

Frontend Unit Tests
---
 - Cypress e2e tests for sign-in
   - Catches when a user attempts to press the sign-in button if no fields are entered
   - Successfully tests whether it visits sign-up page when sign-up link is clicked  
   - Successfully tests whether it visits forgot-password page when forgot-password link is clicked
   - Successfully tests whether it signs-in a user if their email and password are found in the database
   - Succesfully tests whether after a user signs-in, that they can sign-out
 - Cypress e2e tests for sign-up
   - Catches when a user attempts to press the sign-up button if no fields are entered
   - Successfully tests whether it registers a user if their email is not found in the database
   - Catches when a user attempts to register, but have non-matching passwords
 - Cypress e2e tests for forgot-password
   - Successfully tests whether a user enters a valid email and sends an email to that email with the reset password link
   - Catches when a user tries to submit an email that doesn't exist in the database
   - Catches when a user tries to submit without entering a valid email
 - Cypress e2e tests for reset-password
   -  Successfully tests whether a user is able to reset their password and sign in using that new password
   -  Catches when a attempts to submit the form, but have non-matching passwords
 - Cypress component tests for sign-in
   - Successfully tests whether it mounts the sign-in component 
 - Cypress component tests for sign-up
   - Successfully tests whether it mounts the sign-up component
 - Cypress component tests for forgot-password
   - Successfully tests whether it mounts the forgot-password component
 - Cypress component tests for reset-password
   - Successfully tests whether it mounts the reset-password component
 - Cypress component tests for calendar
   - Successfully tests whether it mounts the calendar component
   - Successfully tests opening the add event modal 
   - Successfully tests filling out the event from, submitting, and creating a new event
   - Successfully tests opening an existing event modal
   - Tests opening the edit event modal
   - Tests changing an exisiting event
   - Tests removing an exisitng event

Backend Unit Tests
---

  - Unit tests for RegisterPostHandler()
    - Successfully registers a user when email and password are valid
    - Catches when a user attempts to register with an email that exists in the database
  - Unit tests for SignInPostHandler()
    - Successfully signs in a user when email and password are valid
    - Catches when a user attempts to sign in with the correct email, but wrong password
    - Catches when a user attempts to sign in with the wrong email, but right password
  - Unit tests for ForgotPasswordPostHandler()
    - Successfully sends an email to the user with a reset password link when the user enters a valid email 
    - Catches if email was not found in the database or if the token generated was not unique
  - Unit tests for ResetPasswordPatchHandler()
    - Successfully encrypts and saves the newly generated password to the database
    - Catches if the password was not able to properly be encrypted
  - Unit tests for EventPostHandler()
    - Successfully creates an event in the desired calendar using a email, title, description, date, start time, end time, frequency, date start for reoccuring events, date end for reoccuring events, and background color
    - Catches if the event was not created properly
  - Unit tests for EditEventPatchHandler()
    - Successfully edits an event in the desired calendar using a email, title, description, date, start time, end time, frequency, date start for reoccuring events, date end for reoccuring events, and background color
    - Catches if the event was not updated properly
  - Unit tests for ReceiveEventGetHandler()
    - Successfully sends events to the front end
    - Catches if the correct event data was sent
  - Unit tests for RemoveEventDeleteHandler()
    - Successfully deletes an event in the desired calendar using a email, title, description, date, start time, end time, frequency, date start for reoccuring events, date end for reoccuring events, and background color
    - Catches if the delete function was called
    - Catches if the event was not deleted properly

Updated Documentation for Backend API
---

User Authentication Routes

URL: <code>/api/register</code>
  - Integrated RegisterPostHandler() function which is a <code>POST</code> request. This function allows the backend team to create new users on TaskAru and stores their first name, last name, email address, and password in the database. The function uses an empty User struct and stores the user's information into the database after hashing the password and checking if the email exists in the database already. If no error was found, then it sets the HTTP status code to 200 (OK). If the email was already found in the database, then it sets the HTTP status code to 409 (Conflict). If the password could not be hashed, then it sets the HTTP status code to 404 (Not Found).

URL: <code>/api/signin</code>
  - Integrated SignInPostHandler() function which is a <code>POST</code> request. This function allows the user to sign in to their account utlizing the information they registered with. When the user enters their email address and password the function checks whether they match and exist in the database. If the email address or password don't match, it will notify the user that either the email address or password is incorrect. If no error was found, then it sets the HTTP status code to 200 (OK). If the email was not found in the database, then it sets the HTTP status code to 404 (Not Found). If the password entered does not match the password associated with the entered email, then it sets the HTTP status code to 401 (Unauthorized).

URL: <code>/api/forgotpassword</code>
  - Integrated ForgotPasswordPostHandler() function which is a <code>POST</code> request. This function saves an email and token to the forget password table and sends an email with a token and an unique link to a form. This will allow the user to reset their password using the ResetPasswordPatchHandler() function.

URL: <code>/api/resetpassword</code>
  - Integrated ResetPasswordPatchHandler() function which is a <code>PATCH</code> request. This function saves a password and searches for the last token associated with that email in the database and if found, encrypts the new password and updates it in the database.

URL: <code>/api/event</code>
  - Integrated EventPostHandler() function which is a <code>POST</code> request. This function allows the user to create an event in their desired calendar by entering in a email, title, description, date, start time, end time, frequency, date start for reoccuring events, date end for reoccuring events, and background color.

URL: <code>/api/event</code>
  - Integrated EditEventPatchHandler() function which is a <code>PATCH</code> request. The function allows the user to edit any feature of the event in their calendar which includes the email, title, description, date, start time, end time, frequency, date start for reoccuring events, date end for reoccuring events, and background color.

URL: <code>/api/event</code>
  - Integrated ReceiveEventGetHandler() function which is a <code>GET</code> request. The function allows front end to receive events from the database based on the user logged in.

URL: <code>/api/event</code>
  - Integrated RemoveEventDeleteHandler() function which is a <code>DELETE</code> request. The function allows the user to indicate that want to delete an event in their desired calendar.
