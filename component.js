/*globals module, setTimeout */
(function (root) {
	"use strict";
	
	var component = {},
	
		// This object is used as an registr
		REGISTRY = {},
		
		
		// Since IE before 9 can't do indexOf on array's we need use this
		indexOf = function (arr, value) {
			if (arr.indexOf) {
				return arr.indexOf(value);
			}
			
			var len = arr.length,
				i;
			
			for (i = 0; i < len; i += 1) {
				if (arr[i] === value) {
					return i;
				}
			}
			
			return -1;
		},
		
		// Since older browser can't do Object.keys we need use this
		keys = Object.keys || function (obj) {
			
			var keys = [],
				key;
			
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					keys.push(key);
				}
			}
			
			return keys;
		},
		
		
		/**
		 * Private helper class to deal with compoents
		 * @param String name The name of the component
		 * @param Array deps The dependencies of the component
		 * @param Function builder The builder function of the component
		 */
		Builder = function (name, deps, builder) {
			var callbacks = [],
				// Start of in an non-running state
				isRunning = false,
				
				// If the builder has same number of arguments as there are 
				// dependencies we can asume it's a "sync" component
				isSync = (builder.length === deps.length),
				
				// The builder function's callback that will be called with built component
				ready = function (comp) {
					
					// Put the component into the registry
					REGISTRY[name] = comp;
					
					var len = callbacks.length,
						i;
					
					// Loop over any callbacks and call them
					for (i = 0; i < len; i += 1) {
						callbacks[i].call(callbacks[i]);
					}
					
					// These are not needed any more
					callbacks = isRunning = null;
				};
			
			/**
			 * Builder function that taks an callback
			 * @param Function callback A function that will be called when the componet is ready
			 */
			this.build = function (callback) {
				// Save the callback for later
				callbacks.push(callback);
				
				// Ensure that we only run this once
				if (!isRunning) {
					// Ensure that we only run this once
					isRunning = true;
					
					// If there are no component dependencies we can call the builder right away
					if (deps.length === 0) {
						// Ensure a-synchronicity
						setTimeout(function () {
							
							// If the builder has same number of arguments as there are 
							// dependencies we can asume it's a "sync" component
							if (isSync) {
								
								// Call ready to set value
								ready(builder());
							
							// It's a "async" component
							} else {
								
								// Call the component builder
								builder(ready);
							}
						}, 0);
					
					} else {
						// Get all component dependencies
						component.use(deps, function () {
							
							// Make arguments, component dependencies, into an array
							var args = Array.prototype.slice.call(arguments, 0);
							
							if (isSync) {
								
								// Call ready to set value
								ready(builder.apply(builder, args));
								
							// It's a "async" component
							} else {
								// Ensure that the ready function is the last one
								args.push(ready);
								
								// Call the component builder
								builder.apply(builder, args);
							}
						});
					}
				}
			};
		};
	
	
	/**
	 * Check if a component is registered
	 * @param String name The name of the component
	 * @return Boolean
	 */
	component.isRegistered = function (name) {
		// If the registry has ths name as an property then it's registered
		return REGISTRY.hasOwnProperty(name);
	};
		
	
	/**
	 * Register a component
	 * @param String name The name of the component
	 * @param Array||Function deps An array of dependencies for this component requires or the component builder fucntion
	 * @param Function||Array builder The component builder fucntion, if this component has dependcies
	 */
	component.register = function (name, deps, builder) {
		
		// Ensure we don't dubble register
		if (component.isRegistered(name)) {
			throw new Error('"' + name +'" already registered');
		}
		
		// If we have a builder then ensure that the deps are at least an empty array
		if (builder) {
			deps = deps || [];
			
		// No builder then deps should be the builder
		} else {
			builder = deps;
			deps = [];
		}
		
		// Put the name, dependencies and the component builder in a custom object for later use
		REGISTRY[name] = new Builder(name, deps, builder);
	};
	
	
	/**
	 * Get components and then call a callback
	 * 
	 * @param Array keys The name all components that is needed
	 * @param Function callback The callback that should be called after all components are ready
	 * @param Object scope Optional Call the callback with this scope
	 */
	component.use = function (components, callback, scope) {
		
		if (components === '*') {
			components = keys(REGISTRY);
		}
		
		var args = [],
			len = components.length,
			isDoneNow = true,
			
			// Test if all components are ready, if so call the 
			done = function () {
				callback.apply(scope || callback, args);
			},
			
			// Attempt to get component
			getComponent = function (name) {
				
				// Ensure we accually have this component registered
				if (!component.isRegistered(name)) {
					throw new Error('"' + name + '" in not registered');
				}
				
				// Get index now and keep since we might need it later
				var i = args.length,
					comp = REGISTRY[name];
				
				// Check if async component
				// TODO: The whole "instanceof" thing feels inadequate and lacking
				if (comp instanceof Builder) {
					// We need to wait on async component, so we can't be done now
					isDoneNow = false;
					
					// Run async builder
					comp.build(function () {
						
						// Set the "real" built component into the callback arguments
						args[i] = REGISTRY[name];
						
						// If there are no dummy values in the array we're done!
						if (indexOf(args, Builder) === -1) {
							done();
						}
					});
					
					// Change to a unique dummy value for later look up
					comp = Builder;
				}
				
				// Set the component in the callback arguments
				args[i] = comp;
			},
			i;
		
		// Loop over all required components
		for (i = 0; i < len; i += 1) {
			getComponent(components[i]);
		}
		
		// Are we done now?
		if (isDoneNow) {
			// Ensure a-synchronicity
			setTimeout(done, 0);
		}
	};
	
	// 
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = component;
	} else {
		root.component = component;
	}
}(this));