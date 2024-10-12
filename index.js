const express = require('express');
const cors = require('cors');
const SparqlClient = require('./sparql_client');
const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;
const sparqlClient = new SparqlClient()
app.get('/', async(req, res) => {
    res.send('Hello, World! This is your backend running on Vercel.');
});

app.get('/execute', async(req, res) => {
    const {query} = req.query
    const sparqlQuery = query.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('<br>', '\n')
    // console.log('lagse re')
    try {
        const result = await sparqlClient.query(sparqlQuery);
        console.log(result)
        res.json(result); // Send the query result as the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error querying SPARQL endpoint', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
