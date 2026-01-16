# Setup Guide - Troubleshooting "Command Not Recognized" Error

## Common Error
```
'vite' is not recognized as an internal or external command
'npm' is not recognized as an internal or external command
'node' is not recognized as an internal or external command
```

## Why This Happens

### 1. Node.js/npm Not Installed
**Problem:** Node.js and npm are not installed on your system.

**Solution:**
1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (recommended)
3. During installation, make sure to check "Add to PATH" option
4. Restart your terminal/command prompt after installation
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 2. Node.js Not in PATH (Windows)
**Problem:** Node.js is installed but not accessible from command line.

**Solution for Windows:**
1. Find where Node.js is installed (usually `C:\Program Files\nodejs\`)
2. Add to PATH:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System Variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\nodejs\`
   - Click OK on all dialogs
   - **Restart your terminal/command prompt**

**Quick Check:**
```cmd
where node
where npm
```
If these show paths, Node.js is in PATH. If not, follow steps above.

### 3. Using Wrong Command
**Problem:** Trying to run `vite` directly instead of `npm run dev`

**Wrong:**
```bash
vite
```

**Correct:**
```bash
npm run dev
```

### 4. Not in Project Directory
**Problem:** Running commands from wrong directory.

**Solution:**
```bash
# Make sure you're in the project root directory
cd Frontend_Swiftclaim
# Then run commands
npm install
npm run dev
```

## Step-by-Step Setup (Windows)

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download "LTS" version (e.g., v20.x.x)
3. Run installer
4. **Important:** Check "Automatically install necessary tools" during installation
5. Complete installation

### Step 2: Verify Installation
Open **Command Prompt** (cmd) or **PowerShell** and run:
```cmd
node --version
npm --version
```

**Expected output:**
```
v20.x.x
10.x.x
```

If you see "not recognized", Node.js is not in PATH (see solution #2 above).

### Step 3: Clone Repository
```cmd
git clone <repository-url>
cd Frontend_Swiftclaim
```

### Step 4: Install Dependencies
```cmd
npm install
```

**This may take 2-5 minutes.** You should see packages being downloaded.

### Step 5: Start Development Server
```cmd
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://0.0.0.0:5173/
```

## Step-by-Step Setup (Mac/Linux)

### Step 1: Install Node.js
**Using Homebrew (Mac):**
```bash
brew install node
```

**Or download from:** https://nodejs.org/

### Step 2: Verify Installation
```bash
node --version
npm --version
```

### Step 3: Clone and Setup
```bash
git clone <repository-url>
cd Frontend_Swiftclaim
npm install
npm run dev
```

## Common Issues & Solutions

### Issue: "npm install" fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules & del package-lock.json  # Windows

# Try again
npm install
```

### Issue: "Permission denied" (Mac/Linux)
**Solution:**
```bash
# Don't use sudo with npm
# Instead, fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Issue: Port 5173 already in use
**Solution:**
```bash
# Kill process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.js
```

### Issue: "Cannot find module" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules  # Mac/Linux
rmdir /s node_modules  # Windows
npm install
```

## Commands Reference

| Command | What It Does |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check code for errors |
| `npm run preview` | Preview production build |

## Still Having Issues?

1. **Check Node.js version:**
   - Required: Node.js v14+ (v18+ recommended)
   - Check: `node --version`

2. **Check npm version:**
   - Required: npm v7+
   - Check: `npm --version`

3. **Try using npx:**
   ```bash
   npx vite
   ```

4. **Check if you're in the right directory:**
   ```bash
   # Should see package.json
   dir package.json  # Windows
   ls package.json   # Mac/Linux
   ```

5. **Verify package.json exists:**
   - Make sure you're in the project root
   - Should see `package.json` file

## Quick Test

Run these commands in order:
```bash
node --version    # Should show version number
npm --version     # Should show version number
cd Frontend_Swiftclaim
npm install       # Should install packages
npm run dev       # Should start server
```

If all work, you're good to go! 🎉
