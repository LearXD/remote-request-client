const { RequestManager } = require('../dist/index')

const requestManager = new RequestManager({
    address: 'localhost',
    port: 8080,
    identifier: 'LearXD' // your identifier
})

requestManager.init().then(() => {
    requestManager.request(
        'LearXD', // sending to myself
        'https://api.ipify.org/?format=json'
    ).then((response) => {
        console.log(response)
    })
})