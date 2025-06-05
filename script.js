// YouTube API
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: 'UM96cmVaZlw',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'showinfo': 0,
            'mute': 1,
            'loop': 1,
            'playlist': 'UM96cmVaZlw',
            'playsinline': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 100; // Adjust this value based on your header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll event listener for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollPosition = window.scrollY;
    const heroHeight = document.querySelector('#hero').offsetHeight;
    
    // Calculate opacity based on scroll position
    const opacity = Math.max(0, 1 - (scrollPosition / (heroHeight * 0.3)));
    
    // Apply the transparent class when scrolled down
    if (scrollPosition > 50) {
        navbar.classList.add('transparent');
    } else {
        navbar.classList.remove('transparent');
    }
});

// Add animation to feature cards when they come into view
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Number animation
    function animateNumbers() {
        const numbers = document.querySelectorAll('.number');
        
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            if (isNaN(target)) {
                console.error('Invalid target value for number:', number);
                return;
            }
            
            let current = 0;
            const increment = target / 50; // 50 steps
            const duration = 2000; // 2 seconds
            const interval = duration / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    number.textContent = target;
                    clearInterval(timer);
                } else {
                    number.textContent = Math.floor(current);
                }
            }, interval);
        });
    }

    // Intersection Observer for number animation
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe all number elements
    document.querySelectorAll('.number').forEach(number => {
        numberObserver.observe(number);
    });

    // Dropdown functionality
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-button');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (button && content) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.display = 'none';
            });
        }
    });
});

// ClickUp API Integration
const CLICKUP_API_TOKEN = 'YOUR_CLICKUP_API_TOKEN'; // You'll need to replace this with your actual token
const CLICKUP_LIST_ID = 'YOUR_LIST_ID'; // You'll need to replace this with your actual list ID

async function fetchClickUpData() {
    try {
        const response = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
            headers: {
                'Authorization': CLICKUP_API_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ClickUp data:', error);
        return null;
    }
}

function updateNumbers(data) {
    if (!data) return;

    // Update each number based on ClickUp data
    const numbers = {
        'Current Properties': data.tasks.filter(task => task.status.status === 'complete').length,
        'Pipeline Projects': data.tasks.filter(task => task.status.status === 'in progress').length,
        'Past Weddings': data.tasks.filter(task => task.custom_fields.some(field => field.name === 'Weddings' && field.value > 0)).reduce((sum, task) => sum + task.custom_fields.find(field => field.name === 'Weddings').value, 0),
        'Booked Weddings': data.tasks.filter(task => task.custom_fields.some(field => field.name === 'Booked Weddings' && field.value > 0)).reduce((sum, task) => sum + task.custom_fields.find(field => field.name === 'Booked Weddings').value, 0),
        'Hurdle Rate': 20 // This might need to be calculated based on your specific requirements
    };

    // Update the DOM
    Object.entries(numbers).forEach(([key, value]) => {
        const element = document.querySelector(`.number-item h3:contains('${key}') + .number`);
        if (element) {
            element.textContent = key === 'Hurdle Rate' ? `${value}%` : value;
        }
    });
}

// Fetch and update numbers every 5 minutes
async function updateNumbersPeriodically() {
    const data = await fetchClickUpData();
    updateNumbers(data);
}

// Initial update
updateNumbersPeriodically();

// Set up periodic updates
setInterval(updateNumbersPeriodically, 5 * 60 * 1000);

// Stakeholders dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');
    
    dropdownHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Close all other dropdowns
            dropdownHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('active');
                    const otherIcon = otherHeader.querySelector('i');
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            });

            // Toggle current dropdown
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            content.classList.toggle('active');
            
            // Toggle icon
            const icon = header.querySelector('i');
            if (header.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
}); 