import * as Sentry from "@sentry/node";
// or using CommonJS
// const Sentry = require('@sentry/node');

function init() {
    Sentry.init({
        dsn:
            "https://78492c7702f34b26aba120451fd04a4d@o362531.ingest.sentry.io/5221848",
    });
}

function log(error) {
    Sentry.captureException(error);
}

export default {
    init,
    log,
};
