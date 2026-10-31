# STR INNOVATION

A modern, responsive business website for **STR INNOVATION**, a CNC job work, tooling, and precision machining service provider based in Hosur, Tamil Nadu, India.

The website presents the company's manufacturing capabilities, services, experience, and technical expertise while providing a direct enquiry channel for potential clients.

## Project Overview

STR INNOVATION specialises in precision machining and tooling solutions for manufacturing requirements. The website is designed to communicate the company's capabilities through a modern interface, interactive sections, visual animations, and a responsive browsing experience.

**Business:** STR INNOVATION  
**Industry:** CNC Machining & Precision Engineering  
**Location:** Hosur, Tamil Nadu, India  
**Project Type:** Business Website  
**Status:** Live

## Website Features

- Responsive desktop, tablet, and mobile layouts
- Custom animated hero section
- Interactive navigation with fullscreen mobile menu
- Sticky header with scroll-based styling
- About and company introduction
- Vision and mission sections
- Services showcase with continuous horizontal carousel
- Interactive process accordion
- Animated image gallery with vertical scrolling columns
- Testimonials section with navigation
- Contact and enquiry form
- Client-side form validation
- Google Apps Script form integration
- Google Sheets enquiry management
- Email notifications
- WhatsApp contact integration
- Scroll-triggered reveal animations
- Dynamic copyright year

## Services Showcased

1. Plastic Molding Tooling & Dies
2. Aluminium Die Casting Dies
3. Press Tool Dies
4. Machining & Assembly Fixtures
5. Production-based Machining
6. Complex Profile Machining

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | Interactive functionality |
| Canvas API | Animated hero background |
| WebGL | Gradient blinds visual effect |
| GLSL | Custom gradient shader |
| Intersection Observer API | Scroll reveal animations |
| GSAP / ScrollTrigger | Not identified in the supplied implementation |
| Google Apps Script | Contact form backend |
| Google Sheets | Enquiry data storage |
| Font Awesome | Icon library |
| Google Fonts | DM Sans and Manrope typography |

## Custom JavaScript Components

### Shape Grid

A custom Canvas-based background animation featuring:

- Continuously moving geometric grid
- Configurable grid size and movement speed
- Multiple geometric shape options
- Mouse interaction and hover highlighting
- Animated hover trail effect
- Responsive canvas resizing

### Gradient Blinds

A custom WebGL-based visual effect featuring:

- GLSL vertex and fragment shaders
- Multi-colour gradient rendering
- Adjustable blind count and angle
- Mouse-controlled spotlight effect
- Gradient distortion and noise
- Mirror and shine controls
- Light and dark rendering modes

### Interactive UI

Additional JavaScript functionality includes:

- Mobile navigation toggle
- Escape-key menu closing
- Automatic menu closing after navigation
- Scroll-based header updates
- Intersection Observer reveal animations
- Continuous horizontal services carousel
- Vertical animated gallery columns
- Interactive process accordion
- Testimonial navigation

## Contact Form Integration

The website includes a custom enquiry form that collects:

- Name
- Company name
- Email address
- Phone number
- Project requirements

### Validation

- Name accepts letters and spaces only.
- Company name accepts letters and selected punctuation, without numbers.
- Email is checked against a standard email-format pattern.
- Phone number accepts an optional international prefix and 10–15 digits.
- Required fields are validated before submission.

### Submission Workflow

1. Visitor enters their enquiry details.
2. JavaScript validates the form information.
3. Form data is submitted to Google Apps Script.
4. Google Apps Script processes the submission.
5. Enquiry information is stored in Google Sheets.
6. An email notification is sent through the backend.

The browser uses a `no-cors` request, so successful backend storage cannot be independently confirmed by the frontend.

## Design & User Experience

The website follows a modern precision-engineering design direction.

- Navy and gold colour palette
- DM Sans and Manrope typography
- Responsive content layouts
- Animated section transitions
- Interactive hover effects
- Custom canvas and WebGL backgrounds
- Fullscreen mobile navigation
- Smooth anchor navigation
- Responsive image presentation

## Project Structure

```text
STR-INNOVATION/
│
├── assets/
│   ├── images/
│   ├── logos/
│   └── favicon.png
│
├── index.html
├── style.css
├── script.js
├── contact.js
├── shape-grid.js
├── gradient-blinds.js
│
└── README.md
```

*The assets directory structure above is illustrative; the exact contents depend on the deployed project files.*

## Setup & Configuration

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd STR-INNOVATION
```

### 3. Run Locally

Open `index.html` in a browser or use a local development server.

### 4. Configure the Contact Form

- Set up the Google Spreadsheet.
- Configure the Google Apps Script backend.
- Deploy the script as a Web App.
- Update the `SCRIPT_URL` in `contact.js`.
- Test form submissions and email notifications.

### 5. Configure Website Content

Update the following as required:

- Company information
- Service descriptions
- Images and branding assets
- Contact information
- WhatsApp links
- SEO metadata
- Google Apps Script endpoint

## Deployment

This is a live business website developed for STR INNOVATION.

The project uses a static frontend with Google Apps Script handling contact form submissions.

---
