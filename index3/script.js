// Custom Cursor
// Hero Slideshow Logic
const initSlideshow = () => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Set interval for 5 seconds
    setInterval(() => {
        // Remove active from current
        slides[currentSlide].classList.remove('active');
        
        // Next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active to next
        slides[currentSlide].classList.add('active');
    }, 6000); // 6 seconds per slide
};

document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    // initCustomCursor is called later or at EOF
});

const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Outline follows with a slight delay naturally via CSS transition usually,
  // but JS mapping ensures it tracks perfectly.
  // We can use animate() for smoother trailing effect if desired.
  cursorOutline.animate(
    {
      left: `${posX}px`,
      top: `${posY}px`,
    },
    { duration: 500, fill: "forwards" },
  );
});

// Hover effects for cursor
const links = document.querySelectorAll("a, button, .category-card");
links.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cursorOutline.style.width = "60px";
    cursorOutline.style.height = "60px";
    cursorOutline.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
  });
  link.addEventListener("mouseleave", () => {
    cursorOutline.style.width = "40px";
    cursorOutline.style.height = "40px";
    cursorOutline.style.backgroundColor = "transparent";
  });
});

// Shutter Animation on Load
// Shutter Animation on Load
// Use multiple triggers to ensure it opens
const openShutter = () => {
    const shutter = document.getElementById("shutter");
    if (document.body.classList.contains("shutter-open")) return;
    
    setTimeout(() => {
        document.body.classList.add("shutter-open");
    }, 500);
};

window.addEventListener("load", openShutter);
// Fallback if load already fired
if (document.readyState === "complete") {
    openShutter();
}
setTimeout(openShutter, 2000); // Safety net

// Smooth Scroll for Anchors
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.querySelector('.caption');
const closeBtn = document.querySelector('.close-lightbox');

// Add lightbox to both categories and masonry gallery
document.querySelectorAll('.category-card, .masonry-item').forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('h3, h4').innerText;
        lightbox.style.display = "block";
        lightboxImg.src = img.src; // In a real app, use a high-res data attribute
        captionText.innerText = title;
        document.body.style.overflow = 'hidden'; // Disable scroll
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = "none";
    document.body.style.overflow = 'auto'; // Re-enable scroll
});

// Gallery Filter & Load More Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.masonry-item');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const BATCH_SIZE = 6;
let currentCategory = 'all';
let visibleCount = BATCH_SIZE;

// Function to update gallery visibility
const updateGallery = () => {
    let filteredItems = [];
    
    // 1. Filter Items
    galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (currentCategory === 'all' || itemCategory === currentCategory) {
            filteredItems.push(item);
        } else {
            item.style.display = 'none';
        }
    });

    // 2. Handle Pagination
    filteredItems.forEach((item, index) => {
        if (index < visibleCount) {
            item.style.display = 'block';
            // Animation for appearance
            if (item.style.opacity !== '1') {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            }
        } else {
            item.style.display = 'none';
        }
    });

    // 3. Toggle Load More Button
    if (visibleCount >= filteredItems.length) {
        loadMoreBtn.classList.add('hidden');
    } else {
        loadMoreBtn.classList.remove('hidden');
    }
};

// Initialize
updateGallery();

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentCategory = btn.getAttribute('data-filter');
        visibleCount = BATCH_SIZE; // Reset count on filter change
        updateGallery();
    });
});

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += BATCH_SIZE;
        updateGallery();
    });
}


lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = 'auto';
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
             entry.target.classList.add('visible');
             // observer.unobserve(entry.target); // Optional
        }
    });
}, observerOptions);


// Observe Timeline Items (Film Strip) & Services
document.querySelectorAll('.film-frame, .service-item').forEach(item => {
    observer.observe(item);
});

// Contact Form "Camera Capture" Effect
const contactForm = document.getElementById('contactForm');
const popup = document.getElementById('thankyou-popup');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Capture Data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const message = document.getElementById('message').value;

        // 2. Populate Popup
        document.getElementById('pop-name').textContent = name;
        document.getElementById('pop-email').textContent = email;
        document.getElementById('pop-mobile').textContent = mobile;
        document.getElementById('pop-message').textContent = message;

        // 3. Trigger Flash
        const flash = document.getElementById('camera-flash');
        if (flash) {
            flash.classList.add('flash-active');
            setTimeout(() => flash.classList.remove('flash-active'), 400); // Reset
        }
        
        // 4. Show "Appearing" Popup
        setTimeout(() => {
            popup.classList.add('active');
        }, 300);
        
        // 5. Close Popup interaction
        const closeBtn = document.querySelector('.close-popup');
        
        // Close on X click
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent double trigger
                popup.classList.remove('active');
                contactForm.reset();
            });
        }

        // Close on background click (optional, keeping for UX)
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
                contactForm.reset();
            }
        });
    });
}





// Observe Sections for Fade-In
document.querySelectorAll('.section-header, .quote-text, .testimonial-editorial').forEach(el => {
    // Initial state logic moved here to avoid CSS issues
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 }).observe(el);
});

// Page Transition (Camera Flash) Logic
const initPageTransition = () => {
    // 1. Ensure flash element exists
    let flash = document.getElementById('camera-flash');
    if (!flash) {
        flash = document.createElement('div');
        flash.id = 'camera-flash';
        document.body.appendChild(flash);
    }

    // 2. Add click listeners to all internal links
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip if:
        // - No href
        // - Anchor link (keeps on same page)
        // - External link (starts with http, though we could animate this too)
        // - Has target="_blank"
        if (!href || href.startsWith('#') || link.target === '_blank') return;
        
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop immediate nav
            
            // Trigger Flash
            flash.classList.remove('flash-active');
            void flash.offsetWidth; // Force reflow
            flash.classList.add('flash-active');
            
            // Wait for flash peak (approx 100ms-200ms) then navigate
            setTimeout(() => {
                window.location.href = href;
            }, 400); // 400ms matches css animation duration
        });
    });
};

// Initialize Transition Logic
document.addEventListener('DOMContentLoaded', () => {
    initPageTransition();
});

// Re-run for dynamic content (if any, separate from DOMContentLoaded)
