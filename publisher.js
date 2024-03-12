const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')
var http = require("http");

var interval = setInterval( function() {
    sendData()
    },3000)


client.on('message', () => {
console.log('message')
})

function sendData()
{
console.log('publishing')

http.get('http://devices.webofthings.io/pi/sensors/temperature/', {headers: { 'Accept': 'application/json' }}, (response) => {
    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        const temperatureData = JSON.parse(data)
        //console.log(temperatureData)
        client.publish('app/temp',("Temperature:"+temperatureData.value).toString())

    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

console.log('published')
}

function randomInt (low, high) {
return Math.floor(Math.random() * (high - low) + low);
}
