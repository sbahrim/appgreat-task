import {expect, Locator, Page} from '@playwright/test'

export class GithubIssuesPage {
    readonly page:Page
    readonly createNewIssueButton: Locator
    readonly newIssueTitleField: Locator
    readonly newIssueDescriptionField: Locator
    readonly createButton: Locator
    readonly closeIssueButton: Locator
    readonly closedConfirmationLabel: Locator

    constructor(page: Page) {
        this.page = page;
        // this.createNewIssueButton = page.locator('link[name="New issue"]');

        this.createNewIssueButton = page.getByRole('link', { name: 'New issue', exact: true })
        this.newIssueTitleField = page.locator('input[placeholder="Title"]')
        this.newIssueDescriptionField = page.locator('textarea[placeholder="Type your description here…"]')
        this.createButton = page.locator('button[data-testid="create-issue-button"]')
        this.closeIssueButton =  page.getByRole('button', { name: 'Close issue' })
        this.closedConfirmationLabel = page.getByText('playwrightappgreatuserclosed')

    }

    async visit() {
        await this.page.goto('https://github.com/sbahrim/appgreat-task/issues');
        await this.page.waitForTimeout(2000); // Wait for the page to load
    }

    async createNewIssue(issueTitle:string, issueDescription:string) {
        await this.createNewIssueButton.click();
    }

    async fillIssueDetails(issueTitle:string, issueDescription:string) {
        await expect(this.newIssueTitleField).toBeVisible({ timeout: 10000 });
        await this.newIssueTitleField.fill(issueTitle);
        await this.newIssueDescriptionField.fill(issueDescription);
        await this.createButton.click();
        await expect(this.closeIssueButton).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000); // Wait for issue to be created before going to issues list
        console.log(`Issue "${issueTitle}" has been created`);
    }

    async checkIssueExists(issueTitle:string) {
        const issueLocator = this.page.locator(`text=${issueTitle}`);
        const issueExists = await issueLocator.isVisible({ timeout: 10000 });
        if (issueExists) {
            console.log(`Issue "${issueTitle}" exists`);
        } else {
            throw new Error(`Issue "${issueTitle}" does not exist`);
        }
    }

    async deleteIssue(issueTitle:string) {
        const issueLocator = this.page.locator(`text=${issueTitle}`);
        await issueLocator.click();
        await this.closeIssueButton.click();
        await expect(this.closedConfirmationLabel).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(3000); // Wait to make sure issue is really closed before going to issues list
        console.log(`Issue "${issueTitle}" has been closed`);
    }

    async checkIssueClosed(issueTitle:string) {
        const issueLocator = this.page.locator(`text=${issueTitle}`);
        const issueExists = await issueLocator.isVisible({ timeout: 3000 });
        if (!issueExists) {
            console.log(`Issue "${issueTitle}" has been deleted`);
        } else {
            throw new Error(`Issue "${issueTitle}" was not deleted as expected`);
        }
    }
}
