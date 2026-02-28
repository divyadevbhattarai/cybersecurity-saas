# Contribution Guidelines

## Development Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/divyadevbhattarai/cybersecurity-saas-monorepo.git
   cd cybersecurity-saas-monorepo
   ```
2. Install required dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and set up the necessary environment variables.

## Coding Standards
- Follow the [JavaScript Standard Style](https://standardjs.com/).
- Use meaningful variable and function names.
- Consistently use single quotes for strings.

## Pull Request Process
1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Make your changes and commit them:
   ```bash
   git commit -m 'Add some feature'
   ```
3. Push your branch to GitHub:
   ```bash
   git push origin feature/my-feature
   ```
4. Submit a pull request to the `main` branch, providing a clear description of your changes.

## Code Review Checklist
- [ ] Code is well organized and clear
- [ ] Unit tests have been added/updated
- [ ] Documentation has been updated (if necessary)
- [ ] No console logs are present in production code

## Testing Requirements
- Ensure all tests pass:
   ```bash
   npm test
   ```
- Add tests for new features or bug fixes where applicable.
