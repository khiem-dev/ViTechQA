const uploadButton = document.getElementById("uploadButton");
const askButton = document.getElementById("askButton");

const pdfFile = document.getElementById("pdfFile");
const uploadStatus = document.getElementById("uploadStatus");

const questionInput = document.getElementById("questionInput");
const answerBox = document.getElementById("answerBox");


uploadButton.addEventListener("click", async () => {
    const file = pdfFile.files[0];

    if (!file) {
        uploadStatus.textContent = "Vui lòng chọn file PDF.";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadStatus.textContent = "Đang upload và build index...";

    try {
        const response = await fetch("http://127.0.0.1:8000/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        uploadStatus.textContent =
            data.message || "Upload thành công.";

    } catch (error) {
        uploadStatus.textContent = "Có lỗi khi upload file.";
        console.error(error);
    }
});


askButton.addEventListener("click", async () => {
    const question = questionInput.value.trim();

    if (!question) {
        answerBox.textContent = "Vui lòng nhập câu hỏi.";
        return;
    }

    answerBox.textContent = "Đang xử lý...";

    try {
        const response = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (data.error) {
            answerBox.textContent = data.error;
        } else {
            answerBox.textContent = data.answer;
        }

    } catch (error) {
        answerBox.textContent = "Có lỗi khi gửi câu hỏi.";
        console.error(error);
    }
});