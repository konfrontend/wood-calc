import collection from './data-mat.json'

const API = {
	materials: collection,
	all: function () {
		return this.materials;
	},
	get: function (id) {
		if( this.materials[id] ) {
			return this.materials[id];
		}
	}
}
export default API