document.addEventListener('DOMContentLoaded', () => {
    // Initialize Clipboard.js
    const clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', (e) => {
        const originalText = e.trigger.textContent;
        e.trigger.textContent = '¡Copiado!';
        e.trigger.classList.add('copied'); // Add a class for the copied state
        
        setTimeout(() => {
            e.trigger.textContent = originalText;
            e.trigger.classList.remove('copied'); // Remove the class
        }, 2000);
        
        e.clearSelection();
    });

    clipboard.on('error', (e) => {
        console.error('Error al copiar:', e);
    });

    // Dark/Light Theme Toggle
    const themeSwitch = document.getElementById('theme-switch');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeSwitch) {
            themeSwitch.checked = savedTheme === 'dark';
        }
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            if (themeSwitch.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Points Modal Logic
    const aboutPointsBtn = document.getElementById('about-points-btn');
    const pointsModal = document.getElementById('points-modal');
    const closeModal = document.querySelector('.close-modal');

    if (aboutPointsBtn && pointsModal && closeModal) {
        aboutPointsBtn.addEventListener('click', () => {
            pointsModal.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            pointsModal.style.display = 'none';
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target === pointsModal) {
                pointsModal.style.display = 'none';
            }
        });
    }

    // User List Modal Logic
    const userListBtn = document.getElementById('user-list-btn');
    const userListModal = document.getElementById('user-list-modal');
    const userListCloseModal = userListModal ? userListModal.querySelector('.close-modal') : null;

    if (userListBtn && userListModal && userListCloseModal) {
        userListBtn.addEventListener('click', async () => {
            userListModal.style.display = 'block';
            await obtenerMonedas();
        });

        userListCloseModal.addEventListener('click', () => {
            userListModal.style.display = 'none';
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target === userListModal) {
                userListModal.style.display = 'none';
            }
        });
    }

    // User search functionality
    const userSearchInput = document.getElementById('user-search-input');
    
    if (userSearchInput) {
        userSearchInput.addEventListener('input', () => {
            const searchTerm = userSearchInput.value.toLowerCase().trim();
            const tableRows = document.querySelectorAll('#userPixelsTableBody tr');
            
            tableRows.forEach(row => {
                const username = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if (username.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Function to fetch and display user pixels
    async function obtenerMonedas() {
        // Placeholder for future implementation
        const tabla = document.getElementById("userPixelsTableBody");
        if (tabla) {
            tabla.innerHTML = "<tr><td colspan='3'>Función próximamente disponible</td></tr>";
        }
    }

    // YouTube Live Stream Status and Button
    const YOUTUBE_API_KEY = "AIzaSyBpxpp6JtjZywOdfmfQI4T5YrWBNOU1kUo";
    const CHANNEL_ID = "UCakmZ-huWfbMtKm4ByTkjVg";
    const youtubeChannelBtn = document.getElementById("youtube-channel-btn");
    const youtubeBtnText = document.getElementById("youtube-btn-text");

    async function verificarEnVivo() {
        try {
            const estadoStream = document.getElementById("estadoStream");
            if (!estadoStream) {
                console.error("estadoStream element not found");
                return;
            }

            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${YOUTUBE_API_KEY}`);
            const data = await response.json();

            if (!youtubeChannelBtn || !youtubeBtnText) {
                console.error("YouTube channel button or text not found");
                return;
            }

            // Null/undefined check for data.items
            if (data.items && data.items.length > 0) {
                // Live Stream is active
                estadoStream.innerHTML = `
                    <span class="stream-status-dot stream-status-dot--live"></span>
                    <span class="stream-status-text">EN VIVO</span>
                `;
                
                // Set button to go to live stream
                youtubeChannelBtn.href = `https://www.youtube.com/channel/${CHANNEL_ID}/live`;
                youtubeBtnText.textContent = "IR AL DIRECTO";
            } else {
                // Not live, redirect to channel
                estadoStream.innerHTML = `
                    <span class="stream-status-dot stream-status-dot--offline"></span>
                    <span class="stream-status-text">OFFLINE</span>
                `;
                
                youtubeChannelBtn.href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
                youtubeBtnText.textContent = "Ir al Canal";
            }
        } catch (error) {
            console.error("Error al verificar el estado del stream:", error);
            
            const estadoStream = document.getElementById("estadoStream");
            if (estadoStream) {
                estadoStream.innerHTML = `
                    <span class="stream-status-dot stream-status-dot--offline"></span>
                    <span class="stream-status-text">ERROR</span>
                `;
            }
            
            if (youtubeChannelBtn) {
                youtubeChannelBtn.href = `https://www.youtube.com/channel/${CHANNEL_ID}`;
            }
            if (youtubeBtnText) {
                youtubeBtnText.textContent = "Ir al Canal";
            }
        }
    }

    // YouTube Menu Toggle
    const youtubeMenuBtn = document.getElementById('youtube-menu-btn');
    const youtubeMenuDropdown = document.getElementById('youtube-menu-dropdown');

    if (youtubeMenuBtn && youtubeMenuDropdown) {
        youtubeMenuBtn.addEventListener('click', () => {
            youtubeMenuDropdown.style.display = 
                youtubeMenuDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!youtubeMenuBtn.contains(event.target) && 
                !youtubeMenuDropdown.contains(event.target)) {
                youtubeMenuDropdown.style.display = 'none';
            }
        });
    }

    // Initial check and periodic updates
    verificarEnVivo();
    setInterval(verificarEnVivo, 30000);
});