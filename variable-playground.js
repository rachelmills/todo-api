var person = {
	name: 'Rachel',
	age: 31
};

function updatePerson(obj) {
	// obj = {
	// 	name: 'Rachel1',
	// 	age: 45
	// };
	obj.name = '20';
}

console.log(person);
updatePerson(person);
console.log(person);

grades = [15, 37];

function addGrades(grades) {
	grades.push(7);
}

function addGradesBad(grades) {
	grades = [7];
	debugger;
	return grades;
}

console.log(grades);
grades = addGradesBad(grades);
console.log(grades);