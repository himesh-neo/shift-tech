
module.exports = {

    'facebookAuth' : {
        'clientID'      : '265226530572106', // your App ID
        'clientSecret'  : '6203a21710bc37ee8523568bbb6abb9b', // your App Secret
        'callbackURL'   : ' http://connected-back.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'i5dsdrVLpDy90hvlnJg4uj2ke',
        'consumerSecret'    : 'UhI89YHxEOzkmlLSpZ7owYcGS7Ob18M7Og2Yd0CNZwKJ64Y36H',
        'callbackURL'       : 'http://connected-back.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};
