document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");

  submitBtn.addEventListener("click", async () => {
    const question = document.getElementById("questionInput").value;

    // Send question to Google Cloud
    const response = await fetch('/add-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (response.ok) {
      console.log("Question added successfully");
    } else {
      console.log("Failed to add question");
    }
  });
});
