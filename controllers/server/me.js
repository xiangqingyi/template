'use strict';

let mongoose = require('mongoose')
let User = mongoose.model('User')
let Role = mongoose.model('Role')
let userController = require('./user')
let _ = require('lodash')
let config = require('../../config')
let core = require('../../libs/core')
const ACTIONS = require('../../actions')

//管理员资料
exports.init = function(req, res) {
    let id = req.session.user._id;
    User.findById(id).populate('roles').exec(function(err, user) {
        if (!user) {
            return res.render('server/info', {
                homepage:req.app.locals.homepage,
                message: '出错了'
            });
        }
        
        let actions = [];
        if (req.Roles.indexOf('admin') > -1) {
            actions = ACTIONS;
        } else {
            actions = ACTIONS.filter(function(item) {
                let items = item.actions.filter(function(act) {
                    return req.Actions.indexOf(act.value) > -1;
                });
                if (items.length > 0) {
                    return item;
                }
            })
        }
        res.render('server/me/item', {
            homepage:req.app.locals.homepage,
            title: '我的资料',
            user: user,
            ACTIONS: actions
        });
    });
};
//修改管理员信息
exports.edit = function(req, res) {
    let id = req.session.user._id;
    if(req.method === 'GET') {
        User.findById(id).populate('roles').exec(function(err, user) {
            let data = _.pick(user, 'name', 'mobile', 'gender', 'birthday');
            res.render('server/me/edit', {
                homepage:req.app.locals.homepage,
                title: '修改资料',
                user: data
            });
        });
    } else if(req.method === 'POST') {
        let obj = req.body;
        User.findById(id).populate('roles').exec(function(err, user) {
            _.assign(user, _.pick(obj, 'name', 'mobile', 'gender', 'birthday'));
            user.save(function(err, result) {
                core.logger.info(err, result);
                if(err || !result) {
                    return res.render('server/info', {
                        homepage:req.app.locals.homepage,
                        message: '修改失败'
                    });
                }
                req.session.user = result;
                res.locals.User = user;
                res.render('server/info', {
                    homepage:req.app.locals.homepage,
                    message: '修改成功'
                });
            })
        });
    }
};
//修改密码
exports.updatePassword = function(req, res) {
    if(req.method === 'GET') {

    } else if(req.method === 'POST') {
        let obj = req.body;
        let oldPassword = obj.oldpassword;
        let password = obj.password;
        let id = req.session.user._id;
        User.findById(id).exec(function(err, user) {
            if (user.authenticate(oldPassword)) {
                user.password = password;
                user.token_version ++;
                user.save(function(err, result) {
                    //console.log('fffffffffffff', result);
                    userController.reload(result._id, function(err, user) {
                        req.session.user = user;
                        res.locals.User = user;
                        res.render('server/info', {
                            homepage:req.app.locals.homepage,
                            message: '密码修改成功'
                        });
                    });
                });
            } else {
                res.render('server/info', {
                    homepage:req.app.locals.homepage,
                    message: '原密码不正确'
                });
            }
        });
    }
};