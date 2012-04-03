
test:
	./node_modules/.bin/mocha test/test.js \
		--reporter spec

.PHONY: test