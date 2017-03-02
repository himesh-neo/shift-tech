
module.exports = {

    'facebookAuth' : {
        'clientID'      : '205028349977444', // your App ID
        'clientSecret'  : '08df162fa0e9ea4ea6d0f93319a88495', // your App Secret
        'callbackURL'   : 'http://connected-back.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'i5dsdrVLpDy90hvlnJg4uj2ke',
        'consumerSecret'    : 'UhI89YHxEOzkmlLSpZ7owYcGS7Ob18M7Og2Yd0CNZwKJ64Y36H',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};
