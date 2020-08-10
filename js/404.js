const statusMap = new Map([
    [100, 'Continue'],
    [101, 'Switching Protocols'],
    [102, 'Processing'],
    [103, 'Early Hints'],
    [200, 'OK'],
    [201, 'Created'],
    [202, 'Accepted'],
    [203, 'Non-Authoritative Information'],
    [204, 'No Content'],
    [205, 'Reset Content'],
    [206, 'Partial Content'],
    [207, 'Multi-Status'],
    [208, 'Already Reported'],
    [226, 'IM Used'],
    [300, 'Multiple Choices'],
    [301, 'Moved Permanently'],
    [302, 'Found'],
    [303, 'See Other'],
    [304, 'Not Modified'],
    [305, 'Use Proxy'],
    [306, 'Switch Proxy'],
    [307, 'Temporary Redirect'],
    [308, 'Permanent Redirect'],
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [402, 'Payment Required'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [405, 'Method Not Allowed'],
    [406, 'Not Acceptable'],
    [407, 'Proxy Authentication Required'],
    [408, 'Request Timeout'],
    [409, 'Conflict'],
    [410, 'Gone'],
    [411, 'Length Required'],
    [412, 'Precondition Failed'],
    [413, 'Payload Too Large'],
    [414, 'URI Too Long'],
    [415, 'Unsupported Media Type'],
    [416, 'Range Not Satisfiable'],
    [417, 'Expectation Failed'],
    [418, "I'm a teapot"],
    [421, 'Misdirected Request'],
    [422, 'Unprocessable Entity'],
    [423, 'Locked'],
    [424, 'Failed Dependency'],
    [425, 'Too Early'],
    [426, 'Upgrade Required'],
    [428, 'Precondition Required'],
    [429, 'Too Many Requests'],
    [431, 'Request Header Fields Too Large'],
    [451, 'Unavailable For Legal Reasons'],
    [500, 'Internal Server Error'],
    [501, 'Not Implemented'],
    [502, 'Bad Gateway'],
    [503, 'Service Unavailable'],
    [504, 'Gateway Timeout'],
    [505, 'HTTP Version Not Supported'],
    [506, 'Variant Also Negotiates'],
    [507, 'Insufficient Storage'],
    [508, 'Loop Detected'],
    [510, 'Not Extended'],
    [511, 'Network Authentication Required']
]);

// 1xx: 4
// 2xx: 10
// 3xx: 9
// 4xx: 29
// 5xx: 11
const chances = [2, 4, 5, 4, 3, 4, 1, 4, 4, 2, 3, 4, 4, 4, 4, 5, 4, 4, 3, 3, 2, 4, 1, 5, 4, 2, 4, 4, 5, 2, 5];
const chances2 = [0, 1, 2, 1, 0, 2, 3, 1, 4, 0, 2, 5, 3, 1, 0, 2, 1, 0, 1, 0];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const onPush = e => {
    e.preventDefault();
    const baseSteps = 3;
    const d1Steps = baseSteps + Math.floor(Math.random() * 4);
    const d2Steps = d1Steps + Math.floor(Math.random() * 5);
    const d3Steps = d2Steps + Math.floor(Math.random() * 6);

    let d1Value = 0;
    let d2Value = 0;
    let d3Value = 0;

    const d1Run = async () => {
        const seed = Math.floor(Math.random() * chances.length);
        const elem = document.getElementById('d1');
        for (let i=0; i < d1Steps; i++) {
            const digit = chances[(seed + i) % chances.length];
            elem.value = d1Value = digit;
            await wait(300);
        }
    };

    const d2Run = async () => {
        const seed = Math.floor(Math.random() * 10);
        const elem = document.getElementById('d2');
        for (let i=0; i < d2Steps; i++) {
            const digit = chances2[(seed + i) % chances.length];
            elem.value = d2Value = digit;
            await wait(300);
        }
    };

    const d3Run = async () => {
        const seed = Math.floor(Math.random() * 10);
        const elem = document.getElementById('d3');
        for (let i=0; i < d3Steps; i++) {
            const digit = (seed + i) % 10;
            elem.value = d3Value = digit;
            await wait(300);
        }
    };

    Promise.all([
        d1Run(),
        d2Run(),
        d3Run()
    ]).then(() => {
        const statusCode = d1Value * 100 + d2Value * 10 + d3Value;
        const resultElem = document.getElementById('result');
        if (statusMap.has(statusCode)) {
            resultElem.value = statusMap.get(statusCode);
        } else {
            resultElem.value = 'Bruh what is that status code';
        }
    });
};

document.getElementById('try').addEventListener('click', onPush);
