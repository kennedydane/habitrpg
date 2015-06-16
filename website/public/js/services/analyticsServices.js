/**
 * Created by Sabe on 6/15/2015.
 */
'use strict';

angular
  .module('habitrpg')
  .factory('Analytics', analyticsFactory);

analyticsFactory.$inject = [
  'User'
];

function analyticsFactory(User) {

  var user = User.user;

  // Analytics providers should only be active in production
  if (window.env.NODE_ENV === 'production') {

    // Amplitude
    (function(e,t){var r=e.amplitude||{};var n=t.createElement("script");n.type="text/javascript";
      n.async=true;n.src="https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-2.2.0-min.gz.js";
      var s=t.getElementsByTagName("script")[0];s.parentNode.insertBefore(n,s);r._q=[];
      function a(e){r[e]=function(){r._q.push([e].concat(Array.prototype.slice.call(arguments,0)));
      }}var i=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties"];
      for(var o=0;o<i.length;o++){a(i[o])}e.amplitude=r})(window,document);
    amplitude.init(window.env.AMPLITUDE_KEY);

    // Google Analytics (aka Universal Analytics)
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', window.env.GA_ID, 'auto');

    // Mixpanel
    (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
    mixpanel.init(window.env.MIXPANEL_TOKEN);
  }

  function register() {
    amplitude.setUserId(user._id);
    ga('set', {'userId':user._id});
    mixpanel.alias(user._id);
  }

  function login() {
    amplitude.setUserId(user._id);
    ga('set', {'userId':user._id});
    mixpanel.identify(user._id);
  }

  function track(properties) {
    var REQUIRED_FIELDS = ['hitType','eventCategory','eventAction'];
    var ALLOWED_HIT_TYPES = ['pageview','screenview','event','transaction','item','social','exception','timing'];
    if (_.pick(properties, REQUIRED_FIELDS).length !== REQUIRED_FIELDS.length) {
      return console.log('Analytics calls must include the following properties: ' + JSON.stringify(REQUIRED_FIELDS));
    }
    if (!_.includes(ALLOWED_HIT_TYPES, properties.hitType)) {
      return console.log('Hit type of Analytics event must be one of the following: ' + JSON.stringify(ALLOWED_HIT_TYPES));
    }

    amplitude.logEvent(properties.eventAction,properties);
    mixpanel.track(properties.eventAction,properties);
    ga('send',properties);
  }

  function updateUser(properties) {
    if (!properties) properties = {};

    properties.UUID = user._id;
    properties.Class = user.stats.class;
    properties.Experience = Math.floor(user.stats.exp);
    properties.Gold = Math.floor(user.stats.gp);
    properties.Health = Math.ceil(user.stats.hp);
    properties.Level = user.stats.lvl;
    properties.Mana = Math.floor(user.stats.mp);
    properties.contributorLevel = user.contributor.level;
    properties.subscription = user.purchased.plan.planId;

    amplitude.setUserProperties(properties);
    ga('set',properties);
    mixpanel.register(properties);
  }

  function revenue() {

  }

  return {
    register: register,
    login: login,
    track: track,
    updateUser: updateUser,
    revenue: revenue
  };

}
