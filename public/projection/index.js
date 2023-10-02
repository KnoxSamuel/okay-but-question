let latestQuestion = null;
let lastUpdated = Date.now();



async function fetchQuestions() {
  try {
    const questions = await getQuestions();
    if (questions.length > 0) {
      const newLatestQuestion = questions[questions.length - 1][1];

      if (newLatestQuestion !== latestQuestion) {
        latestQuestion = newLatestQuestion;
        lastUpdated = Date.now();
        currentQuestionIndex = questions.length - 1;  // Set index to the last question
      };
    };
    updateDOM(questions);
  } catch (error) {
    console.error(error);
  };
};



async function getQuestions() {
  const response = await fetch('/fetch-approved-questions');
  if (!response.ok) {
    throw new Error(`HTTP get error: ${response.status}`);
  }
  return response.json();
};



function updateDOM(questions) {
  console.log('Before data binding:', questions);

  const container = d3.select("#questions-container");
  const divs = container.selectAll('.question')
                        .data(questions, q => q[2]);
  
  console.log('After data binding:', divs);

  divs.enter()
      .append('div')
      .attr('class', 'question')
      .text(q => q[1]);
  divs.exit().remove();
  updateActiveQuestion(container);
}



function updateActiveQuestion(container) {
  console.log('Before update:', container.selectAll('.question').nodes());

  const divs = container.selectAll('.question').nodes();
  if (divs.length === 0) return;

  const now = Date.now();
  
  if (now - lastUpdated > 120000) {
    currentQuestionIndex = Math.floor(Math.random() * divs.length);
    lastUpdated = now;
  }

  container.selectAll('.active-question')
           .classed('active-question', false)
           .classed('question', true);

  d3.select(divs[currentQuestionIndex])
    .classed('active-question', true)
    .classed('question', false);

  console.log('After update:', container.selectAll('.question').nodes());
}



document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
  setInterval(fetchQuestions, 20000); // Fetch every 20 seconds
  //setInterval(() => updateActiveQuestion(d3.select("#questions-container")), 120000); // Check every 2 minutes
});

/*

0
    1 - active
2
3
4
5
6
7
8
9

:

0
1
1
    2 - active
3
4
5
6
7
8
9

:

0
1
2
2
    3 - active
4
5
6
7
8
9

*/