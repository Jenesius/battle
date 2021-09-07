
const arraySelectedElements = [];

function select(array = []){
	arraySelectedElements.splice(0, arraySelectedElements.length);

	if (!Array.isArray(array)) return console.warn("Select function get only Array type. Provided: ", array);

	arraySelectedElements.push(...array);
}


/**
 * Checking that element stay inside selected area
 * @return Boolean
 * */
function checkSelectedElement(element, cordStart, cordEnd){
	/**
	 * Function check if number is between start's and end's values
	 * @return Boolean
	 * */
	function between(v, start, end) {
		let min = Math.min(start, end);
		let max = Math.max(start, end);

		return (v <= max && v >=min);
	}

	return (between(element.x, cordStart.x, cordEnd.x) && between(element.y, cordStart.y, cordEnd.y));
}

export {
	arraySelectedElements,
	select,
	checkSelectedElement
}
