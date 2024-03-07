class debounce {
	constructor(type, path) {
	}
	debounce(func, time=500) {
		let waitTime
		return function(...args) {
			if(waitTime) {
				clearTimeout(waitTime)
			}
			waitTime = setTimeout(() => {
				func(...args)
			}, time)
		}
	}
}
export default debounce
