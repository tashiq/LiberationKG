const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// A simple GET route
app.get('/', (req, res) => {
    res.send('Hello, World! This is your backend running on Vercel.');
});

// A sample API route
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// For vercel deployment
module.exports = app;
