var bcrypt = require('bcryptjs');

module.exports = {
    identity: 'user',
    connection: 'default',

    attributes: {

        email: {
            type: 'string',
            unique: true,
            required: true
        },
        password: {
            type: 'string'
        },
        fbid: {
            type: 'string',
            unique: true
        },
        name: {
            type: 'string',
        },
        hasRoom: {
            type: 'boolean',
            defaultsTo: false,
            boolean: true,
            required: true
        },
        room: {
            model: 'room'
        },
        role: {
            type: 'string',
            enum: ['user', 'operator'],
            required: true,
            defaultsTo: 'user'
        },
        validPassword: function (password) {
            if (typeof this.password !== 'undefined') {
                return bcrypt.compareSync(password, this.password);
            }
            else {
                return true;
            }
        }
    },

    beforeUpdate: function (values, next) {
        if (typeof values.password !== 'undefined') {
            console.log('if')
            bcrypt.hash(values.password, 10, function (err, hash) {
                if (err) {
                    return next(err);
                }
                values.password = hash;
                next();
            });
        }
        else {
            console.log('else')
            next();
        }
    },

    beforeCreate: function (values, next) {
        if (typeof values.password !== 'undefined') {
            console.log('if')
            bcrypt.hash(values.password, 10, function (err, hash) {
                if (err) {
                    return next(err);
                }
                values.password = hash;
                next();
            });
        }
        else {
            console.log('else')
            next();
        }

    }
};
