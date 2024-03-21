const express = require('express');
const { GoogleGenerativeAI, GoogleGenerativeAIResponseError } = require('@google/generative-ai');

const app = express();
const port = 3000;

async function get_repond_AI(text) {
    const genAI = new GoogleGenerativeAI("AIzaSyAfT10fEfWBOcdIAQ0RrOZ-QCcqx5r28VA");

    async function run(textt) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = textt;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(text);
            return text;
        } catch (error) {
            // Check if the error is related to harmful content
            if (error instanceof GoogleGenerativeAIResponseError && error.response.promptFeedback.blockReason === 'SAFETY') {
                console.error('Error: Response was blocked due to SAFETY.');
                return "Sorry, we cannot provide a response due to safety concerns.";
            } else {
                console.error('Error:', error);
                return "An error occurred while processing your request. Please try again later.";
            }
        }
    }

    try {
        return await run(text);
    } catch (error) {
        console.error(error);
        return "An unexpected error occurred.";
    }
}


// Route to handle GET requests from the client
app.get('/ai/:message', (req, res) => {
    console.log('Received request from client:', req.url);

    const message = req.params.message;

    async function a(){
        const ai_res = await get_repond_AI(message);

        // Send a response back to the client
        res.send(ai_res);
    }

    a();
});

app.get('/', (req, res) => {
    res.send("got to /ai/ to talk to a ai using curl {url}/ai/{ur prompt}  please not dont place space like /ai/hello man insted do /ai/hello_man")
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
