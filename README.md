# Component #


## Register a component ##

### A simple component ###
	component.register('component-a', function () {
		var A = function () { };
		return A;
	});

### A component with dependencies ###
	component.register('component-b', [ 'component-a' ], function (A) {
		var tmp = function () {},
			B = function () {
				A.apply(this, arguments);
			};
		
		tmp.prototype = Parent.prototype;
		
		B.prototype = new tmp();
		
		return B;
	});

### A asynchronous component with dependencies ###
	component.register('component-c', [ 'component-b' ], function (B, done) {
		setTimeout(function () {
			done(new B);
		}, 1000);
	});


## Use components ##
	component.use([ 'component-a', 'component-b', 'component-c' ], function (A, B, C) {
		if (C instanceof B) {
			alert('Great success!');
		} else {
			alert('Epic failure!');
		}
	});
