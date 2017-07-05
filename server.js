var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var _ = require('underscore');
var db = require('./db.js');

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo-api root');
});

app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed')) {
		if (queryParams.completed === 'true') {
			filteredTodos = _.where(filteredTodos, {
				'completed': true
			});
		} else if (queryParams.completed === 'false') {
			filteredTodos = _.where(filteredTodos, {
				'completed': false
			});
		}
	}
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodoItem = _.findWhere(todos, {
		id: todoId
	});

	if (matchedTodoItem) {
		res.json(matchedTodoItem);
	} else {
		res.status(404).send();
	}
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	// body.description = body.description.trim();

	if (!_.isBoolean(body.completed) || (!_.isString(body.description) || body.description.length === 0)) {
		return res.status(400).send();
	} else {
		db.todo.create(body)
		.then(function(todo) {
			res.json(todo);
		}).catch(function(e) {
			res.status(400).json(e);
		});
	}


	// db.todo.create(body)
	// 	.then(function(todo) {
	// 		res.json(todo);
	// 	}, function(e) {
	// 		res.status(400).json(e);
	// 	});
	// body.id = todoNextId++
	// 	todos.push(body);
	// res.json(body);
});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodoItem = _.findWhere(todos, {
		id: todoId
	});

	if (matchedTodoItem) {
		todos = _.without(todos, matchedTodoItem);
		res.json(matchedTodoItem);
	} else {
		console.log('Todo item with id ' + todoId + " not found");

		res.status(404).json({
			"error": "no todo item found with that id"
		});
	}
});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodoItem = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodoItem) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} else {
		// never provided attribute, no problem here
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description.trim();
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodoItem, validAttributes);
	res.json(matchedTodoItem);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port: ' + PORT);
	})
})