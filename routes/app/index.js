'use strict';
/**
 ** 
 **
 */
let express = require('express')
let router = express.Router()
let core = require('../../libs/core')
let index = require('../../controllers/app/index')

//首页
router.use(function(req, res, next) {
    //console.log('首页: ' + Date.now());
    res.locals.Path = 'index';
    next();
});
router.get(['/','/index'], index.index);

module.exports = function(app) {  
    let path = core.translateHomePageDir('/');
    app.use(path, router);
};
