import { defineConfig } from '@playwright/test';
export default defineConfig({
    use: {
        headless: true,
        baseURL: 'https://example.com',
        trace: 'on',
    },
});