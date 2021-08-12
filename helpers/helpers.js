module.exports = {
    isMultipartRequest: (req) => {
        let contentTypeHeader = req.headers['content-type'];
        return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
    }
}
