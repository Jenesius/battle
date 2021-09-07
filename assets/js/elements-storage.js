import Unit from "./units/unit";

const arrayElements = [];

function add(element){
	if (!(element instanceof Unit)) return console.warn("Each Element of canvas's structure should be a child of Unit class");

	arrayElements.push(element)
}
function remove(){}

export {
	arrayElements,
	add
}