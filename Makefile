
test:
	./node_modules/mocha/bin/mocha test/test.js \
		--reporter spec

.PHONY: test