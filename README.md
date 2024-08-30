# 📰 Northcoders News API

Hosted: https://nc-news-im.onrender.com/api

# 🤖 About

The nc-news API is a PostgreSQL database designed to access application data programmatically that mimics a real world backend service. It will provide the information to the front-end architecture. The server is able to:

- Respond with a list of available endpoints
- Respond with a list of topics, articles and users
- Respond with a single article, article comments or user based on id
- Allows articles to be filtered and sorted
- Add and delete articles and comments
- Add topics
- Update an article or a comment by id

The server has been built using Test-Driven-Development to ensure software stability. It includes pagination of articles and comments for better readability.

# 📝 How to run locally

**Cloning repo:**

In the command line 'cd' into the folder where you would like the repository to sit in your file structure. Then use:

git clone https://github.com/indymoorcroft/back-end-project.git

**Install dependencies:**

- run 'npm install'

**Set-up and Seed local database:**

1. npm run setup-dbs
2. npm run seed

**Run tests:**

npm test \_\_tests\_\_/app.test.js

**Create .env files:**

There are two databases in this project: one for real-looking dev data, and another for simpler test data.

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

Finally, run 'npm start' to run the server.

**Versions needed:**

- Node: >=6.9.0
- Postgres: >=8.0
