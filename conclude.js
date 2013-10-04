var occur = require('occur');
var _     = require('blank');

function conclude(){
	this.tasks = {};
	occur.call(this);
}

_.mixin(conclude, occur);

conclude.prototype.wait = function(task, callback) {
	var self  = this;
	var tasks = [];
	// get tasks form list of arguments of strings and arrays
	_.toArray(arguments).slice(0,-1).forEach(function(task){
		if (_.isString(task)) {
			task = task
				// remove trailing spaces
				.replace(/^\s+|\s+$/g,'')
				// split by spaces
				.split(/\s+/);
		}
		tasks = tasks.concat(task);
	});
	tasks = tasks.filter(function(task){
		return ! self.tasks.hasOwnProperty(task);
	});
	callback = arguments[arguments.length - 1];

	tasks = _.unique(tasks);
	var wait = function(e, ready) {
		// Remove ready task
		tasks = tasks.filter(function(task){
			return ready !== task;
		});

		if (tasks.length) return;

		self.off('ready', wait);
		callback();
	};

	if (tasks.length) {
		this.on('ready', wait);
	} else {
		wait();
	}
};

conclude.prototype.isReady = function(name) {
	return !!this.tasks[name];
}

conclude.prototype.ready = function(name) {
	this.tasks[name] = true;
	this.trigger('ready', name);
};

conclude.prototype.getReady = function(name) {
	var self = this;
	var fn = function() {
		self.ready(name||arguments[0]);
	};
	// Add wait method to ready callback
	fn.on = function(){
		var args = _.toArray(arguments);
		// Default callback binding
		if (typeof _.lastItem(args) !== 'function') {
			args.push(function() {
				self.ready(name);
			});
		}
		self.wait.apply(self, arguments);
	};
	return fn;
};

module.exports = conclude;
module.exports.create = function(){
	return new conclude();
};