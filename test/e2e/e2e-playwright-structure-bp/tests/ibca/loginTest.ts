import { test, expect } from '@playwright/test';
import { PageFactory } from '../../factory/pageFactory';

test('User should be able to log in', async ({ page }) => {
  const loginPage = await PageFactory.getLoginPage(page);
  await loginPage.navigate('/login');
  await loginPage.login('testuser', 'password123');

  const dashboardPage = await PageFactory.getDashboardPage(page);
  expect(await dashboardPage.getTitle()).toBe('Dashboard');
});
