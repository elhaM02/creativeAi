'use strict'

const socket = io('http://localhost:3000');
        
socket.on('connect', () => {
    console.log('user connected')
})

socket.on('message', (message) => {
    console.log(message);
})

socket.on('aiResponse', (response) => {
    displayMessage('Ai', response)
    console.log(response)
})

const sendButton = document.querySelector('.input-send-icon');
const input = document.querySelector('.message_input');

sendButton.addEventListener('click', () => {
    socket.emit('userMessage', input.value)
    displayMessage('you', input.value)
    input.value = '';
})

window.addEventListener('keydown', (e) => {
    if(e.keyCode == 13) {
        socket.emit('userMessage', input.value)
        displayMessage('you', input.value);
        input.value = '';
        console.log('enter')
        return;
    }
})



let currentDate = new Date();

function displayMessage(sender, message) {

    let currentTime = getCurrentTime(currentDate);
    const conversation = document.querySelector('.conversation');
    const sender_element = document.querySelector('.sender');
    const time_element = document.querySelector('.time');

    let senderClass = sender == 'you'? 'message-box-you': 'message-box-others'

    conversation.innerHTML += 
    `
        <div class="message-box ${senderClass}">
            <div class="sender"> ${sender} </div>
                <div class="message-text">
                    ${message}
                </div>
            <div class="time"> ${currentTime} </div>
        </div>
    `
    conversation.scroll({ top: conversation.scrollHeight, behavior: 'smooth' });
}

displayMessage('you', 'was good cuz')

function getCurrentTime(date) {
    // Get hours and minutes from the date
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always have two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Return the formatted time
    return `${hours}:${formattedMinutes} ${period}`;
}
