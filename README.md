# Student Bus Management

This project is a student bus management system built with Next.js, Prisma, and PostgreSQL.

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lms-platform

# Install dependencies
npm install

# In a separate terminal, start doker Postgres
docker run --rm -p 5432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres

# Generate the Prisma client by running:
npx prisma generate

# Create the database tables by running:
npx prisma db push

# Run import-student.js
Make sure your students.csv file is in the root directory of your project before running this script. nake sure to have the following row names: studentIdentifier, name, routenumber.
node import-students.js

# Start the development server
npm run dev

```



