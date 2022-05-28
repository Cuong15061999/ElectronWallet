var mongoose = require('mongoose');
var express = require('express');
var app = express();
var User = require('../models/user');
var AtmCard = require('../models/AtmCard')
var PhoneCard = require('../models/PhoneCard')
var secret = require('../secret.js')

const mongoconnect = {
    connectDB: function () {
        switch (app.get('env')) {
            case 'development':
                mongoose.connect(secret.mongo.dev.conn, { keepAlive: true, keepAliveInitialDelay: 300000 }).then(() => {
                    console.log('Database connected - Dev');
                });
                break;
            case 'production':
                mongoose.connect(secret.mongo.product.conn, { keepAlive: true, keepAliveInitialDelay: 300000 }).then(() => {
                    console.log('Database connected - Product');
                });;
                break;
            default:
                throw new Error('Unknow execution environment: ' + app.get('env'));
        }
        User.find(function (err, users) {
            if (users.length) {
                return;
            } else {
                new User({
                    phone: '0767113948',
                    email: 'nhokpon4@gmail.com',
                    fullname: 'Pham Vu Quoc Cuong',
                    birthDay: new Date('1999-06-15'),
                    address: '108/4 Tran Mai Ninh P12 Q Tan Binh',
                    Photos: [],

                    username: 'admin12345',
                    password: 'admin1',
                    CreateAt: new Date('1999-06-15'),
                    Money: 10000000,

                    role: 'admin', //admin and user
                    newUser: 1, //0 la` user moi, 1 la` user cu
                    failCount: 0,// that bai 3 lan` se~ bi 'Dang nhap bat thuong', 3 lan` sai nua se bi 'Vo Hieu Hoa'
                    actStatus: 'Xac Minh', //'Xac Minh', 'Cho Xac Minh','Cho Cap Nhat','Vo Hieu Hoa'
                    loginStatus: '0',//'0', 'Dang nhap bat thuong'

                }).save(function (err) {
                    if (err) throw err;
                    console.log('First user successfully saved.');
                });
            }
        })
        AtmCard.find(function (err, atmcards) {
            if (atmcards.length) {
                return;
            } else {
                new AtmCard({
                    STT: 1,
                    cardNumber: 111111,
                    expiredAt: new Date('2022-10-10'),//tg het han.
                    CVV: 411,
                    Note: 'Unlimited deposit',
                },
                ).save(function (err) {
                    if (err) throw err;
                    console.log('successfully Create Atm Cards infomation 1');
                });
                new AtmCard({
                    STT: 2,
                    cardNumber: 222222,
                    expiredAt: new Date('2022-11-11'),//tg het han.
                    CVV: 443,
                    Note: 'Unlimited deposit, but only deposit 1 mil/time',
                },
                ).save(function (err) {
                    if (err) throw err;
                    console.log('successfully Create Atm Cards infomation 2');
                });
                new AtmCard({
                    STT: 3,
                    cardNumber: 333333,
                    expiredAt: new Date(2022 - 12 - 12),//tg het han.
                    CVV: 577,
                    Note: 'Always out of money',
                },
                ).save(function (err) {
                    if (err) throw err;
                    console.log('successfully Create Atm Cards infomation 3');
                });
            }
        })
        PhoneCard.find(function (err, phonecards) {
            if (phonecards.length) {
                return;
            } else {
                new PhoneCard({
                    STT: 1,//enter wrong number mes'the ko duoc ho tro.'
                    cardName: 'Viettel',
                    cardNumber: 11111,

                }).save(function (err) {
                    if (err) throw err;
                    console.log('successfully Phone Card info 1');
                });
                new PhoneCard({
                    STT: 2,//enter wrong number mes'the ko duoc ho tro.'
                    cardName: 'Mobi',
                    cardNumber: 22222,

                }).save(function (err) {
                    if (err) throw err;
                    console.log('successfully Phone Card info 2');
                });
                new PhoneCard({
                    STT: 3,//enter wrong number mes'the ko duoc ho tro.'
                    cardName: 'Vina',
                    cardNumber: 33333,

                }).save(function (err) {
                    if (err) throw err;
                    console.log('successfully Phone Card info 3');
                });
            }
        })
    }
}
module.exports = mongoconnect