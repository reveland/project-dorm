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
            boolean: true
        },
        residents: {
            collection: 'resident',
        }
    }
};