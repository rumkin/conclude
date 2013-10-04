var conclude = new (require('../conclude'));
var OK = false;
var done = function() {
	OK = true;
};

conclude.wait('mysql',['connect'], function(){
	console.log('Mysql + connect');
});

conclude.wait('mysql connect other', function(){
	console.log('mysql + connect + other');
	conclude.wait('mysql connect other', function(){
		console.log('inner mysql + connect + other');
		done();
	});
});

conclude.wait('connect', function(){
	console.log('connect');
});

conclude.wait('other', function(){
	console.log('other');
});

conclude.wait('mysql', function(){
	console.log('mysql');
});

conclude.wait('connect other', function(){
	console.log('connect + other');
});

var ready = conclude.getReady();

setTimeout(function(){
	ready('mysql');
}, 3 * Math.random() * 1000);

setTimeout(function(){
	ready('connect');
}, 3 * Math.random() * 1000);

setTimeout(function(){
	ready('other');
}, 3 * Math.random() * 1000);

process.on('exit', function(){
	process.exit(OK?0:-1);
});