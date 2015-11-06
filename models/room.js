module.exports = {
    identity: 'room',
    connection: 'default',

    attributes: {
        number: {
            type: 'integer',
            unique: true
        },
        occupied: {
            type: 'boolean',
            defaultsTo: false,
            boolean: true,
            required: true
        },
        residents: {
            collection: 'resident',
            via: 'room',
            dominant: true
        },
        user: {
            model: 'user'
        }
    }
};
