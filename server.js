require('dotenv').config();
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

/*
 * Project: Okay-But-Question
 * Repository: https://github.com/KnoxSamuel/okay-but-question.git
 * Author: Samuel Knox
 * Email: knoxsa@oregonstate.edu
 */

const app = express();
const PORT = 3000;
const SHEET_ID = '1Vd1XLQCE6SiJvGlPAf2iIFRT-iRIvBiPPoZVBxkzNlQ';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACC_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACC_KEY.replace(/\\n/g, '\n'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ]
});

const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);



/*************************************************************
 * Sends a question to the Google Sheet to be approved manually
 *
 * https://theoephraim.github.io/node-google-spreadsheet/
 *************************************************************/
async function appendQuestionToSheet(question) {
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({ Approved: 'N', Question: question, Timestamp: new Date().toISOString() });
};



/*************************************************************
 * Returns <Record> objects that are approved
 *
 * https://theoephraim.github.io/node-google-spreadsheet/
 *************************************************************/
async function fetchApprovedQuestionsFromSheet() {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  rows = await sheet.getRows();
  rows = rows.filter(row =>
    ["Yes", "Y", "yes", "y", "X", "x"].includes(row.Approved)
  ).map(row => row.Question);
  console.log(rows);
  return rows;
}



// Serve static files
app.use('/input', express.static('public/input'));
app.use('/projection', express.static('public/projection'));

// Parse JSON bodies
app.use(express.json());



/*******************************
 * Home Page
 ******************************/
app.get('/', (req, res) => {
  res.send('Hello, OK But Why Exhibit!');
});



/******************************
 * Route: Pull approved questions ('Y' or 'y') from worksheet
 *
 ******************************/
app.get('/fetch-approved-questions', async (req, res) => {
  const approvedQuestions = await fetchApprovedQuestionsFromSheet(); // Function not implemented yet
  res.json(approvedQuestions);
});



/******************************
 * Route: Add inputs to worksheet
 *
 ******************************/
app.post('/add-question', async (req, res) => {
  const { question } = req.body;

  try {
    await appendQuestionToSheet(question);
    console.log("Question added to Google Sheet:", question);
    res.status(200).send('Question added');
  } catch (error) {
    console.log("Failed to add question to Google Sheet:", error);
    res.status(500).send('Internal Server Error');
  }
});



/******************************
 *  Start the server
 *
 ******************************/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
