const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send(`The server is running..`)
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
