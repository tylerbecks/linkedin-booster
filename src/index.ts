import { chromium, type Page } from 'playwright';

async function main() {
  console.log('Starting LinkedIn profile viewer...');

  // Launch browser using existing Chrome profile
  const context = await chromium.launchPersistentContext('./user-data-dir', {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1280, height: 720 },
  });

  console.log('Browser launched with persistent context.');

  const page = await context.newPage();

  try {
    // Navigate to connections page
    console.log('Navigating to LinkedIn connections page...');
    await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');

    // Wait for connections to load
    console.log('Waiting for connections to load...');
    await page.waitForSelector('.mn-connection-card');

    // Scroll to load all connections
    console.log('Loading all connections...');
    await loadAllConnections(page);

    // Get all connection links
    console.log('Extracting connection links...');
    const connectionLinks = await page.$$eval(
      '.mn-connection-card',
      (cards) =>
        cards.map((card) => card.querySelector('a[href^="/in/"]')?.getAttribute('href')).filter(Boolean) as string[]
    );

    console.log(`Found ${connectionLinks.length} connections`);

    // Visit each profile
    for (let i = 295; i < connectionLinks.length; i++) {
      const link = connectionLinks[i];
      console.log(`Visiting profile ${i + 1}/${connectionLinks.length}: ${link}`);

      let profilePage = null;
      try {
        // Create new page
        profilePage = await context.newPage();

        // Navigate to profile
        console.log(`Navigating to profile: ${link}`);
        await profilePage.goto(`https://www.linkedin.com${link}`);

        // Ensure the profile is loaded
        console.log('Waiting for profile to load...');

        // Small delay to ensure profile view is registered
        console.log('Waiting for a short delay to register profile view...');
        // wait for 1-2 seconds
        const delay = Math.floor(Math.random() * 1000) + 500;
        await page.waitForTimeout(delay);
      } catch (error) {
        console.error(`Error visiting profile ${link}:`, error);
      } finally {
        // Always close the profile page, even if there was an error
        if (profilePage) {
          try {
            console.log('Closing profile page...');
            await profilePage.close();
            profilePage = null;
          } catch (closeError) {
            console.error('Error closing profile page:', closeError);
          }
        } else {
          console.error('Profile page was not opened, skipping close step.');
        }
      }

      // Random delay between profile visits (1-3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 500;
      console.log(`Waiting for ${delay}ms before visiting next profile...`);
      await page.waitForTimeout(delay);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close browser
    console.log('Closing browser...');
    await context.close();
  }
}

// Helper function to scroll and load all connections
async function loadAllConnections(page: Page) {
  let previousCount = 0;
  let currentCount = 0;

  console.log('Loading connections...');

  while (true) {
    try {
      // Check for "Load more" button and click it if present
      const loadMoreButton = await page.locator('.scaffold-finite-scroll__load-button').first();
      if (loadMoreButton) {
        console.log('Clicking "Load more" button...');
        await loadMoreButton.click();
        await page.waitForTimeout(1000); // Wait for new content to load
      }

      // Scroll to bottom
      console.log('Scrolling to bottom of the page...');
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.waitForTimeout(1000); // Wait for potential new content

      // Count current connections
      currentCount = await page.$$eval('.mn-connection-card', (cards) => cards.length);

      console.log(`Current connection count: ${currentCount}`);

      // Check if we're still loading new connections
      if (currentCount === previousCount) {
        console.log('No new connections loaded after multiple attempts, finishing...');
        break;
      } else {
        console.log(`New connections loaded: ${currentCount - previousCount}`, {
          previousCount,
          currentCount,
        });
      }

      previousCount = currentCount;

      // Small random delay between scrolls/clicks
      await page.waitForTimeout(1000 + Math.random() * 1000);
    } catch (error) {
      console.error('Error during connection loading:', error);
      break;
    }
  }

  console.log(`Finished loading connections. Total found: ${currentCount}`);
  return currentCount;
}

// Run the main function and handle any errors
main().catch(console.error);
