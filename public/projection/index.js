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
    setActiveQuestion(true);
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
    //.attr('opacity', 0)
    .text(q => q); /* 
    .transition() // Fade in
    .duration(6000) // 3 second
    .attr('opacity', 0.5); */

  divs.exit()/* 
    .transition()
    .duration(6000)
    .attr('opacity', 0) */
    .remove();

  setActiveQuestion();
}



// Set recent question, or return a random index from the questions array
function setActiveQuestion(randomize = false) {
  const container = d3.select("#questions-container");
  const divs = container.selectAll('.question').nodes();

  if (divs.length === 0) return;

  // Deactivate old active question
  container.selectAll('.active-question')
    .classed('active-question', false)
    .classed('question', true);
    /* .transition() // Fade in
    .duration(6000) // 6 second
    .attr('opacity', 0.5);  // Fade to 50% */

  // Choose a new active question
  if (randomize || activeQuestionIndex === null || activeQuestionIndex >= divs.length - 1) {
    activeQuestionIndex = Math.floor(Math.random() * divs.length);
  } else {
    activeQuestionIndex++;
  }

  // Activate new active question
  const activeQuestion = d3.select(divs[activeQuestionIndex]);
  activeQuestion.classed('active-question', true)
    .classed('question', false);
    /* .transition() // Fade in
    .duration(6000) // 6 second
    .attr('opacity', 1);  // 100% opaque */

  lastUpdated = Date.now();
  startInactiveTimer();  // Reset 2 minute timeout check
};



function startInactiveTimer(duration = 120000) {  // default 2 minutes
  clearTimeout(timeoutID);  // Clear past timeout event
  timeoutID = setTimeout(() => {
    setActiveQuestion(true);  // Randomly choose an active question
  }, duration);
}



// MAIN: Start projections screen, initialize questions
document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
  setInterval(fetchQuestions, 20000); // Fetch every 20 seconds
});
