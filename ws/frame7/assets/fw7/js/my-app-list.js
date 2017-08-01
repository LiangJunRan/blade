var device = Framework7.prototype.device;

// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;
var $ = $$;

// change skin
if (device.iphone) {
    console.log('this is iPhone');
    $$('.android-css').remove();
} else if (device.android) {
    console.log('This is android');
    $$('.ios-css').remove();
} else {
    console.log('Unknow OS, see:', device);
    $$('.android-css').remove();
}

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true,         //enable inline pages
    swipePanel: 'left'
});

