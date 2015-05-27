var app = require('../app.js');

var assert = require("assert");


describe('battles', function() {
    describe('#get(\'/\')', function() {
        it('should return all battles', function() {
        	var response = app.get('/battles');
        	console.log(response);
        });
    });
});