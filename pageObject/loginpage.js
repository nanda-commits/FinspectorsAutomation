class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = 'input[name="email"], input[type="email"], input[placeholder*="Email" i]';
        this.passwordInput = 'input[name="password"], input[type="password"], input[placeholder*="Password" i]';
        this.loginButton = 'button:has-text("Login")';
        this.loginUrl = 'http://stage.finspectors.ai/login';
    }

    async goto() {
        const startTime = Date.now();

        await this.page.route('**/*', async (route) => {
            const resourceType = route.request().resourceType();
            if (resourceType === 'image' || resourceType === 'media' || resourceType === 'font') {
                await route.abort();
                return;
            }
            await route.continue();
        });

        try {
            await this.page.goto(this.loginUrl, {
                waitUntil: 'commit',
                timeout: 5000,
            });

            const elapsed = Date.now() - startTime;
            if (elapsed > 5000) {
                throw new Error(`Login page did not become ready within 5 seconds (actual: ${elapsed}ms).`);
            }
        } finally {
            await this.page.unroute('**/*');
        }
    }
    async setZoom(value) {
        if (this.page.isClosed()) {
            return;
        }
        await this.page.evaluate((zoomValue) => {
            document.documentElement.style.zoom = String(zoomValue);
        }, value);
    }

    async login(username, password) {
        const emailCandidates = [
            this.page.locator(this.usernameInput).first(),
            this.page.getByPlaceholder(/email/i).first(),
            this.page.getByRole('textbox', { name: /email/i }).first(),
        ];

        let emailInput = null;

        const waitForAnyEmail = async (timeout) => {
            await Promise.any(
                emailCandidates.map((candidate) =>
                    candidate.waitFor({ state: 'visible', timeout })
                )
            );
        };

        try {
            await waitForAnyEmail(15000);
        } catch {
            await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
            await waitForAnyEmail(15000);
        }

        for (const candidate of emailCandidates) {
            const visible = await candidate.isVisible().catch(() => false);
            if (visible) {
                emailInput = candidate;
                break;
            }
        }

        if (!emailInput) {
            throw new Error('Login form is not visible after retrying login page load.');
        }

        await emailInput.fill(username);
        await this.page.fill(this.passwordInput, password);
        const loginButton = this.page.locator(this.loginButton);
        await loginButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForFunction(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find((item) => item.textContent?.trim() === 'Login');
            return !!button && !button.disabled;
        }, { timeout: 15000 });
        await loginButton.click();
    }
}

module.exports = LoginPage;