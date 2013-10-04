Run callbacks when all of loadings occured.

```javascript
conclude.wait('all-tasks', function(){
	console.log('All tasks complete')	
});

// Define tasks with a string
conclude.wait('mysql mongo memcache', function(){
	console.log('Ready A')
});
// Define tasks as an Array
conclude.wait(['mysql', 'mongo', 'memcache'], function(){
	console.log('Ready B')
});
// Define tasks as arguments
conclude.wait('mysql', 'mongo', 'memcache', function(){
	console.log('Ready C')
});
// All styles together
conclude.wait(['mysql'], 'mongo memcache', function(){
	console.log('Ready E');
});

var ready = conclude.getReady();
var memcacheReady = conclude.getReady('memcache');

process.nextTick(function(){
	// Data stores will be ready after others
	conclde.getReady('all-tasks').on('memcached mongo mysql');
	// Notify conclude
	conclude.ready('mysql');
	// Notify with closure
	ready('mongo');
	// Notify with strict closure
	memcacheReady();
});
```
The output will be the:
```
Ready A
Ready B
Ready C
Ready E
All tasks complete
```