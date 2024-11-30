# LinkedIn Booster

This script automates viewing LinkedIn profiles from your connections list, which sends them a notification that you've viewed their profile. This can be a useful way to maintain network visibility and engagement.

## Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Google Chrome installed
- An active LinkedIn account logged in through Chrome

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/tylerbecks/linkedin-booster
   cd linkedin-profile-viewer
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Set up your Chrome profile:

   - Open Chrome and go to `chrome://version`
   - Look for "Profile Path"
   - Copy your profile directory (usually named "Default" or "Profile 1")

4. Create the necessary directories and copy your Chrome profile:

   For macOS

   ```bash
   cp -r "$HOME/Library/Application Support/Google/Chrome/Default" ./user-data-dir
   ```

   For Windows

   ```bash
   xcopy "%LOCALAPPDATA%\Google\Chrome\User Data\Default" "user-data-dir" /E /I /H
   ```

   For Linux

   ```bash
   cp -r ~/.config/google-chrome/Default ./user-data-dir
   ```

## Usage

Note: I had to run this once and log into the chromium browser manually, your profile should be logged into the chromium browser the next time you run the script.

Run the script using:

```bash
bun run start
```

The script will:

1. Open Chrome using your profile
2. Navigate to your LinkedIn connections
3. Load all connections by scrolling and clicking "Load more"
4. Visit each profile briefly to trigger a profile view notification
5. Close automatically when complete

## Configuration

You can modify the following parameters in `src/index.ts`:

- Delay between profile visits (currently 2-5 seconds random)
- Wait time on each profile (currently 1 second)
- Number of retry attempts for loading connections

## Safety & Privacy Notes

- Use this script responsibly and in accordance with LinkedIn's terms of service
- The script includes random delays to mimic human behavior
- Consider running during off-peak hours
- Monitor your account for any warnings from LinkedIn
- This script only works with your existing connections

## Troubleshooting

If you encounter issues:

1. Ensure you're logged into LinkedIn in Chrome
2. Check that you've copied the correct Chrome profile
3. Try running with `show: true` to see what's happening
4. Check the console for error messages
