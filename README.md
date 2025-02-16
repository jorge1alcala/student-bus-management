# Student Bus Management

This project is a student bus management system built with Next.js, Prisma, and PostgreSQL.

## Installation

It seems there's a peer dependency issue with `react-day-picker` and `date-fns`. Let's resolve this by explicitly installing the required versions of these packages. We'll also make sure to install all the necessary dependencies for our project.

Run the following commands in your project directory:

## Run doker Postgres server:
docker run --rm -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres

## 1 Generate the Prisma client by running:
npx prisma generate

## 2 Create the database tables by running:
npx prisma db push
## 3 Run import-student.js
Make sure your students.csv file is in the root directory of your project before running this script. nake sure to have the following row names: studentIdentifier, name, routenumber.
node import-students.js
## Running the Application
These steps should resolve the installation issues and set up your project with the necessary dependencies and data. You should now be able to run your Next.js application:
npm run dev



