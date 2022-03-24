//? this helper class contains methods to calculate distance between two points
export class DistanceHelper {
	//*we define the points
	#firstPoint;
	#secondPoint;
	constructor(firstPoint, secondPoint) {
		//*catch the points from the constructor and assign them to this class attributes
		[this.#firstPoint, this.#secondPoint] = [firstPoint, secondPoint];
	}

	//* struct a function to calculate the distance based on haversine formula
	//? haversine formula calculate straight line distance between tow coordinates
	getCrowDistance() {
		//*round the distance to be calculated in kilometers
		const round = 6371; // km
		//* prepare attributes for the formula
		const latitudeDifference = this.#toRadians(this.#secondPoint.latitude - this.#firstPoint.latitude);
		const longitudeDifference = this.#toRadians(this.#secondPoint.longitude - this.#firstPoint.longitude);
		const firstPointLatitude = this.#toRadians(this.#firstPoint.latitude);
		const secondPointLatitude = this.#toRadians(this.#secondPoint.latitude);
		//* calculate the angle
		const angle = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
			Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2) * 
			Math.cos(firstPointLatitude) * Math.cos(secondPointLatitude);
		//* get the distance
		const d = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
		//*round the distance in kilometers
		const distance = round * d;
		//* round the first digit of the distance
		return distance.toFixed(1);
	}

	// Converts numeric degrees to radians
	#toRadians(Value) {
		return Value * Math.PI / 180;
	}
}