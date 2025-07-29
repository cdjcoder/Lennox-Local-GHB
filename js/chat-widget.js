// Chat Widget Functionality with Multi-language Support
document.addEventListener('DOMContentLoaded', function() {
    // Language support - detect current language from page
    let currentLanguage = 'en'; // default to English
    
    // Translations object
    const translations = {
        en: {
            title: 'Lennox Local Ads Support',
            welcome: 'Welcome to Lennox Local Ads! How can we help you today?',
            quickReplies: {
                pricing: 'Pricing Information',
                areas: 'Mailing Areas', 
                howItWorks: 'How It Works',
                schedule: 'Schedule a Call'
            },
            greeting: 'Hello! I\'m your Lennox Local Ads assistant. How can I help you today?',
            placeholder: 'Type your message...',
            responses: {
                pricing: 'Our postcard advertising starts at just $299 for a local campaign reaching 10,000+ households. Premium spots with exclusivity are available at $499. Would you like more details on our pricing?',
                areas: 'We currently serve the Lennox (90304) and Hawthorne (90250) areas. Our targeted mailing system allows you to reach specific neighborhoods within these zip codes. Would you like to see our mailing map?',
                howItWorks: 'Our process is simple: 1) You choose your target area and campaign date, 2) Provide your ad design or let us create one for you, 3) We print and mail your postcards to local households, 4) You receive new customers! Would you like more details on any of these steps?',
                schedule: 'We\'d be happy to schedule a call with you! Please provide your phone number and preferred time, and our team will contact you. Alternatively, you can call us directly at (310) 555-1234.',
                hello: 'Hello there! How can I help you with your direct mail marketing needs today?',
                default: 'Thank you for your message. Our team is committed to helping you reach local customers effectively with our direct mail campaigns. Can you please provide more details about what you\'re looking for?'
            }
        },
        es: {
            title: 'Soporte de Lennox Local Ads',
            welcome: '¡Bienvenido a Lennox Local Ads! ¿Cómo podemos ayudarte hoy?',
            quickReplies: {
                pricing: 'Información de Precios',
                areas: 'Áreas de Envío',
                howItWorks: 'Cómo Funciona',
                schedule: 'Programar una Llamada'
            },
            greeting: '¡Hola! Soy tu asistente de Lennox Local Ads. ¿Cómo puedo ayudarte hoy?',
            placeholder: 'Escribe tu mensaje...',
            responses: {
                pricing: 'Nuestra publicidad en tarjetas postales comienza en solo $299 para una campaña local que llega a más de 10,000 hogares. Los espacios premium con exclusividad están disponibles por $499. ¿Te gustaría más detalles sobre nuestros precios?',
                areas: 'Actualmente servimos las áreas de Lennox (90304) y Hawthorne (90250). Nuestro sistema de envío dirigido te permite llegar a vecindarios específicos dentro de estos códigos postales. ¿Te gustaría ver nuestro mapa de envío?',
                howItWorks: 'Nuestro proceso es simple: 1) Eliges tu área objetivo y fecha de campaña, 2) Proporcionas tu diseño de anuncio o dejanos crear uno para ti, 3) Imprimimos y enviamos tus tarjetas postales a hogares locales, 4) ¡Recibes nuevos clientes! ¿Te gustaría más detalles sobre alguno de estos pasos?',
                schedule: '¡Estaríamos encantados de programar una llamada contigo! Por favor proporciona tu número de teléfono y hora preferida, y nuestro equipo se pondrá en contacto contigo. Alternativamente, puedes llamarnos directamente al (310) 555-1234.',
                hello: '¡Hola! ¿Cómo puedo ayudarte con tus necesidades de marketing directo por correo hoy?',
                default: 'Gracias por tu mensaje. Nuestro equipo está comprometido a ayudarte a llegar a clientes locales de manera efectiva con nuestras campañas de correo directo. ¿Puedes proporcionar más detalles sobre lo que estás buscando?'
            }
        }
    };
    
    // Function to detect current page language
    function detectPageLanguage() {
        // Check if there are any Spanish elements visible
        const spanishElements = document.querySelectorAll('.es');
        const englishElements = document.querySelectorAll('.en');
        
        let spanishVisible = false;
        spanishElements.forEach(el => {
            if (window.getComputedStyle(el).display !== 'none') {
                spanishVisible = true;
            }
        });
        
        return spanishVisible ? 'es' : 'en';
    }
    
    // Function to get translated text
    function getTranslation(key, subkey = null) {
        const lang = detectPageLanguage();
        currentLanguage = lang;
        
        if (subkey) {
            return translations[lang][key][subkey] || translations['en'][key][subkey];
        }
        return translations[lang][key] || translations['en'][key];
    }
    // Create chat widget elements
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    
    // Chat button
    const chatButton = document.createElement('div');
    chatButton.className = 'chat-button';
    chatButton.innerHTML = '<i class="fas fa-comments"></i>';
    
    // Chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    
    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.innerHTML = `
        <h3>${getTranslation('title')}</h3>
        <button class="chat-close"><i class="fas fa-times"></i></button>
    `;
    
    // Chat messages area
    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    
    // Welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chat-welcome';
    welcomeMessage.innerHTML = `
        <p>${getTranslation('welcome')}</p>
        <div class="quick-replies">
            <button class="quick-reply-btn">${getTranslation('quickReplies', 'pricing')}</button>
            <button class="quick-reply-btn">${getTranslation('quickReplies', 'areas')}</button>
            <button class="quick-reply-btn">${getTranslation('quickReplies', 'howItWorks')}</button>
            <button class="quick-reply-btn">${getTranslation('quickReplies', 'schedule')}</button>
        </div>
    `;
    chatMessages.appendChild(welcomeMessage);
    
    // Initial bot message
    addMessage(getTranslation('greeting'), 'bot');
    
    // Chat input container
    const chatInputContainer = document.createElement('div');
    chatInputContainer.className = 'chat-input-container';
    chatInputContainer.innerHTML = `
        <input type="text" class="chat-input" placeholder="${getTranslation('placeholder')}">
        <button class="chat-send"><i class="fas fa-paper-plane"></i></button>
    `;
    
    // Assemble chat container
    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatMessages);
    chatContainer.appendChild(chatInputContainer);
    
    // Assemble chat widget
    chatWidget.appendChild(chatButton);
    chatWidget.appendChild(chatContainer);
    
    // Add to body
    document.body.appendChild(chatWidget);
    
    // Event listeners
    chatButton.addEventListener('click', () => {
        chatContainer.classList.add('active');
    });
    
    document.querySelector('.chat-close').addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
    
    const chatInput = document.querySelector('.chat-input');
    const chatSend = document.querySelector('.chat-send');
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate response after delay
            setTimeout(() => {
                hideTypingIndicator();
                processUserMessage(message);
            }, 1000 + Math.random() * 1000);
        }
    }
    
    chatSend.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick reply buttons
    document.querySelectorAll('.quick-reply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const replyText = button.textContent;
            addMessage(replyText, 'user');
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate response after delay
            setTimeout(() => {
                hideTypingIndicator();
                processUserMessage(replyText);
            }, 1000 + Math.random() * 1000);
        });
    });
    
    // Helper functions
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.textContent = text;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        typingIndicator.id = 'typing-indicator';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Simple response handling with multi-language support
    function processUserMessage(message) {
        const originalMessage = message;
        message = message.toLowerCase();
        
        // Detect language keywords in both English and Spanish
        const priceKeywords = ['price', 'cost', 'pricing', 'precio', 'costo', 'precios'];
        const areaKeywords = ['area', 'mailing', 'target', 'área', 'envío', 'objetivo'];
        const howItWorksKeywords = ['how it works', 'process', 'cómo funciona', 'proceso'];
        const scheduleKeywords = ['schedule', 'call', 'contact', 'programar', 'llamada', 'contacto'];
        const greetingKeywords = ['hello', 'hi', 'hey', 'hola', 'saludos'];
        
        if (priceKeywords.some(keyword => message.includes(keyword))) {
            addMessage(getTranslation('responses', 'pricing'), 'bot');
        }
        else if (areaKeywords.some(keyword => message.includes(keyword))) {
            addMessage(getTranslation('responses', 'areas'), 'bot');
        }
        else if (howItWorksKeywords.some(keyword => message.includes(keyword))) {
            addMessage(getTranslation('responses', 'howItWorks'), 'bot');
        }
        else if (scheduleKeywords.some(keyword => message.includes(keyword))) {
            addMessage(getTranslation('responses', 'schedule'), 'bot');
        }
        else if (greetingKeywords.some(keyword => message.includes(keyword))) {
            addMessage(getTranslation('responses', 'hello'), 'bot');
        }
        else {
            addMessage(getTranslation('responses', 'default'), 'bot');
        }
    }
    
    // Language change observer to update chat when page language changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // Check if language has changed and update chat content
                const newLanguage = detectPageLanguage();
                if (newLanguage !== currentLanguage) {
                    currentLanguage = newLanguage;
                    updateChatLanguage();
                }
            }
        });
    });
    
    // Start observing language toggle changes
    const spanishElements = document.querySelectorAll('.es');
    const englishElements = document.querySelectorAll('.en');
    [...spanishElements, ...englishElements].forEach(el => {
        observer.observe(el, { attributes: true, attributeFilter: ['style'] });
    });
    
    // Function to update chat interface language
    function updateChatLanguage() {
        // Update header title
        const headerTitle = document.querySelector('.chat-header h3');
        if (headerTitle) {
            headerTitle.textContent = getTranslation('title');
        }
        
        // Update input placeholder
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            chatInput.placeholder = getTranslation('placeholder');
        }
        
        // Update welcome message and quick replies
        const welcomeDiv = document.querySelector('.chat-welcome');
        if (welcomeDiv) {
            welcomeDiv.innerHTML = `
                <p>${getTranslation('welcome')}</p>
                <div class="quick-replies">
                    <button class="quick-reply-btn">${getTranslation('quickReplies', 'pricing')}</button>
                    <button class="quick-reply-btn">${getTranslation('quickReplies', 'areas')}</button>
                    <button class="quick-reply-btn">${getTranslation('quickReplies', 'howItWorks')}</button>
                    <button class="quick-reply-btn">${getTranslation('quickReplies', 'schedule')}</button>
                </div>
            `;
            
            // Re-attach quick reply event listeners
            welcomeDiv.querySelectorAll('.quick-reply-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const replyText = button.textContent;
                    addMessage(replyText, 'user');
                    
                    showTypingIndicator();
                    
                    setTimeout(() => {
                        hideTypingIndicator();
                        processUserMessage(replyText);
                    }, 1000 + Math.random() * 1000);
                });
            });
        }
    }
});