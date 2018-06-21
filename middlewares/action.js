'use strict';

let _ = require('lodash')

// 检查权限中间件
exports.checkAction = function(actionName) {
    //console.log(actionName)
    return function (req, res, next) {
        //console.log(req.Actions, 'action middleware ')
        //console.log(req.user, 'user ++++++++++++++++')
        if (req.Roles && req.Roles.indexOf('admin') > -1) {
            return next();
        }
        let result = false;

        if (_.isArray(actionName)) {
            result = _.intersection(req.Actions, actionName).length === actionName.length;
        } else if(_.isString(actionName)) {
            result = req.Actions.indexOf(actionName) > -1;
        }

        if (result) {
            return next();
        } else {
            if (req.jwt) {
                return res.json({
                    success: false,
                    msg: '無權訪問'
                })    
            }
            
            if (req.xhr) {
                res.json({
                    success: false,
                    msg: '無權訪問'
                })
            } else {
                res.render('server/info', {
                    homepage:req.app.locals.homepage,
                    message: '無權訪問'
                });
            }
        }
    };
}