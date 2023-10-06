let questions = [];
let activeQuestionIndex = null;
let lastUpdated = Date.now();
let timeoutID;


async function fetchQuestions() {
  try {
    const fetchedQuestions = await getQuestionsFromServer();

    console.log('Fetched questions:', fetchedQuestions); //Debugging
    updateQuestions(fetchedQuestions);
  } catch (error) {
    console.error(error);
  }
}


async function getQuestionsFromServer() {
  const response = await fetch('/fetch-approved-questions');
  if (!response.ok) {
    throw new Error(`HTTP get error: ${response.status}`);
  }
  return response.json();
}



function updateQuestions(fetchedQuestions) {
  if (isNewQuestions(fetchedQuestions)) {
    questions = fetchedQuestions;
    setActiveQuestion(true, true);
  }
  renderQuestions();
  startInactiveTimer();
}



// Return false if the questions are the same
function isNewQuestions(fetchedQuestions) {
  return !fetchedQuestions.every((q, i) => q === questions[i]);
}



// DOM Manipulation
function renderQuestions() {
  const container = d3.select("#questions-container");
  const divs = container.selectAll('.question').data(questions);

  divs.enter()
    .append('div')
    .attr('class', 'question')
    .text(q => q);

  divs.exit().remove();

  setActiveQuestion();
}



// Set recent question, or return a random index from the questions array
function setActiveQuestion(randomize = false, newQuestion = false) {
  const container = d3.select("#questions-container");
  const divs = container.selectAll('.question').nodes();

  if (divs.length === 0) return;

  // Deactivate old active question
  container.selectAll('.active-question')
    .classed('active-question', false)
    .classed('question', true);

  // Choose a new active question
  if (randomize) {
    activeQuestionIndex = Math.floor(Math.random() * divs.length);
    lastUpdated = Date.now();
    startInactiveTimer();  // Reset 2 minute timeout check
  } else {
    activeQuestionIndex++;
  }

  // Activate new active question
  const activeQuestion = d3.select(divs[activeQuestionIndex]);
  activeQuestion.classed('active-question', true)
    .classed('question', false);

};



function startInactiveTimer(duration = 120000) {  // default 2 minutes
  clearTimeout(timeoutID);  // Clear past timeout event
  timeoutID = setTimeout(() => {
    if (Date.now() - lastUpdated >= 120000) { // Check if 2 minutes have passed
      setActiveQuestion(true);
    }
  }, duration);
}



// MAIN: Start projections screen, initialize questions
document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
  setInterval(fetchQuestions, 30000); // Fetch every 30 seconds
});
