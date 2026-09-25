# Portfolio Website

A responsive personal portfolio for **Aarav Sukhadiya**, built with React and Vite. The site combines scroll-driven animations, interactive project cards, responsive navigation, and dedicated sections for skills, experience, education, and contact information.

## Highlights

- Scroll-driven hero and project transitions
- Interactive 3D project cards
- Responsive desktop and mobile navigation
- Skills, experience, education, and contact sections
- Framer Motion animations
- Tailwind CSS styling with a custom dark design system
- Portfolio content managed from a central data file

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- React Icons
- Lucide React

## Getting Started

### Prerequisites

Install a recent Node.js LTS release and npm.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

### Production Build

```bash
npm run build
```

The optimized production output is generated in `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```text
.
├── docs/                 Design documentation
├── public/               Images, icons, and static assets
├── src/
│   ├── components/       Portfolio sections and reusable UI
│   ├── data/             Portfolio content
│   ├── hooks/            Custom React hooks
│   ├── App.jsx           Main application component
│   ├── index.css         Global styles
│   └── main.jsx          Application entry point
├── index.html
└── vite.config.js
```

## Customization

Update personal details, projects, skills, experience, education, and social links in [`src/data/portfolio.js`](src/data/portfolio.js).

Design tokens and component decisions are documented in [`docs/DESIGN.md`](docs/DESIGN.md).

Static assets are stored in [`public/`](public/).

## License

This project is licensed under the ISC License.
