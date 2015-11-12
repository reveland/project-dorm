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
        },

        room: {
            model: 'room',
            via: 'residents'
        },

        doActivity: function(activity) {
            this.cond_energy += activity.alter_energy;
            this.cond_empotional_wb += activity.alter_empotional_wb;
            this.cond_physical_wb += activity.alter_physical_wb;
            this.cond_money += activity.alter_money;
        }
    }
};
