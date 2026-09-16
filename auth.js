/* PharmaAuth — disabled (no Google / Facebook / Instagram / profile login)
   Data (favorites, notes, custom drugs) stays on this device via localStorage.
   Use Backup → Export / Import to move data between devices.
*/
(function () {
  'use strict';
  window.PharmaAuth = {
    init: function () {},
    push: function () {},
    pull: function () {},
    getUser: function () { return null; },
    isReady: function () { return true; },
    isConfigured: function () { return false; }
  };
})();
