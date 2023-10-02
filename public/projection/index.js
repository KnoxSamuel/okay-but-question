document.addEventListener("DOMContentLoaded", () => {

  async function fetchQuestions() {
    const response = await fetch('/fetch-approved-questions');
    const questions = await response.json();
    updateDOM(questions);
  }


  function updateDOM(questions) {
    const container = d3.select("#questions-container");
    const divs = container.selectAll('div')
                          .data(questions);

    divs.enter()
        .append('div')
        .attr('class', 'question drift')
        .text(q => q[1]);

    container.select('div:nth-last-child(2)')
             .classed('active-question', false)
             .classed('question', true); 
    
    // Most recent question to active-question
    container.select('div:last-child')
             .classed('active-question', true)
             .classed('question', false); 

    divs.exit().remove();
  }

  fetchQuestions();
  setInterval(fetchQuestions, 120000); // Fetch every 30 seconds
});