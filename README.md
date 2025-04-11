# appgreat-task

## Prerequisites

1. Install Node.js
2. Install Playwright

## Setup

1. Clone this repository:
   git clone https://github.com/sbahrim/appgreat-task.git
   cd appgreat-task
  
2. Install dependencies:
  npm install

3. Create a .env file in the root directory and add your GitHub token:
GITHUB_TOKEN=your_github_token_here

5. Run Playwright to install the required browsers:
npx playwright install

## Running Tests

E2E Tests:
1. Ensure you have a valid storageState.json file for authentication. You can generate it by logging in to GitHub using Playwright:
npx playwright codegen https://github.com/login

Save the generated storage state as storageState.json in the root directory.

2. Run the E2E tests:
npm run tests:e2e

API Tests:
1. Ensure your .env file contains a valid GitHub token.
2. Run the API tests:
npm run tests:api

E2E test results will be available in the playwright-report directory or terminal.
API test results will be displayed in the terminal.

## Project Structure
page-objects: Contains Page Object Model (POM) classes for E2E tests.
api: Contains API test specifications.
e2e: Contains E2E test specifications.
playwright.config.ts: Configuration file for Playwright.

## Author: 
Sergiu Bahrim
