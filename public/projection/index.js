async function fetchQuestions() {
  const response = await fetch('/fetch-approved-questions');
  const questions = await response.json();

  // Update DOM with a subset of approved questions
}

// Fetch every 30 seconds
setInterval(fetchQuestions, 30000);
