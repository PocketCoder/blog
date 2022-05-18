const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const matter = require('gray-matter');
const fs = require('fs');
const { nextTick } = require('process');

const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('views', 'articles');
app.set('view engine', 'ejs');

app.get('*', function(req, res, next) {  
	if (req.headers.host !== 'localhost:' + port) {
		res.redirect('https://' + req.headers.host + req.url);
	} else {
		next();
	}
});

app.get('/posts/:article', (req, res) => {
	const file = matter.read(`./articles/posts/${req.params.article}.md`);
	let md = require('markdown-it')();
	let content = file.content;
	let result = md.render(content);

	res.render('post', {
		post: result,
		title: file.data.title,
		description: file.data.description,
		category: file.data.category
	});
});

app.get('/', (req, res) => {
	let postsData = {};
	const posts = fs.readdirSync('articles/posts/').filter((file) => file.endsWith('.md'));
	for (const x in posts) {
		const file = matter.read(`./articles/posts/${posts[x]}`);
		let md = require('markdown-it')();
		let content = file.content;
		let result = md.render(content);
		postsData[posts[x]] = {
			title: file.data.title,
			description: file.data.description,
			category: file.data.category
		};
	}
	res.render('index', {
		posts: posts,
		data: postsData
	});
});

app.listen(port, () => {
	console.log(`Your app is listening on ${port}...`);
});
