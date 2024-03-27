# Gerber to SVG Converter

Convert Gerber files into SVG format, enabling users to download them as PNG images. This React + Vite application offers intuitive layer toggling, top and bottom side viewing, and support for double-sided PCB milling.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Development Server](#running-the-development-server)
  - [Production Build](#building-for-production)
  - [Serving the Production Build](#serving-the-production-build)
  - [Accessing the Hosted Application](#accessing-the-hosted-application)
- [Features](#features)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

---

## Installation

```bash
git clone https://github.com/MidlajN/react-gerber-converter.git
cd react-gerber-converter
npm install
```

## Usage

#### Running the Development Server

```bash
npm run dev
```

Access the application at `http://localhost:5173`.

#### Building for Production

```bash
npm run build
```

This generates a production-ready build.

#### Serving the Production Build

```bash
npm run serve
```

Serves the production build locally at `http://localhost:4173`.

### Accessing the Hosted Application

Hosted version available at [gerber2png.fablabkerala.in](https://gerber2png.fablabkerala.in/).

## Features

- **Gerber to SVG Conversion**: Convert Gerber files into SVG format.
- **Download as PNG**: Export SVG images as PNG files.
- **Layer Toggle**: Toggle visibility of individual layers.
- **Top and Bottom Side View**: Switch between top and bottom sides of the PCB.
- **Support for Double-Sided PCB Milling**: Handles PNG images for double-sided PCB milling.

## Dependencies

- `PCBStackup`: Library for handling PCB stack-up data.
- `gerberToSvg`: NPM package for converting Gerber files to SVG.
- `jszip`: JavaScript library for creating, reading, and editing ZIP files.

## Contributing

Contributions are welcome! Fork the repository and submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br>

> *If there any known bugs found or run into any issues please let me know. Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Email: 👉 midlaj4n@gmail.com  Thank you!*

---