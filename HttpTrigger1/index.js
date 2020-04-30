module.exports = async function (context, req) {
    context.log('HttpTrigger1 context.log information');
    context.log.error('HttpTrigger1 context.log error');
    console.log("HttpTrigger1 console.log message");
};