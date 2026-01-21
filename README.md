# Lennox Local Ads Flyer

A direct mail marketing website for local businesses in Los Angeles & Orange Counties. This service helps businesses reach 10,000+ local households through physical postcard mail campaigns.

## Project Overview

This is a static website built with HTML, CSS, and JavaScript that showcases postcard advertising services. The site features:

- Multi-language support (English/Spanish)
- Interactive contact forms
- Google Maps integration for service areas
- Responsive design for all devices
- Email backend for form submissions

## Quick Start

### Viewing the Website

Since this is a static website, you can serve it using any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js live-server
npx live-server .

# Using PHP built-in server (for email functionality)
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

### Backend Server

For the email functionality, there's a Node.js backend in the `server/` directory. See [server/README.md](server/README.md) for setup instructions.

## Project Structure

```
.
├── index.html              # Main website entry point
├── css/                    # Stylesheets directory
├── js/                     # JavaScript files
├── images/                 # Image assets
├── server/                 # Email backend (Node.js/Express)
├── *.png, *.jpg, *.webp   # Media assets (images)
├── *.mp3                   # Audio assets
├── *.pdf                   # PDF documents
└── README.md              # This file
```

## Key Features

- **Responsive Design**: Mobile-first approach with breakpoints for various devices
- **Multi-language Support**: Toggle between English and Spanish
- **Interactive Forms**: Contact and reservation forms with validation
- **Google Maps Integration**: Service area visualization
- **Email Integration**: Contact form submissions via backend API

## Development

For detailed development information, see [YOUWARE.md](YOUWARE.md).

## Contributing

To contribute to this project, please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to add files and make changes to the repository.

## Service Areas

- Lennox (90304)
- Hawthorne (90250)
- Los Angeles & Orange Counties

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Poppins & Lexend Deca)
- AOS (Animate On Scroll) library
- Google Maps API
- Node.js/Express (backend)
- Nodemailer (email handling)

## License

© Lennox Local Ads Flyer. All rights reserved.
