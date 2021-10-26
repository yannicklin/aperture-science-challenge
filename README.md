# aperture-science-challenge

1. ```docker-compose up -d --build```
2. ``` docker exec laravel php artisan migrate```
3. ``` docker exec laravel php artisan db:seed --class=SubjectSeeder ```


# Software Engineer

Graduate:
Admin can login to front end and see a list of subjects (expect candidate to perform a graphQL request and output a list)

SEI:
+ above
Add a new data model related to subjects - testing data

SEII:
+ above
Build to list subject data and request all their associated testing data
Request subject list on the server side

Senior:
+ above
Allow subjects to login to the system, only allow them to see their own data.
Implement a password reset


UX Design Engineer (another branch?, totally different tech test):
Build a paginated and filterable list in the front end.

Things to add:
Use dynamic details in login form
Fix 419 response
Fix login fail/validation
Tests, to everything
Interface
Logout function