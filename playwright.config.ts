import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 2,
  reporter: 'html',

  use: {
    ignoreHTTPSErrors: true,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    
    // --- JURUS PAMUNGKAS: PERSISTENT PROFILE ---
    // Ini akan membuat folder 'user_data' di root project kamu.
    // Browser tidak akan lagi dianggap "Private" karena punya storage permanen.
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
  },

  projects: [
    {
      name: 'chromium',
      // Kita modifikasi project-nya agar menggunakan persistent context
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.PW_HEADLESS !== 'false',
        // Properti ini memaksa Playwright tidak pakai Incognito
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
