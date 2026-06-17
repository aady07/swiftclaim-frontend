# Miraista Frontend

## Overview
Miraista's frontend application for insurance claim processing. This repository contains the production codebase for the client-facing web application.

## Development Setup

### Requirements
- Node.js v14+
- npm v7+
- Git

### Local Development

#### Prerequisites
- **Node.js v14+** (v18+ recommended) - [Download here](https://nodejs.org/)
- **npm v7+** (comes with Node.js)
- **Git**

#### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend_Swiftclaim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   ⚠️ **Note:** If you get "npm is not recognized", install Node.js first (see SETUP_GUIDE.md)

3. **Create environment file (optional)**
   ```bash
   # Windows:
   copy .env.example .env
   
   # Mac/Linux:
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at: `http://localhost:5173`

#### Troubleshooting
If you encounter "command not recognized" errors, see [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting steps.

### Environment Variables
Required environment variables:
- `VITE_API_URL`: Backend API endpoint
- `VITE_APP_NAME`: Application name
- `VITE_APP_ENV`: Environment (development/production)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chatbot/        # Chatbot interface components
│   ├── claims/         # Claim processing components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── styles/             # Global styles
└── utils/              # Utility functions
```

## Key Components

### Chatbot System
- `Chatbot3D.jsx`: Main chatbot interface with 3D avatar
- `useChatLogic.js`: Chatbot state management and API integration
- Supports voice interaction and bilingual communication

### Claim Processing
- `ClaimUploadUI.jsx`: Document upload and processing interface
- Real-time damage assessment
- Cost estimation and report generation

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow component naming conventions

### Git Workflow
1. Create feature branch from `develop`
2. Follow branch naming: `feature/JIRA-123-description`
3. Submit PR to `develop` branch
4. Require minimum 1 reviewer approval

### Testing
- Run unit tests: `npm test`
- Run E2E tests: `npm run test:e2e`
- Maintain minimum 80% test coverage

## Deployment

### Staging
- Automatic deployment on merge to `develop`
- Deployed to: `https://staging.miraista.com`

### Production
- Manual deployment from `main` branch
- Deployed to: `https://app.miraista.com`
- Requires team lead approval

## API Integration

### Endpoints
- Damage Assessment: `https://uat-api.miraista.com/v1/upload`
- Chat Processing: `https://uat-api.miraista.com/v1/chat`

### Authentication
- JWT-based authentication
- Token refresh mechanism implemented
- Session management handled by `useAuth` hook

## Performance Monitoring

### Metrics
- Page load time
- API response time
- Error rates
- User interaction metrics

### Tools
- New Relic for performance monitoring
- Sentry for error tracking
- Google Analytics for user behavior

## Security

### Requirements
- Regular dependency updates
- Security audit compliance
- Data encryption standards
- XSS prevention measures

### Best Practices
- Input validation
- CSRF protection
- Secure cookie handling
- API rate limiting

## Support

### Internal Resources
- JIRA: Project tracking
- Confluence: Documentation
- Slack: Team communication

### Contact
- Tech Lead: [Name] (email)
- DevOps: [Name] (email)
- Security: [Name] (email)

## License
Proprietary - Miraista Inc. All rights reserved.
