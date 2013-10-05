var conclude = new (require('../conclude'));
var OK = false;
var done = function() {
	OK = true;
};

conclude.after('mysql',['connect'], function(){
	console.log('Mysql + connect');
});

conclude.after('mysql connect other', function(){
	console.log('mysql + connect + other');
	conclude.after('mysql connect other', function(){
		console.log('inner mysql + connect + other');
		done();
	});
});

conclude.after('connect', function(){
	console.log('connect');
});

conclude.after('other', function(){
	console.log('other');
});

conclude.after('mysql', function(){
	console.log('mysql');
});

conclude.after('connect other', function(){
	console.log('connect + other');
});

var ready = conclude.getReady();

setTimeout(function(){
	conclude.task('mysql').ready(new Error('Invalid params'));
});

setTimeout(function(){
	ready('connect');
});

setTimeout(function(){
	ready('other');
});

process.on('exit', function(){
	process.exit(OK?0:-1);
});