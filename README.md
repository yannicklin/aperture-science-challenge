# Software Engineer Candidate technical challenge

In this repository you will find a simple application that produces a React UI which communicates via GraphQL to a Laravel service and Postgres database.  The application will serve two pages, a login page and a subjects list.  The application stack also includes unit and e2e tests.

For this challenge, you will require docker and docker-compose available in your working environment.  This application also makes use of the docker-provided internal hostname.

---

## Launching development environment

![Application infrastructure](./infrastructure.png)

Fork this repository and clone it into your working environment of choice.

Once available, run the following commands from the root directory:
1. ``` docker-compose up -d --build ```
2. ``` docker exec laravel php artisan migrate ```
3. ``` docker exec laravel php artisan db:seed --class=DatabaseSeeder ```
4. ``` docker exec laravel php artisan db:seed --class=SubjectSeeder ```

From the nextjs directory, run:
&nbsp;&nbsp;&nbsp;5. ``` yarn install ```

Finally, launch the application with:
&nbsp;&nbsp;&nbsp;6. ``` docker-compose up ```

### Testing
You will notice a cypress container deploying and executing e2e tests in the step above.  You can re-run that process by
- ``` docker-compose up cypress ```

There are also unit tests available:
- ``` docker exec laravel php artisan test ```
- ``` docker exec nextjs yarn test ```

---

## Challenge

### Aperture Science Enrichment Centre requires a new management system to conduct exciting new tests! Tests are questionnaires completed by (willing) human subjects, how exciting!

*Testing is the future, and the future starts with you.*

## Software Engineer

After

Graduate:
Admin can login to front end and see a list of subjects (expect candidate to perform a graphQL request and output a list)

SEI: 
+ above
Add a new data model related to subjects - testing data
Institute ordering for subjects

SEII:
+ above
Build to list subject data and request all their associated testing data
Request subject list on the server side
Implement a subject update method

Senior:
+ above
Allow subjects to login to the system, only allow them to see their own data.
Implement a password reset


UX Design Engineer (another branch?, totally different tech test?):
Build a paginated and filterable list in the front end.

Things to add:
Seed decent data
Readme + writeup
