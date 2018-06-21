'use strict';

let mongoose = require('mongoose')
let Log = mongoose.model('Log')
let core = require('../../libs/core')

//列表
exports.list = function(req, res) {
    let condition = {};
    if(req.Roles && req.Roles.indexOf('admin') < 0) {
        condition.author = req.session.user._id;
    }
    Log.count(condition, function(err, total) {
        let query = Log.find(condition);
        //分页
        let pageInfo = core.createPage(req.query.page, total);
        //console.log(pageInfo);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            //console.log(err, results);
            res.render('server/log/list', {
                //title: '列表',
                homepage:req.app.locals.homepage,
                data: results,
                pageInfo: pageInfo
            });
        })
    })
};

//单条
exports.one = function(req, res) {
    let id = req.params.id;
    Log.findById(id).populate('author', 'username name').exec(function(err, result) {
        core.logger.info(result);
        if(!result) {
            return res.render('server/info', {
                homepage:req.app.locals.homepage,
                message: '该页面不存在'
            });
        }
        res.render('server/log/item', {
            homepage:req.app.locals.homepage,
            data: result
        });
    });
};
//删除
exports.del = function(req, res) {
    let id = req.params.id;
    Log.findById(id).populate('author').exec(function(err, result) {
        if(!result) {
            return res.render('server/info', {
                homepage:req.app.locals.homepage,
                message: '留言不存在'
            });
        }
        let isAdmin = req.Roles && req.Roles.indexOf('admin') > -1;
        let isAuthor = result.author && ((result.author._id + '') === req.session.user._id);

        if(!isAdmin && !isAuthor) {
            return res.render('server/info', {
                homepage:req.app.locals.homepage,
                message: '沒有權限'
            });
        }
        core.logger.info(result)
        result.remove(function(err) {
            if (req.xhr) {
                return res.json({
                    status: !err
                });
            }
            if(err) {
                return res.render('server/info', {
                    homepage:req.app.locals.homepage,
                    message: '删除失败'
                });
            }
            res.render('server/info', {
                homepage:req.app.locals.homepage,
                message: '删除成功'
            })
        });
    });
};
