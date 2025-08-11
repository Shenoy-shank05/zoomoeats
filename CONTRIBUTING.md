# Contributing to ZoomoEats

Thank you for your interest in contributing to ZoomoEats! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/zoomoeats11.git
   cd zoomoeats11
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   docker compose up -d db
   npx prisma migrate dev --name init
   npm run seed
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   npm install
   npm start
   ```

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Backend tests
   cd backend
   npm run test
   
   # Frontend tests
   npm test
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend Testing
```bash
npm test              # Run tests
npm run test:coverage # Coverage report
```

## 📝 Code Style

### Backend (NestJS/TypeScript)
- Use TypeScript strict mode
- Follow NestJS conventions
- Use Prisma for database operations
- Implement proper error handling
- Add JSDoc comments for public APIs

### Frontend (React/JavaScript)
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error boundaries
- Add PropTypes or TypeScript types

### General Guidelines
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Follow DRY (Don't Repeat Yourself) principle
- Ensure code is accessible (a11y)

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description** - Clear description of the issue
2. **Steps to Reproduce** - Detailed steps to reproduce the bug
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - OS, Node.js version, browser, etc.
6. **Screenshots** - If applicable

## 💡 Feature Requests

For feature requests, please provide:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other solutions considered
4. **Additional Context** - Any other relevant information

## 📋 Pull Request Process

1. **Update Documentation** - Update README.md if needed
2. **Add Tests** - Ensure new code is tested
3. **Update Changelog** - Add entry to CHANGELOG.md
4. **Review Checklist** - Complete the PR template
5. **Request Review** - Tag relevant maintainers

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🏗️ Architecture Guidelines

### Backend Structure
```
backend/src/
├── auth/           # Authentication module
├── users/          # User management
├── restaurants/    # Restaurant operations
├── dishes/         # Menu management
├── cart/           # Shopping cart
├── orders/         # Order processing
├── payments/       # Payment handling
└── common/         # Shared utilities
```

### Frontend Structure
```
src/
├── auth/           # Authentication pages
├── services/       # API services
├── context/        # React context
├── components/     # Reusable components
└── pages/          # Page components
```

## 🔒 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication/authorization
- Follow OWASP security guidelines

## 📞 Getting Help

- **Issues** - Create a GitHub issue
- **Discussions** - Use GitHub Discussions
- **Documentation** - Check the README.md

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ZoomoEats! 🍕🚀
