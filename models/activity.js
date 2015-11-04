module.exports = {
    identity: 'activity',
    connection: 'default',

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        alter_energy: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        },
        alter_empotional_wb: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        },
        alter_physical_wb: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        },
        alter_money: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        }
    }
};
