var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Go for run',
	completed: false
},
{
	id: 2,
	description: 'Talk to Ed',
	completed: false
},
{
	id: 3,
	description: 'Français Authentique module',
	complete: true
}];

app.get('/', function(req, res) {
	res.send('Todo-api root');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodoItem;
	for (var i = 0; i < todos.length; i++) {
		if (todos[i].id === todoId) {
			matchedTodoItem = todos[i];
		}
	}

	// todos.forEach(function(todo) {
	// 	if (todoId === todo.id) {
	// 		matchedTodoItem = todo;
	// 	}
	// });

	if (matchedTodoItem) {
		res.json(matchedTodoItem);
	} else {
		res.status(404).send();
	}
});

app.listen(PORT, function() {
	console.log('Express listening on port: ' + PORT);
})