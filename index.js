const express = require('express');
const auth = require('./routes/auth');
const post = require('./routes/post');

const app = express();

app.use(express.json());
app.use('/auth', auth);
app.use('/posts', post);

app.get('/', (req, res) => {
    res.send('<h1>Hi I am working</h1>');
});


app.listen(5000, () => {
    console.log('Now running on port 5000');
})