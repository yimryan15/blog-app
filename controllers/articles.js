const util = require('util');
const articles = require('../models/articles');
const defaultMessage = "Sorry, page doesn't exist or article not found";
const defaultTitle = `Ryan's Blog`;

module.exports.notFound = function(request, response) {
	return response.render('404', {message: defaultMessage});
}

// ================================================
// (Delete) an article from the model
module.exports.delete = function(request, response, callback) {
	const id = request.params.id;

	articles.deleteArticleById(parseInt(id), function(err, list) {
		if (err) {
			const message = err.errno === -2 ? defaultMessage : 'Try again later';

			// make sure we only render once!!! so return
			return response.render('404', {message: message});
		}

		// after delete call the callback function
		callback();
	});
}

// ================================================
// (Get) a list of articles from the model
module.exports.get = function(request, response) {
	articles.get(function(err, list) {
		if (err) {
			const message = err.errno === -2 ? defaultMessage : 'Try again later';

			// make sure we only render once!!! so return
			return response.render('404', {message: message});
		}
		response.render('index', {articles: list, title: defaultTitle});
	})
}

// ================================================
// (Show) 1 article by id and show that article
module.exports.show = function(request, response) {
	const id = request.params.id;

	if (!id) {
		return response.render('404', {message: defaultMessage, title: defaultTitle});
	}

	articles.getArticleById(parseInt(id), function(err, article) {
		if (err) {
			const message = err.errno === -2 ? defaultMessage : 'Try again later';
			return response.render('404', {message: message, title: defaultTitle}) ;
		}

		if (!article || article.length === 0) {
			return response.render('404', {message: defaultMessage, title: defaultTitle});
		}

		response.render('article', {
				article: article,
				title: article.title
		});
	})
}

// ================================================
// (Post) 1 article
// because all input is assumed bad we want to validate
// and sanitize (clean bad stuff) all input from
// a user or other source. We use the expressValidator for this
module.exports.post = function(request, response) {

	// validate the title
	request
		.checkBody('title', 'Invalid title')
		.notEmpty()

		// validate the image url
	request.checkBody('url', 'Invalid Image URL')
		.notEmpty()

	// validate the article body
	request.checkBody('body', 'Invalid Article')
		.notEmpty()

	// check if there are errors else all good!!
	request.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
      return response.render('new', {title: 'Create new article', errors: result.array() }) ;
		}

		// SANITIZE USER INPUT - ALWAYS!!!!!!
		// rely on the tools of the libraries you're using!
		request.sanitizeBody('title').escape();
		request.sanitizeBody('url').escape();
		request.sanitizeParams('body').escape();

		function getRandomInt(min, max) {
		  min = Math.ceil(min);
  		max = Math.floor(max);
  		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
		}

		const input = {
			title: request.body.title,
			url: request.body.url + '/?image=' + getRandomInt(1, 700),
			body: request.body.body
		}

		// save the article!!
		articles.save(input, (err) => {
			if (err) {
				return response.render('new', {
					title: 'Create new article',
					errors: [{msg: err.message}]
				});
			}

			// redirect to the index page which has all the article if success
			response.redirect('/');
		})
	});
}

// ================================================
// (Show) 1 article form to create new article
// we wouldn't normally do this cause we assume input
// is very bad and therefore we'd likely want to
// review anything thats saved
module.exports.new = function(request, response) {
	response.render('new', {title: 'Create new article'}) ;
}
