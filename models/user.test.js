var expect = require("chai").expect;
var bcrypt = require('bcryptjs');

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('./user');
var roomCollection = require('./room');
var residentCollection = require('./resident');

var User;

before(function (done) {
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(roomCollection));
    orm.loadCollection(Waterline.Collection.extend(residentCollection));
    waterlineConfig.connections.default.adapter = 'memory';

    orm.initialize(waterlineConfig, function (err, models) {
        if (err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {

    function getUserData() {
        return {
            email: 'asd@asd.hu',
            name: 'Teszt Elek',
            password: 'jelszo'
        };
    }

    beforeEach(function (done) {
        User.destroy({}, function (err) {
            done();
        });
    });

    it('should be able to create a user with email + password', function () {
        return User.create({
                email: 'asd@asd.hu',
                name: 'Teszt Elek',
                password: 'jelszo',
            })
            .then(function (user) {
                expect(user.email).to.equal('asd@asd.hu');
                expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
                expect(user.fbid).to.be.an('undefined');
                expect(user.name).to.equal('Teszt Elek');
                expect(user.hasRoom).to.be.false;
                expect(user.role).to.equal('user');
            });
    });

    it('should be able to create a user with facebook', function () {
        return User.create({
                email: 'asd@asd.hu',
                name: 'Teszt Elek',
                fbid: '123',
            })
            .then(function (user) {
                expect(user.email).to.equal('asd@asd.hu');
                expect(user.password).to.be.an('undefined');
                expect(user.fbid).to.equal('123');
                expect(user.name).to.equal('Teszt Elek');
                expect(user.hasRoom).to.be.false;
                expect(user.role).to.equal('user');
            });
    });

    it('registrate with facebook then change password', function () {
        User.create({
                email: 'asd@asd.hu',
                name: 'Teszt Elek',
                fbid: '123',
            })
            .then(function (user) {
            });
        return User.update({
                email: 'asd@asd.hu'
            }, {
                password: 'titok'
            })
            .then(function (user) {
                expect(user[0].email).to.equal('asd@asd.hu');
                expect(bcrypt.compareSync('titok', user[0].password)).to.be.true;
                expect(user[0].fbid).to.equal('123');
                expect(user[0].name).to.equal('Teszt Elek');
                expect(user[0].hasRoom).to.be.false;
                expect(user[0].role).to.equal('user');
            });

    });

    it('should be able to find a user', function () {
        return User.create({
                email: 'asd@asd.hu',
                name: 'Teszt Elek',
                password: 'jelszo',
            })
            .then(function (user) {
                return User.findOneByEmail(user.email);
            })
            .then(function (user) {
                expect(user.email).to.equal('asd@asd.hu');
                expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
                expect(user.fbid).to.be.an('undefined');
                expect(user.name).to.equal('Teszt Elek');
                expect(user.hasRoom).to.be.false;
                expect(user.role).to.equal('user');
            });
    });

    describe('#validPassword', function () {
        it('should return true with right password', function () {
            return User.create(getUserData())
                .then(function (user) {
                    expect(user.validPassword('jelszo')).to.be.true;
                });
        });
        it('should return false with wrong password', function () {
            return User.create(getUserData())
                .then(function (user) {
                    expect(user.validPassword('titkos')).to.be.false;
                });
        });
    });
});
