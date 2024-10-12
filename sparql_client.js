const http = require('http');
const querystring = require('querystring');

module.exports = class SparqlClient {
    constructor(endpoint, user, password) {
        this.user = user ?? 'dba';
        this.password = password ?? 'dba';
        this.endpoint = new URL(endpoint ?? `http://103.94.131.241:8897/sparql`);
        // this.endpoint = new URL(endpoint ?? `http://bike-csecu.com:8896/sparql`);
    }

    async query(sparql) {
        const postData = querystring.stringify({ query: sparql });
        const options = {
            hostname: this.endpoint.hostname,
            port: this.endpoint.port,
            path: this.endpoint.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/sparql-results+json,text/turtle',
                'Content-Length': postData.length
            },
            auth: `${this.user}:${this.password}` // Basic authentication
        };
        // console.log(options)
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let data = '';

                // Listen for data chunks
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // When the response has been fully received
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            // Parse the JSON result if valid
                            const parsedData = JSON.parse(data);
                            resolve(parsedData);
                        } catch (error) {
                            reject(`Error parsing response: ${error.message}`);
                        }
                    } else {
                        reject(`Request failed with status code: ${res.statusCode}`);
                    }
                });
            });

            // Handle request errors
            req.on('error', (e) => {
                reject(`Request error: ${e.message}`);
            });

            req.write(postData);
            req.end();
        });
    }
}
