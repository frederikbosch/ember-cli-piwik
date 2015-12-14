import {
  module,
  test
} from 'qunit';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import config from '../../config/environment';

var application;

module('acceptance:injection', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('should inject two script tags in the html', function(assert) {
  assert.expect(4);

  visit('/');
  andThen(function() {
    // Use the values from the dummy config
    var sid = config.piwik.sid;
    var php = config.piwik.url + '/piwik.php';
    var js = config.piwik.url + '/piwik.js';

    // Make sure the _paq object is there after the injection
    assert.ok(Ember.isArray(window._paq), 'initialization script has been injected');

    // Inspect the head script for the right replacements
    assert.equal(window._paq[0][1], sid, 'initialization script has the correct replaced sid');
    assert.equal(window._paq[1][1], php, 'initialization script has the correct replaced url');

    // Inspect the body script src attribute
    assert.equal(Ember.$('script[src="' + js + '"]').length, 1, 'tracker script has been injected');
  });
});
