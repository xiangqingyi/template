process.env.NODE_ENV=process.env.NODE_ENV || 'development';
console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);
console.log("process.env.APIURL=" + process.env.APIURL);
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app.js');

const clientModel = require('../models/oauth2/client');
const userModel = require('../models/oauth2/o2user');
const util = require('../libs/utils');


//const APIURL = "http://127.0.0.1:" + config.port;
const APIURL=process.env.APIURL || app.listen();
const userID = 'test' + new Date().getTime();

var m_client = {
    'name': userID,
    'clientID': util.uid(16),
    'clientSecret': util.uid(32),
    'createTime': new Date().getTime(),
    'userid': userID,
    'status': 1
};
var user = {
    username: userID,
    password: userID,
    email: userID + '@qq.com',
    phone: new Date().getTime().toString().substr(2),
    captcha: 'local'
};

var token = {};

describe('FoxMember Test', () => {

    before(function () {
        console.log('*************** beforeEach Start *****************');
        // runs before each test in this block

        console.log(m_client);
        console.log(user);
        var client = new clientModel(m_client);
        client.save(function (err) {
            if (err) {
                console.log('Client Save error!');
                console.log(err);
                return;
            }
            console.log('Client Save OK!');
        });

        console.log('*************** beforeEach End *****************');
    });
    after(function () {
        console.log('*************** afterEach *****************');
        // runs after each test in this block
        console.log('Client data remove !!');
        console.log('User data remove !!');
        clientModel.remove({
            clientID: m_client.clientID
        }, function (err, rsp) {
            if (err) {
                console.log('Client remove error!');
                console.log(err);
                return;
            }
        });

        clientModel.remove({
            name: m_client.name + "temp"
        }, function (err, rsp) {
            if (err) {
                console.log('Temp client remove error!');
                console.log(err);
                return;
            }
        });
        userModel.remove({
            username: user.username
        }, function (err) {
            if (err) {
                console.log('user remove error!');
                console.log(err);
                return;
            }
        });
        console.log('*************** afterEach *****************');
    });

    it('User Register', (done) => {
        var key = m_client.clientSecret;
        var iv = util.uid(16); //隨機產生
        var userCrypet = util.encryptText("aes-256-cbc", key, iv, JSON.stringify(user), "base64");

        var registerInfo = {
            client_id: m_client.clientID,
            encryptData: iv + userCrypet
        };
        console.log(registerInfo);
        request(APIURL)
            .post('/api/v1/oauth2/user/register') //post方法
            .send(registerInfo) //添加请求参数
            .set('Content-Type', 'application/json') //设置header的Content-Type为json
            .expect(200) //断言状态码为200
            .end((err, res) => {
                console.log(res.body);
                expect(res.body.code).to.be.equal(10001);
                done();
            });
    });


    it('User Login', (done) => {
        request(APIURL)
            .post('/login') //post方法
            .send(user) //添加请求参数
            .set('Content-Type', 'application/json') //设置header的Content-Type为json
            .expect(200) //断言状态码为200
            .end((err, res) => {
                console.log(res.headers['set-cookie']);
                //断言返回的code是0
                expect(res.headers['set-cookie']).to.be.an('array');
                done();
            });
    });

    it('GET Token', (done) => {
        var data = {
            "grant_type": "password",
            "username": user.username,
            "password": user.password,
            "client_id": m_client.clientID,
            "client_secret": m_client.clientSecret
        };

        request(APIURL)
            .post('/oauth2/token') //post方法
            .send(data) //添加请求参数
            .set('Content-Type', 'application/json') //设置header的Content-Type为json
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //console.log(res.body);
                //断言返回的code是0
                expect(res.body).to.be.an('object');
                user.uid = res.body.uid;
                token = res.body;
                done();
            });
    });


    it('GET API /api/v1/oauth2/user', (done) => {
        var query = {
            "access_token": token.access_token,
            "uid": user.uid
        };
        request(APIURL)
            .get('/api/v1/oauth2/user')
            .query(query)
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //console.log(res.body);
                //断言返回的code是0
                expect(res.body.code).to.be.equal(10002);

                done();
            });
    });


    it('GET API /api/user/find by uid', (done) => {
        var query = {
            "access_token": token.access_token,
            "uid": user.uid
        };
        request(APIURL)
            .get('/api/v1/oauth2/user/find')
            .query(query)
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //console.log(res.body);
                //断言返回的code是0
                expect(res.body.code).to.be.equal(10002);

                done();
            });
    });

    it('GET API /api/v1/oauth2/user/find by phone', (done) => {
        var query = {
            "access_token": token.access_token,
            "phone": user.phone
        };
        request(APIURL)
            .get('/api/v1/oauth2/user/find')
            .query(query)
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //console.log(res.body);
                //断言返回的code是0
                expect(res.body.code).to.be.equal(10002);

                done();
            });
    });

    it('GET API /api/v1/oauth2/user/find by email', (done) => {
        var query = {
            "access_token": token.access_token,
            "email": user.email
        };
        request(APIURL)
            .get('/api/v1/oauth2/user/find')
            .query(query)
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //console.log(res.body);
                //断言返回的code是0
                expect(res.body.code).to.be.equal(10002);

                done();
            });
    });

    it('GET API /api/v1/oauth2/user/find by username', (done) => {
        var query = {
            "access_token": token.access_token,
            "username": user.username
        };
        request(APIURL)
            .get('/api/v1/oauth2/user/find')
            .query(query)
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //console.log(res.body);
                //断言返回的code是0
                expect(res.body.code).to.be.equal(10002);

                done();
            });
    });

    it('GET API /api/v1/oauth2/client', (done) => {
        var query = {
            "access_token": token.access_token
        };
        request(APIURL)
            .get('/api/v1/oauth2/client') //post方法
            .query(query)
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //console.log(res.body);
                //断言返回的code是0
                expect(res.body.code).to.be.equal(10002);

                done();
            });
    });

    it('User Logout', (done) => {
        request(APIURL)
            .get('/logout?redirectURL=/')
            .expect(200) //断言状态码为200
            .end((err, res) => {
                //断言返回的code是0
                //console.log(res.res.headers);
                expect(res.headers['set-cookie']).to.be.not.an('array');
                done();
            });
    });


});