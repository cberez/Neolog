var chai = require('chai');
chai.use(require('chai-fs'));

var should = require('should');
var assert = require('chai').assert;
var utils = require('../src/utils');

suite('Utils', function(){
	test('Dir creation', function(){
		utils.newDir('test', './test');
		assert.isEmptyDirectory('./test/dir_test/');
	})

	test('File creation', function(){
		utils.writeToFile('test', 'test', 'test', './test');
		'./test/dir_test/file_test'.should.be.a.file;
	})
})