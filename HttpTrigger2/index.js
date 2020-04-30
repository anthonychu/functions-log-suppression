module.exports = async function (context, req) {
    context.log('HttpTrigger2 context.log information');
    context.log.error('HttpTrigger2 context.log error');
    console.log("HttpTrigger2 console.log message");
};