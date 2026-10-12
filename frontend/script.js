const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("question");
const answer = document.getElementById("answer");

const loading = document.getElementById("loading");


questionForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const question = questionInput.value.trim();

  if (question === "") {
    answer.textContent = "Please enter a question.";
    return;
  }

  loading.textContent = "Thinking... 🤔";

  answer.textContent = "";

  try {

    const response = await fetch("/ask", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question: question
      })

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    answer.textContent = data.answer;

  } catch (error) {

    console.error(error);

    answer.textContent = error.message;

  } finally {

    loading.textContent = "";

  }

});