# AI Image Authenticity Detector

A web application that analyzes images to determine whether they were AI-generated or authentic. This project is conceptually inspired by Google's SynthID watermarking technology used in Gemini 3 Pro, which embeds imperceptible watermarks in AI-generated images for detection purposes.

## Project Context

While Google's SynthID technology for image detection isn't publicly available yet, this application demonstrates the concept using Google AI Studio's Gemini API for visual analysis. Once Google releases an official SynthID detection API, it will be integrated to provide direct watermark detection capabilities. The current implementation maintains the same conceptual approach: combining metadata forensics with AI-powered visual analysis.

## How It Works

The application employs a two-stage detection system:

1. **Metadata Forensics:** Examines EXIF data using `exifr` to identify anomalies such as missing camera information, traces of editing software, timestamp inconsistencies, and other metadata red flags common in AI-generated or manipulated images.

2. **AI Visual Analysis:** Leverages Google's Gemini 3 Pro model to detect visual artifacts characteristic of AI generation, including unnatural textures, symmetry anomalies, lighting inconsistencies, and text rendering problems.

Each analysis produces a verdict ("Likely AI-Generated", "Likely Authentic", or "Inconclusive"), a confidence score, and detailed reasoning explaining the determination.

## Features

- **Dual-layer detection system** combining EXIF analysis and AI visual inspection
- **Comprehensive metadata viewer** displaying camera details, software traces, GPS data, and edit history
- **Interactive interface** with drag-and-drop image upload
- **Zoomable image preview** for detailed examination
- **Customer support simulation** featuring a chat interface for real-time image analysis
- **Activity logging** to track analysis history locally
- **Detailed analysis reports** with confidence scores and evidence-based reasoning

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Metadata Parsing:** `exifr`
- **Icons:** Lucide React

## Prerequisites

- Node.js (v18 or higher)
- Google Gemini API key (obtain from [Google AI Studio](https://aistudio.google.com/))

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Navigate to the project directory:**
   ```bash
   cd FrontEnd
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure your API key:**
   
   Create a `.env.local` file in the `FrontEnd` directory:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   
   Open your browser to `http://localhost:3000`

## Project Structure

```
FrontEnd/
├── components/              # React components
│   ├── ChatSection.tsx      # Chat interface for customer simulation
│   ├── ExifDisplay.tsx      # EXIF metadata display component
│   ├── ImageUploader.tsx    # Image upload interface
│   ├── ResultDisplay.tsx    # Analysis results component
│   └── ...
├── services/                # Core services and business logic
│   ├── exifService.ts       # EXIF metadata analysis
│   ├── geminiService.ts     # Gemini AI integration
│   └── messageBus.ts        # Inter-component communication
├── App.tsx                  # Root application component
├── vite.config.ts           # Vite configuration
└── ...
```

## Usage

1. **Upload an image** using the drag-and-drop interface or file picker

2. **Analysis pipeline:**
   - EXIF metadata scan identifies suspicious patterns or anomalies
   - AI visual analysis detects generation artifacts and inconsistencies
   - Results are combined for a final determination

3. **Review findings:**
   - Overall verdict with confidence percentage
   - Detailed reasoning for the determination
   - Complete EXIF metadata breakdown
   - Visual evidence viewer

## Future Development

Once Google releases the official SynthID detection API, this project will be updated to incorporate direct watermark detection, providing more accurate identification of Gemini-generated images. The current implementation serves as a functional proof-of-concept using available technologies.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Google's SynthID watermarking technology
- Powered by Google Gemini API
- Built with React and modern web technologies

---

**Note:** This tool is for educational and demonstration purposes. While it provides analysis based on metadata and AI detection, no detection system is 100% accurate. Always use multiple verification methods for critical authenticity assessments.