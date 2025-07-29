# YOUWARE Development Guide

## Project Overview
This is a **Lennox Local ads** website - a direct mail marketing service for local businesses in Los Angeles & Orange Counties. The site showcases postcard advertising services with a focus on reaching 10,000+ local households through physical mail campaigns.

## Architecture & Structure

### Frontend Architecture
- **Single Page Application**: Built with vanilla HTML, CSS, and JavaScript
- **Responsive Design**: Mobile-first approach with breakpoints for various devices
- **Component Structure**: Modular sections (hero, benefits, pricing, FAQ, etc.)
- **Animation Library**: AOS (Animate On Scroll) for smooth animations
- **UI Framework**: Font Awesome icons, Google Fonts (Poppins & Lexend Deca)

### File Organization
```
src/
├── index.html          # Main entry point (single-page application)
├── css/style.css       # Main stylesheet (86KB+ comprehensive styling)
├── js/main.js          # Main JavaScript functionality (44KB+ interactions)
├── styles.css          # Additional/override styles
├── script.js           # Additional JavaScript functionality
├── images/             # Image assets directory
└── server/             # Backend-related files (PHP email handling)
```

### Key Features
1. **Multi-language Support**: English/Spanish toggle functionality
2. **Interactive Elements**: Modal forms, chatbot widget, countdown timers
3. **Google Maps Integration**: Service area mapping and directions
4. **Email Integration**: Contact forms with PHP backend processing
5. **Responsive Grids**: Available spots grid, pricing cards, service areas

### Styling Architecture
- **CSS Variables**: Custom properties for consistent theming
- **BEM-like Naming**: Component-based class naming
- **Gradient Backgrounds**: Extensive use of CSS gradients for visual appeal
- **Box Shadows**: Layered shadow effects for depth
- **Flexbox & Grid**: Modern layout techniques throughout

### JavaScript Functionality
- **Smooth Scrolling**: Navigation and anchor link animations
- **Form Handling**: Modal management, form validation
- **Dynamic Content**: Language switching, countdown timers
- **Interactive Maps**: Google Maps API integration
- **Chatbot Widget**: Floating customer service interface

## Development Commands

### File Serving
Since this is a static website, serve using any static file server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js live-server
npx live-server src/

# Using PHP built-in server (for email functionality)
php -S localhost:8000 -t src/
```

### Asset Management
- **Images**: Store in root `src/` directory with unique hash-based naming
- **Fonts**: Loaded via Google Fonts CDN
- **Icons**: Font Awesome CDN integration
- **External Libraries**: CDN-based (AOS, SweetAlert2, Swiper)

### Email Functionality
The site includes PHP-based email processing:
- `send-email.php`: Handles contact form submissions
- `email-instructions.txt`: Setup documentation for email configuration

## Branding & Content
- **Brand Name**: "Lennox Local ads" (evolved from "Gigante Print Media")
- **Color Scheme**: Gold (#d4af37), Blue accents, Red highlights
- **Service Areas**: Lennox (90304) and Hawthorne (90250)
- **Target Audience**: Local businesses seeking direct mail marketing

## Key Integrations
- **Google Maps**: Service area visualization and directions
- **Font Awesome**: Icon library for UI elements
- **AOS Library**: Scroll-triggered animations
- **SweetAlert2**: Enhanced alert/modal dialogs
- **Swiper**: Touch-friendly sliders (if needed)

## Content Management
- **Postcard Images**: Dynamically referenced (c8j30gm2y3.png, 58nv915us5.png, etc.)
- **Service Descriptions**: Embedded in HTML with multi-language support
- **Pricing Information**: Hardcoded in HTML structure
- **Contact Information**: Phone numbers, email addresses in multiple locations

## Performance Considerations
- **CDN Assets**: All external libraries loaded from CDNs
- **Image Optimization**: Postcard images should be optimized for web
- **Lazy Loading**: Consider implementing for image-heavy sections
- **Minification**: CSS and JS files are not minified (development versions)