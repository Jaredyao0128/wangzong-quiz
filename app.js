
const { useState, useEffect } = React;

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const pageSize = 10;
  const currentPageQuestions = questions.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    fetch('questions_120.json')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
    if (submitted) {
      const score = getScore();
      const audio = document.getElementById(score / currentPageQuestions.length >= 0.6 ? "sound-good" : "sound-bad");
      if (audio) audio.play();
    }
  }, [submitted]);

  const handleSelect = (qId, optIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmit = () => setSubmitted(true);

  const getScore = () => {
    return currentPageQuestions.reduce((score, q) => {
      const correct = q.answer.charCodeAt(0) - 65;
      if (selectedAnswers[q.id] === correct) score++;
      return score;
    }, 0);
  };

  return React.createElement("div", { className: "max-w-3xl mx-auto p-4 space-y-6" },
    React.createElement("h1", { className: "text-3xl font-bold text-center text-pink-500" }, "🐰 王总专属刷题神器---要心情美美哒哦"),
    ...currentPageQuestions.map(q =>
      React.createElement("div", { key: q.id, className: "bg-white border-2 border-pink-200 rounded-3xl p-5 shadow-lg" }, [
        React.createElement("div", { className: "font-semibold text-lg mb-3" }, `📘 [${q.subject}] ${q.question}`),
        ...q.options.map((opt, i) => {
          const isSelected = selectedAnswers[q.id] === i;
          const isCorrect = q.answer.charCodeAt(0) - 65 === i;
          let btnStyle = "transition-all border px-3 py-2 rounded-2xl w-full text-left";
          if (submitted && isSelected && isCorrect) btnStyle += " bg-green-100 border-green-400 text-green-700";
          else if (submitted && isSelected && !isCorrect) btnStyle += " bg-red-100 border-red-400 text-red-700";
          else if (isSelected) btnStyle += " bg-pink-100 border-pink-400 text-pink-700";
          else btnStyle += " bg-white hover:bg-pink-50";
          return React.createElement("button", {
            key: i,
            onClick: () => handleSelect(q.id, i),
            className: btnStyle
          }, `${String.fromCharCode(65 + i)}. ${opt}`);
        })
      ])
    ),
    !submitted ? React.createElement("button", {
      onClick: handleSubmit,
      className: "mt-6 w-full bg-pink-400 hover:bg-pink-500 text-white text-lg font-bold py-2 px-4 rounded-full"
    }, "✨ 提交本页答案 ✨") : React.createElement("div", {
      className: "text-center text-xl font-semibold text-pink-600"
    }, `🎉 本页答对了 ${getScore()} / ${currentPageQuestions.length} 题！真棒！`),
    React.createElement("div", { className: "flex justify-between pt-4" },
      page > 0 && React.createElement("button", {
        className: "bg-gray-200 rounded-full px-4 py-1",
        onClick: () => { setPage(p => p - 1); setSubmitted(false); }
      }, "⬅ 上一页"),
      (page + 1) * pageSize < questions.length && React.createElement("button", {
        className: "bg-gray-200 rounded-full px-4 py-1 ml-auto",
        onClick: () => { setPage(p => p + 1); setSubmitted(false); }
      }, "下一页 ➡")
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(QuizApp));
