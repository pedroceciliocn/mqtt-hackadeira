const { WebSocketServer } = require('ws')
const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://broker.hivemq.com')
const sockserver = new WebSocketServer({ port: 443 })

var topics=[];

sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))

    ws.on('message', data => {
        sockserver.clients.forEach(clienthtml => {
            console.log(`distributing message: ${data}`)
            client.unsubscribe(topics)
            topics.push(data.toString())
            console.log(topics)
            client.subscribe(topics)
        })
    })

    ws.onerror = function () {
        console.log('websocket error')
    }
})

client.on('connect', () => {
    console.log('connected')
    client.subscribe(topics)
})

client.on('message', (topic, message) => {
    //console.log('received message | Topic: %s - Message: %s', topic.toString(), message.toString())
    sockserver.clients.forEach(clienthtml => {
        clienthtml.send(message.toString())
    })
});






