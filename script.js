// Screen navigation functionality
function showScreen(screenNumber) {
    console.log('showScreen called with:', screenNumber);
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        console.log('Removed active from:', screen.id);
    });
    
    // Show the selected screen
    const targetScreen = document.getElementById(`screen${screenNumber}`);
    
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Added active to:', targetScreen.id);
        
        // Special handling for screen 2 (AI chat) - reset chat state
        if (screenNumber === 2) {
            resetChatState();
        }
        
        // Special handling for screen 3 (ticket)
        if (screenNumber === 3) {
            initTicket();
        }
    } else {
        console.error('Screen not found:', screenNumber);
    }
    
    // Debug: check current state
    setTimeout(() => {
        const activeScreen = document.querySelector('.screen.active');
        console.log('Currently active screen:', activeScreen ? activeScreen.id : 'none');
    }, 100);
}

// Show coming soon alert for disabled features
function showComingSoon(feature) {
    alert(`${feature} feature coming soon!`);
}

// Reset chat state when entering chat screen
function resetChatState() {
    const chatContainer = document.getElementById('chatContainer');
    const beachMap = document.getElementById('beachMap');
    const passButton = document.getElementById('passButton');
    
    // Clear previous messages
    chatContainer.innerHTML = '';
    
    // Hide map and pass button
    if (beachMap) beachMap.style.display = 'none';
    if (passButton) passButton.style.display = 'none';
}

// Send message function
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Show AI response after 2-second delay
        setTimeout(() => {
            handleAIResponse(message);
        }, 2000);
    }
}

// Add message to chat
function addMessage(content, type) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = content;
    
    messageDiv.appendChild(messageContent);
    chatContainer.appendChild(messageDiv);
    
    // If this is the AI trip response, add the map right after it
    if (type === 'ai' && content.includes('Bus ADX')) {
        addMapToChat();
    }
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add map directly to chat container
function addMapToChat() {
    const chatContainer = document.getElementById('chatContainer');
    const mapDiv = document.createElement('div');
    mapDiv.classList.add('message', 'map-message');
    mapDiv.innerHTML = `
        <div class="map-container-inline">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1234567890!2d55.5136!3d25.4052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef5f4334a67c47%3A0x1bb0f2d7c0b6b8a0!2sAjman%20Beach%2C%20UAE!5e0!3m2!1sen!2sus!4v1234567890124" 
                width="100%" 
                height="200" 
                style="border:0;border-radius: 12px;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    `;
    chatContainer.appendChild(mapDiv);
}

// Handle AI responses
function handleAIResponse(userMessage) {
    // First response with trip info (map will be added automatically)
    const tripResponse = '🚍 For your trip from Ajman Beach to City Center Ajman, take Bus ADX from Ajman Beach Stop (2-min walk) to City Center Stop, then walk 3 min to the entrance.<br><br>⏱ Total ≈ 21 minutes.';
    addMessage(tripResponse, 'ai');
    
    // Follow-up question after a delay
    setTimeout(() => {
        const followUp = 'Would you like to use your valid pass for this trip?';
        addMessage(followUp, 'ai');
        
        // Show pass button after follow-up question
        setTimeout(() => {
            const passButton = document.getElementById('passButton');
            passButton.style.display = 'block';
        }, 500);
    }, 1500);
}

// Initialize ticket with current date
function initTicket() {
    const validDateElement = document.getElementById('validDate');
    
    if (validDateElement) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        validDateElement.textContent = tomorrow.toLocaleDateString('en-US', options);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - initializing app');
    
    // Force clear all screens first
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Set the initial screen to screen 1
    setTimeout(() => {
        showScreen(1);
    }, 100);
    
    // Add Enter key support for chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Add touch event handling for better mobile experience
    document.addEventListener('touchstart', function(e) {
        // Prevent zoom on double tap
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        const currentScreen = document.querySelector('.screen.active');
        if (!currentScreen) return;
        
        const currentScreenId = currentScreen.id;
        
        // Arrow key navigation
        if (e.key === 'ArrowLeft') {
            if (currentScreenId === 'screen2') {
                showScreen(1);
            } else if (currentScreenId === 'screen3') {
                showScreen(2);
            }
        } else if (e.key === 'ArrowRight') {
            if (currentScreenId === 'screen1') {
                showScreen(2);
            } else if (currentScreenId === 'screen2') {
                // Only navigate to screen 3 if the pass button is visible
                const passButton = document.getElementById('passButton');
                if (passButton && passButton.style.display !== 'none') {
                    showScreen(3);
                }
            }
        }
        
        // Number key navigation
        if (e.key >= '1' && e.key <= '3') {
            const screenNum = parseInt(e.key);
            // Don't interfere with typing in chat input
            if (document.activeElement.id !== 'chatInput') {
                showScreen(screenNum);
            }
        }
        
        // Escape key to go back
        if (e.key === 'Escape') {
            if (currentScreenId === 'screen2') {
                showScreen(1);
            } else if (currentScreenId === 'screen3') {
                showScreen(2);
            }
        }
    });
    
    // Add smooth scrolling behavior
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            // Add a small vibration effect on mobile devices
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });
    });
    
    // Prevent zoom on form inputs (iOS Safari)
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
        const viewportContent = metaViewport.getAttribute('content');
        metaViewport.setAttribute('content', viewportContent + ', user-scalable=no');
    }
});

// Add some debug functions for testing
window.debugApp = {
    showScreen: showScreen,
    getCurrentScreen: function() {
        const activeScreen = document.querySelector('.screen.active');
        return activeScreen ? activeScreen.id : null;
    },
    triggerAIResponse: function() {
        initAIChat();
    }
};

// Service worker registration for offline capability (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Note: This would require creating a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}