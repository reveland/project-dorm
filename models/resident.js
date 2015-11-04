module.exports = {
    identity: 'resident',
    connection: 'default',

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string'
        },
        cond_energy: {
            type: 'integer',
            required: true,
            defaultsTo: 50
        },
        cond_empotional_wb: {
            type: 'integer',
            required: true,
            defaultsTo: 50
        },
        cond_physical_wb: {
            type: 'integer',
            required: true,
            defaultsTo: 50
        },
        cond_money: {
            type: 'integer',
            required: true,
            defaultsTo: 50
        }
    }
};
