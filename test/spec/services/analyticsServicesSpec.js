/**
 * Created by Sabe on 6/11/2015.
 */
'use strict';

describe('Analytics Service', function () {
  var analytics;

  beforeEach(function() {
    inject(function(Analytics) {
      analytics = Analytics;
    });
  });

  it('does not accept tracking events without required properties', function() {
    expect(analytics.track('action')).to.throwError();
    expect(analytics.track({'hitType':'pageview','eventCategory':'green'})).to.throwError();
    expect(analytics.track({'hitType':'pageview','eventAction':'eat'})).to.throwError();
    expect(analytics.track({'eventCategory':'green','eventAction':'eat'})).to.throwError();
    expect(analytics.track({'hitType':'pageview'})).to.throwError();
    expect(analytics.track({'eventCategory':'green'})).to.throwError();
    expect(analytics.track({'eventAction':'eat'})).to.throwError();
  });

  it('does not accept tracking events with incorrect hit type', function () {
    expect(analytics.track({'hitType':'moogly','eventCategory':'green','eventAction':'eat'})).to.throwError();
  });

  context('Amplitude', function() {

    before(function() {
      sinon.stub(amplitude, 'setUserId');
      sinon.stub(amplitude, 'logEvent');
      sinon.stub(amplitude, 'setUserProperties');
      sinon.stub(amplitude, 'logRevenue');
    });

    afterEach(function() {
      amplitude.setUserId.reset();
      amplitude.logEvent.reset();
      amplitude.setUserProperties.reset();
      amplitude.logRevenue.reset();
    });

    after(function() {
      amplitude.setUserId.restore();
      amplitude.logEvent.restore();
      amplitude.setUserProperties.restore();
      amplitude.logRevenue.restore();
    });

    it('sets up tracking when user registers', function() {
      analytics.register();
      expect(amplitude.setUserId).to.have.been.calledOnce;
    });

    it('sets up tracking when user logs in', function() {
      analytics.login();
      expect(amplitude.setUserId).to.have.been.calledOnce;
    });

    it('tracks a simple user action', function() {
      analytics.track({'hitType':'event','eventCategory':'behavior','eventAction':'cron'});
      expect(amplitude.logEvent).to.have.been.calledOnce;
      expect(amplitude.logEvent).to.have.been.calledWith('cron',{'hitType':'event','eventCategory':'behavior','eventAction':'cron'});
    });

    it('tracks a user action with additional properties', function() {
      analytics.track({'hitType':'event','eventCategory':'behavior','eventAction':'cron','booleanProperty':true,'numericProperty':17,'stringProperty':'bagel'});
      expect(amplitude.logEvent).to.have.been.calledOnce;
      expect(amplitude.logEvent).to.have.been.calledWith('cron',{'hitType':'event','eventCategory':'behavior','eventAction':'cron','booleanProperty':true,'numericProperty':17,'stringProperty':'bagel'});
    });

    it('updates user-level properties', function() {
      analytics.updateUser({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
      expect(amplitude.setUserProperties).to.have.been.calledOnce;
      expect(amplitude.setUserProperties).to.have.been.calledWith({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    });

    it('tracks revenue from purchases', function() {
      analytics.revenue(0.25,20,'Gems');
      expect(amplitude.logRevenue).to.have.been.calledOnce;
      expect(amplitude.logRevenue).to.have.been.calledWith(0.25,20,'Gems');
    });

  });

  context('Google Analytics', function() {

    before(function() {
      sinon.stub(ga);
    });

    afterEach(function() {
      ga.reset();
    });

    after(function() {
      ga.restore();
    });

    it('sets up tracking when user registers', function() {
      analytics.register();
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('set');
    });

    it('sets up tracking when user logs in', function() {
      analytics.login();
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('set');
    });

    it('tracks a simple user action', function() {
      analytics.track({'hitType':'event','eventCategory':'behavior','eventAction':'cron'});
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('send',{'hitType':'event','eventCategory':'behavior','eventAction':'cron'});
    });

    it('tracks a user action with additional properties', function() {
      analytics.track({'hitType':'event','eventCategory':'behavior','eventAction':'cron','booleanProperty':true,'numericProperty':17,'stringProperty':'bagel'});
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('send',{'hitType':'event','eventCategory':'behavior','eventAction':'cron','booleanProperty':true,'numericProperty':17,'stringProperty':'bagel'});
    });

    it('updates user-level properties', function() {
      analytics.updateUser({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
      expect(ga).to.have.been.calledOnce;
      expect(ga).to.have.been.calledWith('set',{'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    });

  });

  context('Mixpanel', function() {

    before(function() {
      sinon.stub(mixpanel, 'alias');
      sinon.stub(mixpanel, 'identify');
      sinon.stub(mixpanel, 'track');
      sinon.stub(mixpanel, 'register');
    });

    afterEach(function() {
      mixpanel.alias.reset();
      mixpanel.identify.reset();
      mixpanel.track.reset();
      mixpanel.register.reset();
    });

    after(function() {
      mixpanel.alias.restore();
      mixpanel.identify.restore();
      mixpanel.track.restore();
      mixpanel.register.restore();
    });

    it('sets up tracking when user registers', function() {
      analytics.register();
      expect(mixpanel.alias).to.have.been.calledOnce;
    });

    it('sets up tracking when user logs in', function() {
      analytics.login();
      expect(mixpanel.identify).to.have.been.calledOnce;
    });

    it('tracks a simple user action', function() {
      analytics.track({'hitType':'event','eventCategory':'behavior','eventAction':'cron'});
      expect(mixpanel.track).to.have.been.calledOnce;
      expect(mixpanel.track).to.have.been.calledWith('cron',{'hitType':'event','eventCategory':'behavior','eventAction':'cron'});
    });

    it('tracks a user action with additional properties', function() {
      analytics.track({'hitType':'event','eventCategory':'behavior','eventAction':'cron','booleanProperty':true,'numericProperty':17,'stringProperty':'bagel'});
      expect(mixpanel.track).to.have.been.calledOnce;
      expect(mixpanel.track).to.have.been.calledWith('cron',{'hitType':'event','eventCategory':'behavior','eventAction':'cron','booleanProperty':true,'numericProperty':17,'stringProperty':'bagel'});
    });

    it('updates user-level properties', function() {
      analytics.updateUser({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
      expect(mixpanel.register).to.have.been.calledOnce;
      expect(mixpanel.register).to.have.been.calledWith({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    });

  });

});
