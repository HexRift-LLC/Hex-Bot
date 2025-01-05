// Dashboard Control Functions
function startBot() {
    fetch('/api/bot/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            window.location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}

function stopBot() {
    fetch('/api/bot/stop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            window.location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}

function restartBot() {
    fetch('/api/bot/restart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            window.location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}
