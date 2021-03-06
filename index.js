const express = require('express');
const expressValidator = require('express-validator');
const parser = require('body-parser');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.use(expressValidator());

app.use(express.static('public'));

app.set('view engine', 'ejs');

const articlesController = require('./controllers/articles');

app.get('/', articlesController.get);
app.get('/articles', articlesController.get);
app.get('/articles/create', articlesController.new);
app.post('/articles/create', articlesController.post);

// to delete in a form we need to use POST, why?
// https://stackoverflow.com/questions/165779/are-the-put-delete-head-etc-methods-available-in-most-web-browsers
app.post('/articles/:id', (request, response) => {
    // if _method == DELETE
    if (request.body._method === 'DELETE') {
        return articlesController.delete(request, response, () => {
            response.redirect('/');
        });
    }

    // we don't support post or put (yet) so just redirect user
    // if anything else
    response.redirect('/');
});

// todo, ajax not working due to json
// delete is only handled from API calls
app.delete('/articles/:id', (request, response) => {
    return articlesController.delete(request, response, () => {
        // we're not handling errors
        response.json({"success": true});
    });
});

app.get('/articles/:id', articlesController.show);
app.get('*', articlesController.notFound);

const server = app.listen(port, () => {
    console.log(`started port ${port}`)
});
