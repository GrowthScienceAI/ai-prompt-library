# Netlify Deployment Guide

Follow these steps to deploy your AI Prompt Library to Netlify:

## Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Log in to Netlify**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub account

2. **Import your repository**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account if needed
   - Select the `ai-prompt-library` repository

3. **Configure build settings**
   - Netlify should automatically detect the configuration from `netlify.toml`
   - Verify the following settings:
     - **Build command**: `echo 'No build command needed'` (or leave empty)
     - **Publish directory**: `.` (root directory)
   - Click "Deploy site"

4. **Configure form notifications**
   - After deployment, go to **Site settings** → **Forms**
   - Click on **Form notifications**
   - Add an email notification to `tom@tom-panos.com`
   - This ensures prompt submissions are sent to your email

5. **Set up custom domain (Optional)**
   - Go to **Domain settings**
   - Click "Add custom domain"
   - Follow instructions to connect your domain
   - Suggested: `prompts.tom-panos.com` or similar

## Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy from project directory**
   ```bash
   cd /Users/tpanos/Desktop/Builds/ai-prompt-library
   netlify deploy --prod
   ```

4. **Follow the prompts**
   - Create a new site or link to existing
   - Confirm the publish directory (`.`)

## Post-Deployment Checklist

- [ ] Visit your deployed site and test the search functionality
- [ ] Test copying a prompt to clipboard
- [ ] Submit a test prompt through the form
- [ ] Verify you receive the test submission email at tom@tom-panos.com
- [ ] Test on mobile devices
- [ ] Update the link on tom-panos.com to point to your new prompt library

## Updating the Site

To make changes after deployment:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Netlify will automatically rebuild and deploy (if continuous deployment is enabled)

## Troubleshooting

### Forms not working?
- Ensure the form has `data-netlify="true"` attribute (already included)
- Check Form notifications are configured in Netlify dashboard
- Verify email address in notifications

### CSV not loading?
- Check browser console for errors
- Ensure `prompts.csv` exists in `assets/data/`
- Verify file is included in git repository

### Site not updating?
- Check the Deploys tab in Netlify dashboard
- Verify your latest commit is being deployed
- Clear cache and hard reload browser (Cmd+Shift+R on Mac)

## Site URLs

- **GitHub Repository**: https://github.com/GrowthScienceAI/ai-prompt-library
- **Netlify Site**: Will be provided after deployment
- **Link from**: https://tom-panos.com

## Support

For issues or questions, contact tom@tom-panos.com
