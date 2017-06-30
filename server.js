var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var _ = require('underscore');

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo-api root');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodoItem = _.findWhere(todos, {id: todoId});

	if (matchedTodoItem) {
		res.json(matchedTodoItem);
	} else {
		res.status(404).send();
	}
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	console.log(body);
	body.description = body.description.trim();

	if (!_.isBoolean(body.completed) || (!_.isString(body.description) || body.description.length === 0)) {
		return res.status(400).send();
	}
	body.id = todoNextId++
	todos.push(body);
	res.json(body);
});

app.listen(PORT, function() {
	console.log('Express listening on port: ' + PORT);
})