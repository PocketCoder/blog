const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const matter = require('gray-matter');
const fs = require('fs');

const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('views', 'articles');
app.set('view engine', 'ejs');

app.get('/posts/:article', (req, res) => {
	const file = matter.read(`./articles/posts/${req.params.article}.md`);
	let md = require('markdown-it')();
	let content = file.content;
	let result = md.render(content);

	res.render('post', {
		post: result,
		title: file.data.title,
		description: file.data.description
	});
});

app.get('/', (req, res) => {
	const posts = fs.readdirSync('articles/posts/').filter((file) => file.endsWith('.md'));
	res.render('index', {
		posts: posts
	});
});

app.listen(port, () => {
	console.log(`Your app is listening on ${port}...`);
});