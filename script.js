const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close menu when clicking a link
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));


// BOOKS FETCHING FROM BOOK.JSON FILE CODE BELOW

// Function to create magic rating stars
const createMagicRating = (rating) => "✨".repeat(rating);

// Function to create a book card
const createBookCard = (book) => {
    return `
        <div class="book-card">
            <div class="book-cover">
                <div class="book-effect"></div>
                <img src="${book.image}" alt="${book.title}">
            </div>
            <div class="book-content">
                <h3>${book.title}</h3>
                <p>${book.description}</p>
                <span class="magic-rating">${createMagicRating(book.rating)}</span>
                <button class="explore-btn">${book.buttonText}</button>
            </div>
        </div>
    `;
};

// Fetch and render books
async function loadBooks() {
    try {
        const response = await fetch('content/books.json');
        const data = await response.json();
        const booksContainer = document.querySelector('.books-container');
        
        booksContainer.innerHTML = data.books
            .map(book => createBookCard(book))
            .join('');
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Smooth scroll function
function scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Setup navigation and button click handlers
function setupNavigationHandlers() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href');
            scrollToSection(sectionId);
            
            // Close mobile menu if open
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // Explore button in welcome section
    document.querySelector('.welcome button').addEventListener('click', () => {
        scrollToSection('#books');
    });

    // Book card buttons
    document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            scrollToSection('#contact');
        });
    });

    // Event buttons
    document.querySelectorAll('.join-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            scrollToSection('#contact');
        });
    });
}

// Add skeleton loading function
function createSkeletonLoader(container, type) {
    const skeletons = {
        welcome: `
            <div class="skeleton-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `,
        book: `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `,
        story: `
            <div class="skeleton-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        `,
        event: `
            <div class="skeleton-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `,
        contact: `
            <div class="skeleton-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-button"></div>
            </div>
        `
    };

    container.innerHTML = skeletons[type].repeat(type === 'book' ? 8 : 1);
}

// Modified content loading functions
async function loadContent(fetchFn, container, type) {
    createSkeletonLoader(container, type);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    
    try {
        await fetchFn();
        container.classList.add('content-loaded');
    } catch (error) {
        console.error(`Error loading ${type} content:`, error);
    }
}

// Update DOM content loaded event
document.addEventListener('DOMContentLoaded', async () => {
    const sections = {
        welcome: { container: document.querySelector('.welcome'), type: 'welcome', loader: loadHomeContent },
        books: { container: document.querySelector('.books-container'), type: 'book', loader: loadBooks },
        story: { container: document.querySelector('.story-container'), type: 'story', loader: loadStoryContent },
        events: { container: document.querySelector('.event-container'), type: 'event', loader: loadEvents },
        contact: { container: document.querySelector('.contact-container'), type: 'contact', loader: loadContactContent }
    };

    // Load all sections with skeleton loaders
    await Promise.all(
        Object.values(sections).map(({ container, type, loader }) => 
            loadContent(loader, container, type)
        )
    );

    setupNavigationHandlers();
});

async function loadHomeContent() {
    try {
        const response = await fetch('content/home.json');
        const data = await response.json();
        const welcomeSection = document.querySelector('.welcome');
        
        welcomeSection.innerHTML = `
            <ul>
                <li>
                    <h1>${data.welcome.title}</h1>
                    <p>${data.welcome.description}</p>
                </li>
                <button>${data.welcome.buttonText}<img src="${data.welcome.buttonIcon}" width="30px" height="30px"/></button>
            </ul>
        `;
    } catch (error) {
        console.error('Error loading home content:', error);
    }
}

async function loadStoryContent() {
    try {
        const response = await fetch('content/story.json');
        const data = await response.json();
        const storyContainer = document.querySelector('.story-container');
        
        storyContainer.innerHTML = `
            <h2 class="story-title">${data.title}</h2>
            <div class="story-content">
                <div class="story-text">
                    ${data.story.paragraphs.map(p => `<p>${p}</p>`).join('')}
                </div>
                <div class="story-highlights">
                    ${data.highlights.map(highlight => `
                        <div class="highlight-card">
                            <div class="magic-number">${highlight.number}</div>
                            <h3>${highlight.title}</h3>
                            <p>${highlight.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading story content:', error);
    }
}

async function loadEvents() {
    try {
        const response = await fetch('content/events.json');
        const data = await response.json();
        const eventContainer = document.querySelector('.event-container');
        
        eventContainer.innerHTML = `
            <h2 class="event-title">${data.title}</h2>
            <div class="events-grid">
                ${data.events.map(event => `
                    <div class="event-card">
                        <div class="event-date">📅 ${event.date}</div>
                        <h3 class="event-name">${event.name}</h3>
                        <p class="event-description">${event.description}</p>
                        <div class="event-details">
                            <span class="event-location">📍 ${event.location}</span>
                            <span class="event-time">🕐 ${event.time}</span>
                        </div>
                        <button class="join-btn">${event.buttonText}</button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

async function loadContactContent() {
    try {
        const response = await fetch('content/contact.json');
        const data = await response.json();
        const contactContainer = document.querySelector('.contact-container');
        
        const formFields = data.form.fields.map(field => {
            if (field.type === 'select') {
                return `
                    <div class="form-group">
                        <label>${field.label}</label>
                        <select class="magical-input">
                            <option value="">${field.placeholder}</option>
                            ${field.options.map(opt => `
                                <option value="${opt.value}">${opt.text}</option>
                            `).join('')}
                        </select>
                    </div>
                `;
            } else if (field.type === 'textarea') {
                return `
                    <div class="form-group">
                        <label>${field.label}</label>
                        <textarea class="magical-input magical-textarea" placeholder="${field.placeholder}"></textarea>
                    </div>
                `;
            } else {
                return `
                    <div class="form-group">
                        <label>${field.label}</label>
                        <input type="${field.type}" class="magical-input" placeholder="${field.placeholder}">
                    </div>
                `;
            }
        }).join('');

        const contactMethods = data.contactMethods.map(method => `
            <div class="contact-method">
                <div class="contact-icon">${method.icon}</div>
                <h3>${method.title}</h3>
                <p>${method.lines.join('<br>')}</p>
            </div>
        `).join('');

        contactContainer.innerHTML = `
            <h2 class="contact-title">${data.title}</h2>
            <p class="contact-subtitle">${data.subtitle}</p>
            
            <form class="contact-form">
                ${formFields}
                <button type="submit" class="send-spell">${data.form.submitButton}</button>
            </form>
            
            <div class="contact-methods">
                ${contactMethods}
            </div>
        `;

        // Add form submission handler
        const form = contactContainer.querySelector('.contact-form');
        form.addEventListener('submit', handleFormSubmission);
    } catch (error) {
        console.error('Error loading contact content:', error);
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        subject: form.querySelector('select').value,
        message: form.querySelector('textarea').value,
        timestamp: new Date().toISOString()
    };

    try {
        // Get existing submissions
        const response = await fetch('content/form-submissions.json');
        const data = await response.json();
        
        // Add new submission
        data.submissions.push(formData);
        
        // Save updated submissions (in a real app, this would be a server API call)
        console.log('Saved submission:', data.submissions);
        
        // Show success message
        showSuccessMessage(form);
        
        // Clear the form
        form.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
    }
 }

function showSuccessMessage(form) {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✨</span>
            <h3>Message Sent Successfully!</h3>
            <p>Our wizards will respond to your spell soon.</p>
        </div>
    `;

    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Remove the message after 5 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 500);
    }, 5000);
 }

