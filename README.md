# FinMynd India 🇮🇳

A comforting, 100% private tax companion built with React, Vite, and Tailwind CSS. It is designed to help salaried Indian professionals make sense of tax filing, compute Section 87A marginal relief, compare old and new tax regimes, and securely analyze financial logs.

---

## 🚀 Deploying to GitHub Pages

If you are hosting this application on **GitHub Pages**, you might encounter a **404 Page Not Found** or asset loading issue initially. This guide describes why that happens and how to resolve it instantly.

### Why does a 404 occur?
1. **Repository Sub-directory Pathing**: By default, Vite builds assets relative to the root path `/`. When deployed to GitHub Pages at `https://<username>.github.io/<repo-name>/`, the browser tries to look for assets at the root domain rather than the repository subfolder.
2. **Missing Repository Homepage URL**: Without specifying the target `homepage` in `package.json`, automated deployment procedures or page generation might fail or target the wrong paths.

### 🛠️ What We Solved For You

To make this repository 100% ready for instant GitHub Pages deployment with your custom domain **finmynd.com**, we have already updated the following configurations:

1. **Vite Relative Asset Loading**: In `vite.config.ts`, we added `base: './'`. This forces Vite to generate relative import paths (like `./assets/...` instead of `/assets/...`). Your application will now load assets perfectly **no matter what folder, subfolder, or domain it is hosted on**.
2. **Repository Homepage & Custom Domain Declaration**: We updated `package.json` to include:
   ```json
   "homepage": "https://finmynd.com"
   ```
3. **Automatic CNAME Generation**: We created a `/public/CNAME` file containing:
   ```text
   finmynd.com
   ```
   *Vite automatically copies anything from the `/public` directory straight into the root of the `/dist` output directory when running `npm run build`. This prevents GitHub Pages from discarding your custom domain setting on subsequent deployments!*
4. **Resilient Direct-to-Client Form Fallback**: Since GitHub Pages is a static host and cannot run the optional Node.js Express background server (`server.ts`), we upgraded the contact/feedback form (`ContactForm.tsx`). If the backend proxy endpoint is unavailable, it automatically triggers a **zero-CORS client-side direct submission** to Google Forms using a sandboxed hidden iframe. Feedback routing works perfectly everywhere!

---

## 🌐 Custom Domain Setup for finmynd.com

To complete the setup of your custom domain on GitHub Pages, follow these three simple steps:

### Step 1: Configure your DNS Provider
Log in to your DNS provider (e.g., GoDaddy, Namecheap, Google Domains) and add the following records:

1. **For the Apex Domain (`finmynd.com`)**:
   Add **A records** pointing to GitHub Pages' IP addresses:
   * `185.199.108.153`
   * `185.199.109.153`
   * `185.199.110.153`
   * `185.199.111.153`

2. **For the Subdomain (`www.finmynd.com`)**:
   Add a **CNAME record** pointing `www` to your GitHub username pages domain:
   * Host/Name: `www`
   * Target/Value: `<your-github-username>.github.io`

### Step 2: Enable on GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** -> **Pages**.
3. Under **Custom domain**, enter `finmynd.com` and click **Save**. *(Since we built a CNAME file in our `/public` directory, this should already be filled or instantly validated).*

### Step 3: Enforce HTTPS
1. Still under **Settings** -> **Pages**, wait for your DNS check to pass.
2. Check the box for **Enforce HTTPS** to secure your traffic.

---

## 📦 How to Build and Publish to GitHub Pages

You can easily publish this to GitHub Pages using either of the two standard methods:

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

1. Create a file in your repository at `.github/workflows/deploy.yml` with the following content:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main  # change this to your default branch name if different

   permissions:
     contents: write

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Set up Node
           uses: actions/setup-node@v4
           with:
             node-cache: npm
             node-version: 20

         - name: Install dependencies
           run: npm ci

         - name: Build static site
           run: npm run build
           # Note: Vite compiles static SPA files into the 'dist/' folder

         - name: Deploy to GitHub Pages
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
             branch: gh-pages
   ```
2. Commit and push this workflow file.
3. In your GitHub Repository settings, go to **Settings** -> **Pages**:
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `gh-pages` and `/ (root)`.
   - Save the settings.

### Method 2: Manual Publish via `gh-pages` package

If you want to deploy quickly right from your terminal:

1. Install the `gh-pages` utility as a development dependency:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add a `deploy` script to your `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run the deployment script:
   ```bash
   npm run deploy
   ```
4. In your GitHub Repository settings under **Pages**, ensure the build source is set to deploy from the `gh-pages` branch.

---

## 🛠️ Local Development

To run the full-stack version of the application locally:

```bash
# Install dependencies
npm install

# Run the full-stack server (Vite middleware + Express API)
npm run dev
```

The application will launch on `http://localhost:3000`.
