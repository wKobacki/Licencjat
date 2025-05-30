# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


data base to this project:


CREATE DATABASE IF NOT EXISTS ideas_stock;
USE ideas_stock;

-- Tabela: users
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'manager', 'admin') NOT NULL,
    name VARCHAR(100),
    surname VARCHAR(100),
    branch VARCHAR(255),
    isVerified TINYINT(1),
    isBlocked TINYINT(1)
);

-- Tabela: verification_codes
CREATE TABLE verification_codes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)
);

-- Tabela: reset_tokens
CREATE TABLE reset_tokens (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)
);

-- Tabela: ideas
CREATE TABLE ideas (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    solution TEXT,
    images TEXT,
    branch VARCHAR(255),
    author_email VARCHAR(255),
    isPublished TINYINT(1),
    status VARCHAR(50),
    votes INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    archived TINYINT(1),
    FOREIGN KEY (author_email) REFERENCES users(email)
);

-- Tabela: problems
CREATE TABLE problems (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    description TEXT NOT NULL,
    solution TEXT,
    images TEXT,
    branch VARCHAR(255),
    author_email VARCHAR(255) NOT NULL,
    isPublished TINYINT(1),
    status ENUM('pending', 'in_voting', 'in_progress', 'completed', 'rejected'),
    votes INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    archived TINYINT(1),
    FOREIGN KEY (author_email) REFERENCES users(email)
);

-- Tabela: votes_ideas
CREATE TABLE votes_ideas (
    user_email VARCHAR(255) NOT NULL,
    idea_id INT NOT NULL,
    PRIMARY KEY (user_email, idea_id),
    FOREIGN KEY (user_email) REFERENCES users(email),
    FOREIGN KEY (idea_id) REFERENCES ideas(id)
);

-- Tabela: votes_problems
CREATE TABLE votes_problems (
    user_email VARCHAR(255) NOT NULL,
    problem_id INT NOT NULL,
    PRIMARY KEY (user_email, problem_id),
    FOREIGN KEY (user_email) REFERENCES users(email),
    FOREIGN KEY (problem_id) REFERENCES problems(id)
);

-- Tabela: user_votes
CREATE TABLE user_votes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    item_id INT NOT NULL,
    item_type ENUM('idea', 'problem') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Tabela: comments
CREATE TABLE comments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    item_type ENUM('idea', 'problem') NOT NULL,
    parent_id INT,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INT,
    FOREIGN KEY (author_email) REFERENCES users(email)
);

-- Tabela: comment_likes
CREATE TABLE comment_likes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    comment_id INT,
    user_email VARCHAR(255),
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (user_email) REFERENCES users(email)
);
