import { expect, Locator, Page } from '@playwright/test'

export class LoginPage {
    
    readonly page:Page
    readonly signInButton: Locator
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly submitButton: Locator

    constructor(page: Page) {
        this.page = page
        this.usernameInput = page.locator('#login_field')
        this.passwordInput = page.locator('#password')
        this.submitButton = page.locator('button:has-text("Sign in")');
    }

    async visit() {
        await this.page.goto('https://github.com/login')
    }

    async login(username:string, password:string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.submitButton.click()
        await this.page.waitForTimeout(5000)
    }
}