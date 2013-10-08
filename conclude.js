var occur = require('occur');
var _     = require('blank');

function conclude(){
	this.tasks = {};
	occur.call(this);
}

_.mixin(conclude, occur);

conclude.prototype.after = function(tasks, callback) {
	var self   = this;
	var failed = [];
	var args   = _.toArray(arguments);

	callback = args.pop();
	tasks    = this.getTasks(args);

	var undone = tasks.filter(function(task){
		if (typeof self.tasks[task] === 'undefined') {
			return true;
		} else if (self.tasks[task] instanceof Error) {
			failed.push(task);
		}
	});
	// No undone tasks
	if (failed.length) {
		process.nextTick(callback.bind(null, new Error('Failed tasks: ' + failed.join(', '))));
	} else if (! undone.length) {
		process.nextTick(callback);
	} else {
		var onComplete = function(e, err){
			if (err) {
				self.tasks[e.task] = err;
			} else {
				self.tasks[e.task] = true;
			}

			undone = undone.filter(function(task) {
				return task !== e.task;
			});

			if (undone.length) return;

			var hasErrors = false;
			var errors = {};
			tasks.forEach(function(name){
				var task = self.tasks[name];
				if (task instanceof Error) {
					hasErrors    = true;
					errors[name] = task;
				}
			});

			self.off('complete', onComplete);
			if (hasErrors) {
				callback(new Error('Failed tasks: ' + Object.keys(errors).join(', ')));
			} else {
				callback();
			}
		};
		this.on('complete', onComplete);
	}
};

conclude.prototype.getTasks = function(tasks) {
	var index  = -1;
	var length = tasks.length;
	var result = [];
	var task;
	while (++index < length) {
		task = tasks[index];
		if (typeof task === 'string') {
			task = task.replace(/^\s+|\s+$/, '').split(/\s+/);
		}
		result = result.concat(task);
	}
	return result;
};

conclude.prototype.complete = function(name, err) {
	var event = {type:'complete',task:name};
	this.tasks[name] = true||err;
	process.nextTick(this.trigger.bind(this, event, err));
};

conclude.prototype.getComplete = function() {
	return this.complete.bind(this);
};

conclude.prototype.task = function(name) {
	var self = this;
	var fn = function(err) {
		this.complete(name, err);
	}.bind(this);

	fn.after = function(tasks, callback) {
		var args = _.toArray(arguments);
		callback = _.lastItem(arguments);
		if (typeof callback !== 'function') {
			callback = function() {
				self.complete(name);
			}
			args.push(callback);
		}
		self.after.apply(self, args);
	};
	return fn;
}

module.exports = conclude;