const { RequestManager } = require('../dist/index')

const requestManager = new RequestManager({
    address: 'localhost',
    port: 8080,
    identifier: 'Example2' // your identifier
})

requestManager.init().then(() => {
    console.log('Waiting for request')
})