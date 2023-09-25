## **OK, But Why?**

This is a simple web application that allows users to ask thought-provoking questions.

### Installation
```
git clone https://github.com/KnoxSamuel/okay-but-question.git

cd okay-but-question

npm install
```

### Requirements
"npm": "^10.1.0" & node.js": "^v18.18.0"
```
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "google-auth-library": "^8.9.0",
  "google-spreadsheet": "^4.1.0",
  "nodemon": "^3.0.1"
```

### Usage
```
npm run start

Input Form: http://localhost:3000/input/
Projection View: http://localhost:3000/projection/

Manually approve submitted questions in the spreadsheet by changing 'Approved' status from 'N' to 'Y'.
```
