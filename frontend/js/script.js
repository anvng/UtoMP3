document.getElementById('convertBtn').addEventListener('click', async () => {
    const youtubeLink = document.getElementById('youtubeLink').value;

    if (!youtubeLink) {
        alert('Please enter a YouTube link.');
        return;
    }

    document.getElementById('result').textContent = 'Converting... Please wait.';

    try {
        const response = await fetch('http://localhost:3001/convert', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ link: youtubeLink })
        });

        const data = await response.json();

        if (data.message === 'Conversion successful!') {
            document.getElementById('result').innerHTML = `Conversion complete! <a href="${data.file}" target="_blank">Download MP3</a>`;
        } else {
            document.getElementById('result').textContent = 'Conversion failed. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'An error occurred. Please try again.';
    }
});
