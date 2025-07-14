document.addEventListener('DOMContentLoaded', () => {
    console.log('Foosball App loaded');
    
    // Check server health
    fetch('/api/health')
        .then(response => response.json())
        .then(data => {
            console.log('Server health:', data);
            const appContent = document.getElementById('app-content');
            appContent.innerHTML = `
                <div class="status-card">
                    <h3>Server Status</h3>
                    <p>Status: ${data.status}</p>
                    <p>Message: ${data.message}</p>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error checking server health:', error);
            const appContent = document.getElementById('app-content');
            appContent.innerHTML = `
                <div class="status-card error">
                    <h3>Server Status</h3>
                    <p>Error connecting to server</p>
                </div>
            `;
        });
});
