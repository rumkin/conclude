var conclude = new (require('../conclude'));
var OK = false;
var done = function() {
	OK = true;
};

conclude.after(['mysql'], function(){
	console.log('Mysql');
});

conclude.after('mysql', 'other', function(err){
	if (err) {
		console.error(err + '');
	} else {
		console.log('All done');
	}
	done();
});

conclude.task('other').after(['mysql'], function(err) {
	if (err) {
		conclude.complete('other', new Error('Initialization error'));
	} else {
		conclude.complete('other');
	}
});
conclude.complete('mysql');

process.on('exit', function(){
	process.exit(OK?0:-1);
});