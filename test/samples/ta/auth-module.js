/* The example authentication module */
function authModule () {
    var users = {
        'mohan' : { pwd : 'xyzw', ctr : 0 },
        'shyam' : { pwd : 'abcd', ctr : 0 },
        'venkat' : { pwd : 'pwra', ctr : 0 },
        'joe' : { pwd : 'iuwe', ctr : 0 },
        'harry' : { pwd : 'njnd', ctr : 0 },
        'azam' : { pwd : 'lkls', ctr : 0 },
    };


    this.login = function (params) {
        var response = { status: 200, logged_in: false };
        var userRecord = users[params.username];
        if (userRecord != null) {
            if (userRecord.ctr >= 3) {
                userRecord.ctr++;
                response.msg = 'Account blocked';
            }
            else if (userRecord.pwd === params.password) {
                response.logged_in = true;
                userRecord.ctr = 0; // reset the ctr
            } else {
                userRecord.ctr++;
                response.msg = 'Incorrect password';
            }
        } else {
            response.msg = 'Incorrect username';
        }
        return response;
    }

    this.logout = function (params) {
        var userRecord = users[params.username];
        var response = { status: 200};
        if (userRecord != null) {
            response.logged_in = false;
            response.msg = 'Successfully logged out';
        }
        else {
            response.msg = 'Incorrect logout attempt';
        }
        return response;
    }

}

module.exports = new authModule();
