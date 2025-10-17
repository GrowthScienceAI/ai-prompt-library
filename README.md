# AI Prompt Library

A comprehensive, searchable library of AI prompts for various use cases. Built with vanilla JavaScript, HTML, and CSS.

## Features

- **Searchable Library**: Search through thousands of AI prompts by name or content
- **Copy to Clipboard**: One-click copy functionality for all prompts
- **View Full Prompts**: Expand to view complete prompt details
- **Submit Prompts**: Community-driven - users can submit their own prompts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Login Required**: Free access to all prompts without account creation

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript
- Netlify Forms (for prompt submissions)

## Color Scheme

- Dark Blue: `#052539`
- Blue: `#57a9f4`
- Light Blue: `#a4d6fe`
- Medium Blue: `#155372`
- Blue/Grey: `#527f9f`

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/GrowthScienceAI/ai-prompt-library.git
   cd ai-prompt-library
   ```

2. Open with a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve
   ```

3. Open your browser to `http://localhost:8000`

## Deployment

This site is configured for deployment on Netlify:

1. Push to GitHub
2. Connect repository to Netlify
3. Netlify will automatically detect the configuration from `netlify.toml`
4. Deploy!

### Manual Deployment

You can also deploy to any static hosting service (GitHub Pages, Vercel, Cloudflare Pages, etc.) by uploading the files.

## Project Structure

```
ai-prompt-library/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles
│   ├── js/
│   │   └── main.js         # Application logic
│   └── data/
│       └── prompts.csv     # Prompt data
├── netlify.toml            # Netlify configuration
├── .gitignore
└── README.md
```

## Data Format

Prompts are stored in CSV format:

```csv
Name,Prompt
"Prompt Name","Prompt content here..."
```

## Form Submissions

The prompt submission form uses Netlify Forms. Submissions are automatically sent to the configured email address (tom@tom-panos.com).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 Tom Panos. All rights reserved.

## Contact

For questions or suggestions, reach out to tom@tom-panos.com
