const { RequestManager } = require('../dist/index')

const requestManager = new RequestManager({
    address: 'localhost',
    port: 8080,
    identifier: 'Example1' // your identifier
})

requestManager.init().then(() => {
    requestManager.request(
        'Example2',
        'https://api.iipify.org/?format=json'
    )
        .then((response) => {
            console.log('your response', response)
        })
        .catch((error) => {
            console.error('your error', error)
        });
})