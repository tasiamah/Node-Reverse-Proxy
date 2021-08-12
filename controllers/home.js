const express = require('express');
let proxy = require("express-http-proxy");
let helpers = require('../helpers/helpers');
let loginAppRoutes = [
    '/login*',
    '/loginms',
    '/register',
    '/resetPassword',
    '/getActivationKey*',
    '/activateAccount',
    '/logout',
    '/reports',
    '/'
]
let uploadRoutes = [
    '/uploadlogo*',
]
module.exports = (app) => {
    const proxyMiddleware = () => {
        return (req, res, next) => {
            let reqAsBuffer = false;
            let reqBodyEncoding = true;
            let contentTypeHeader = req.headers['content-type'];
            if (helpers.isMultipartRequest(req)) {
                reqAsBuffer = true;
                reqBodyEncoding = null;
            }
            return proxy(process.env.UPLOAD_URL, {
                reqAsBuffer: reqAsBuffer,
                reqBodyEncoding: reqBodyEncoding,
                parseReqBody: false,
                proxyReqOptDecorator: (proxyReq) => {
                    return proxyReq;
                },
                proxyReqPathResolver: (req) => {
                    return `${process.env.UPLOAD_APP_URL}/${req.baseUrl}${req.url.slice(1)}`;
                },
                userResDecorator: (rsp, data, req, res) => {
                    res.set('Access-Control-Allow-Origin', req.headers.origin);
                    return data.toString('utf-8');
                }
            })(req, res, next);
        };
    }
    uploadRoutes.forEach(r => {
        app.use(r, proxyMiddleware());
    })
    loginAppRoutes.forEach(r => {
        app.use(r, proxy(process.env.LOGIN_URL, {
            proxyReqOptDecorator: (proxyReq) => {
                return proxyReq;
            },
            proxyReqPathResolver: (req) => {
                return `${process.env.LOGIN_URL}/${req.baseUrl}${req.url.slice(1)}`;
            },
            userResDecorator: (rsp, data, req, res) => {
                res.set('Access-Control-Allow-Origin', req.headers.origin);
                return data.toString('utf-8');
            }
        }));
    })
};

if (helpers.isMultipartRequest(req)) {
    reqAsBuffer = true;
    reqBodyEncoding = null;
}

proxyReqPathResolver: (req) => {
    return `${process.env.LOGIN_URL}/${req.baseUrl}${req.url.slice(1)}`;
}
