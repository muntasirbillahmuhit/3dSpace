SPECGIT

SPECGIT is an interactive 3D Solar System application built for exploring planets and other celestial objects in an immersive space environment.

Features

- Interactive 3D Solar System
- Planet exploration
- Sun and planetary orbits
- Pluto
- Asteroid Belt
- Kuiper Belt
- Halley's Comet
- Celestial object information
- Interactive camera controls
- Planet labels
- Simulation speed controls
- Rotation controls
- Sun glare controls
- Zero Space mode
- Responsive interface
- Android APK support

Technology

SPECGIT is built using modern web technologies, including:

- React
- TypeScript
- Vite
- Three.js
- Tailwind CSS
- Motion
- Capacitor
- Android

Run Locally

Install the project dependencies:

npm install

Start the development server:

npm run dev

Production Build

Build the web application:

npm run build

Preview the production build:

npm run preview

Android

The application can be packaged as an Android APK using Capacitor.

The Android build process can be automated through GitHub Actions.

The generated APK is intended for testing and development unless a release signing configuration is added.

Security

Do not commit sensitive information to this repository.

Never add the following to source code or README files:

- API keys
- Access tokens
- Passwords
- Private credentials
- Signing keys
- Keystore passwords
- Private service configuration

Use environment variables for secrets when required and keep ".env" files containing secrets outside version control.

Project Structure

SPECGIT/
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .github/
│   └── workflows/
├── package.json
├── tsconfig.json
└── vite.config.ts

License

See the license included with the project for licensing information.

---

SPECGIT

Explore the Solar System in 3D.
