'use strict';

let  mongoose = require('mongoose');
let User = mongoose.model('User');

let Role = mongoose.model('Role');
let userController = require('./user');
let config = require('../../config');
let core = require('../../libs/core');
let userService = require('../../services/user');
let utils = require('../../libs/utils');

//后台首页
exports.index = function(req, res) {
    if(!req.session.user) {    
        let path = core.translateAdminDir('/user/login');
        return res.redirect(path);
    }
    let obj = {}
    let filter = {};
    if(req.Roles && req.Roles.indexOf('admin') < 0) {
        filter = {author: req.session.user._id};
    }
    res.render('server/index', { 
            homepage:req.app.locals.homepage,
            title: '管理後台',
            data: {}
    })
};

//初始化后台,安装初始数据
exports.install =  function(req, res) {
    if(req.session.user) {
        let path = core.translateAdminDir('');
        return res.redirect(path);
    }
    //检查是否已经有用户
    User.find({}, function(err, results) {
        core.logger.info(err, results);
        if(err) {
            return;
        }
        if(results.length < 1) {
            //满足条件
            if(req.method === 'GET') {
                res.render('server/install', {
                    homepage:req.app.locals.homepage,
                    title: '初始化'
                });
            } else if(req.method === 'POST') {
                let createUser = function(obj) {
                    let user = new User(obj);
                    user.save(function(err, user) {
                        res.render('server/info', {
                            homepage:req.app.locals.homepage,
                            message: '初始化完成'
                        });
                    });
                };
                
                let obj = req.body;
                obj.status = 101;//系统默认管理员
                //检查是否有角色，没有的话创建
                Role.find({status: 201}, function(err, roles) {
                    core.logger.info('查找role', err, roles)
                    if(roles.length < 1) {
                        core.logger.info('没有角色 ' + config.admin.role.admin);
                        let role = new Role({
                            name: config.admin.role.admin,
                            actions: [],
                            status: 201//系统默认管理员角色
                        });
                        role.save(function(err, result) {
                            core.logger.info('role result', result);
                            obj.roles = [role._id];
                            createUser(obj);
                        });
                        //创建普通角色
                        new Role({
                            name: config.admin.role.user,
                            actions: [],
                            status: 202//系统默认用户角色
                        }).save();
                    }else{
                        obj.roles = [roles[0]._id];
                        createUser(obj);
                    }
                })
            }
        }else{
            //已经初始化过，跳过
            let path = core.translateAdminDir('');
            res.redirect(path);
        }
    })
};