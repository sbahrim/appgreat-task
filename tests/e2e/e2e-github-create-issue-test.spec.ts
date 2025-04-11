import { test } from '@playwright/test'
import { GithubIssuesPage } from '../../page-objects/GithubIssuesPage'
import { LoginPage } from '../../page-objects/LoginPage'

const issueTitle = `Test Issue - ${Date.now()}`
const issueDescription = 'This is a test created from UI'
const STORAGE_STATE_PATH = 'storageState.json'

test.describe('Github Issue E2E Test', () => {
  let loginPage: LoginPage
  let githubIssuesPage: GithubIssuesPage
  let page: any

  test.beforeAll(async ({ browser }) => {
    // Create a new browser context using the saved storage state
    const context = await browser.newContext({
      storageState: STORAGE_STATE_PATH, // Use the saved storage state
    })
    page = await context.newPage()

    loginPage = new LoginPage(page)
    githubIssuesPage = new GithubIssuesPage(page)
  })

  test('Create new issue', async () => {
    await githubIssuesPage.visit()
    await githubIssuesPage.createNewIssue(issueTitle, issueDescription)
    await githubIssuesPage.fillIssueDetails(issueTitle, issueDescription)
  })

  test('Validate new issue has been created', async () => {
    await githubIssuesPage.visit()
    await githubIssuesPage.checkIssueExists(issueTitle)
  })

  test('Delete the newly created issue', async () => {
    await githubIssuesPage.visit()
    await githubIssuesPage.deleteIssue(issueTitle)
  })

  test('Validate issue has been deleted', async () => {
    await githubIssuesPage.visit()
    await githubIssuesPage.checkIssueClosed(issueTitle)
  })
  
})
