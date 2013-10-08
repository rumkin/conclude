Run callbacks when all of loadings occured.

```javascript
conclude.after('all-tasks', function(){
	console.log('All tasks complete');
});

// Define tasks with a string
conclude.after('mysql mongo memcache', function(){
	console.log('Ready A');
});
// Define tasks as an Array
conclude.after(['mysql', 'mongo', 'memcache'], function(){
	console.log('Ready B');
});
// Define tasks as arguments
conclude.after('mysql', 'mongo', 'memcache', function(){
	console.log('Ready C');
});
// All styles together
conclude.after(['mysql'], 'mongo memcache', function(){
	console.log('Ready D');
});

var complete = conclude.getComplete();

process.nextTick(function(){
	// All-tasks will be ready after others
	conclude.task('other').after('memcached mongo mysql');
	// Notify conclude
	conclude.complete('mysql');
	// Notify with closure
	complete('mongo');
	complete('memcache');
});
```
The output:
```
Ready A
Ready B
Ready C
Ready D
All tasks complete
```