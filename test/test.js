if (typeof module !== 'undefined') {
	component = require('./../component');
}

describe('#isRegistered()', function(){
	before(function(){  
		component.register('is-registered', function () {
			return 'is-registered';
		});
	})
	
	it('should be registered', function () {
		if (component.isRegistered('is-registered') !== true) {
			throw new Error('"is-registered", should be registered');
		}
	});
	
	it('should NOT be registered', function () {
		if (component.isRegistered('is-NOT-registered') !== false) {
			throw new Error('"is-NOT-registered", should NOT be registered');
		}
	});
});

describe('#register()', function(){
	before(function(){ 
		component.register('foo', function () {
			return 'foo';
		});
		component.register('bar', function (done) {
			done('bar');
		});
	});
	
	describe('Component named "foo"', function () {
		it('should be registered', function(){
		  	if (component.isRegistered('foo') !== true) {
				throw new Error('"foo", should be registered');
			}
		});
		it('should have the value of "foo"', function(done){
			component.use(['foo'], function (foo) {
				if (foo !== 'foo') {
					throw new Error('"foo", should be "foo"');
				}
				done();
			});
		})
	});
	
	describe('Component named "bar"', function () {
		it('should be registered', function(){
		  	if (component.isRegistered('bar') !== true) {
				throw new Error('"bar", should be registered');
			}
		});
		it('should have the value of "bar"', function(done){
			component.use(['bar'], function (bar) {
				if (bar !== 'bar') {
					throw new Error('"bar", should be "bar"');
				}
				done();
			});
		})
	});
});


describe('#use()', function(){
	before(function(){ 
		component.register('sync', function () {
			return 'sync';
		});
		component.register('sync-dep', [ 'sync' ], function (sync) {
			return sync + '-dep';
		});
		component.register('async', function (done) {
			done('async');
		});
		component.register('async-dep', [ 'async' ], function (async, done) {
			done(async + '-dep');
		});
		component.register('both-dep', [ 'sync-dep', 'async-dep' ], function (syncDep, asyncDep, done) {
			done(syncDep + '|' + asyncDep);
		});
		
	});
	
	describe('Component named "sync"', function () {
		it('"sync" should be registered', function(){
		  	if (component.isRegistered('sync') !== true) {
				throw new Error('"sync", should be registered');
			}
		});
		it('should have the value of "sync"', function(done){
			component.use(['sync'], function (bar) {
				if (bar !== 'sync') {
					throw new Error('"sync", should be "sync"');
				}
				done();
			});
		})
	});
	
	describe('Component named "async"', function () {
		it('"async" should be registered', function(){
		  	if (component.isRegistered('async') !== true) {
				throw new Error('"async", should be registered');
			}
		});
		it('should have the value of "async"', function(done){
			component.use(['async'], function (bar) {
				if (bar !== 'async') {
					throw new Error('"async", should be "async"');
				}
				done();
			});
		})
	});
	
	describe('Component named "sync" + "async"', function () {
		it('"sync" should be registered', function(){
		  	if (component.isRegistered('async') !== true) {
				throw new Error('"async", should be registered');
			}
		});
		it('"async" should be registered', function(){
		  	if (component.isRegistered('sync') !== true) {
				throw new Error('"sync", should be registered');
			}
		});
		it('should have the value of "sync" & "async"', function(done){
			component.use(['sync', 'async'], function (sync, async) {
				if (sync !== 'sync') {
					throw new Error('"sync", should be "sync"');
				}
				if (async !== 'async') {
					throw new Error('"async", should be "async"');
				}
				done();
			});
		});
	});
	
	describe('Component named "sync-dep"', function () {
		it('"sync-dep"should be registered', function(){
		  	if (component.isRegistered('sync-dep') !== true) {
				throw new Error('"sync-dep", should be registered');
			}
		});
		it('should have the value of "sync-dep"', function(done){
			component.use(['sync-dep'], function (syncDep) {
				if (syncDep !== 'sync-dep') {
					throw new Error('"syncDep", should be "sync-dep"');
				}
				done();
			});
		});
	});
	
	describe('Component named "async-dep"', function () {
		it('"async-dep" should be registered', function(){
		  	if (component.isRegistered('async-dep') !== true) {
				throw new Error('"async-dep", should be registered');
			}
		});
		it('should have the value of "async-dep"', function(done){
			component.use(['async-dep'], function (asyncDep) {
				if (asyncDep !== 'async-dep') {
					throw new Error('"asyncDep", should be "async-dep"');
				}
				done();
			});
		});
	});
	
	describe('Component named "both-dep"', function () {
		it('"both-dep" should be registered', function(){
		  	if (component.isRegistered('both-dep') !== true) {
				throw new Error('"both-dep", should be registered');
			}
		});
		it('should have the value of "both-dep"', function(done){
			component.use([ 'both-dep'], function (bothDep) {
				if (bothDep !== 'sync-dep|async-dep') {
					throw new Error('"bothDep", should be "sync-dep|async-dep"');
				}
				done();
			});
		});
	});
	
	describe('Component named "all"', function () {
		it('"sync" should be registered', function(){
		  	if (component.isRegistered('sync') !== true) {
				throw new Error('"sync", should be registered');
			}
		});
		it('"async" should be registered', function(){
		  	if (component.isRegistered('async') !== true) {
				throw new Error('"async", should be registered');
			}
		});
		it('"sync-dep" should be registered', function(){
		  	if (component.isRegistered('sync-dep') !== true) {
				throw new Error('"both-dep", should be registered');
			}
		});
		it('"async-dep" should be registered', function(){
		  	if (component.isRegistered('async-dep') !== true) {
				throw new Error('"both-dep", should be registered');
			}
		});
		it('"both-dep" should be registered', function(){
		  	if (component.isRegistered('both-dep') !== true) {
				throw new Error('"both-dep", should be registered');
			}
		});
		it('should have the value of all components', function(done){
			component.use(['sync', 'async', 'sync-dep', 'async-dep', 'both-dep'], function (sync, async, syncDep, asyncDep, bothDep) {
				if (sync !== 'sync') {
					throw new Error('"sync", should be "sync"');
				}
				if (async !== 'async') {
					throw new Error('"async", should be "async"');
				}
				if (syncDep !== 'sync-dep') {
					throw new Error('"syncDep", should be "sync-dep"');
				}
				if (syncDep !== 'sync-dep') {
					throw new Error('"syncDep", should be "sync-dep"');
				}
				if (asyncDep !== 'async-dep') {
					throw new Error('"asyncDep", should be "async-dep"');
				}
				if (bothDep !== 'sync-dep|async-dep') {
					throw new Error('"bothDep", should be "sync-dep|async-dep"');
				}
				done();
			});
		});
	});
});

