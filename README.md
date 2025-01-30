# LinkedIn Contact Scraper

This script is a web scraping tool developed in JavaScript to automatically extract contact information from LinkedIn.

## 📋 Features

- Extracts basic LinkedIn contact information:
  - Name
  - Location
  - Profile URL
- Automatically navigates between pages
- Generates CSV files with collected data
- Saves data periodically to prevent information loss

## ⚙️ Settings

The script has some configurable variables:

- `maxPages`: Sets the maximum number of pages to traverse (default: 20)
- `saveEvery`: Sets how frequently to save the CSV (every X pages)

## 🔍 How It Works

1. The script starts by looking for contacts on the current page
2. For each contact found, it extracts:
   - Profile name
   - Location
   - Profile URL
3. After processing a page, it tries to navigate to the next one
4. Every X pages (defined by `saveEvery`), it saves a CSV file
5. Upon completion, it generates a final CSV with all contacts

## 📊 Output

- Generates CSV files with the format: `contacts_pX_YYYYMMDDHHMMSS.csv`
- Each file contains the columns: Name, Location, URL
- Files are automatically saved in the browser

## ⚠️ Notes

- The script is designed to collect up to 10 contacts per page
- Features a waiting system for element loading
- Includes error handling and detailed console logging
- Should be used responsibly and in accordance with LinkedIn's terms of use

## 🛠️ How to Use

1. Access the LinkedIn search results page
2. Open the browser console (F12)
3. Paste the script into the console
4. Execute the script and wait for data collection

## 📝 Logs

The script provides detailed logs in the browser console, showing:
- Number of contacts found per page
- Page navigation status
- CSV file generation moments
- Possible errors during execution 
