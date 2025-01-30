// Maximum number of pages to traverse
const maxPages = 20; // Adjust as needed
const saveEvery = 5; // Save a new CSV every X pages

let currentPage = 1;
let allContacts = [];

// Function to wait for contacts list to load
function waitForContacts() {
  return new Promise(resolve => {
    const checkExist = setInterval(() => {
      const listItems = document.querySelectorAll('ul li');
      if (listItems.length > 0) {
        clearInterval(checkExist);
        console.log(` Page ${currentPage} loaded with ${listItems.length} contacts found.`);
        resolve(listItems);
      }
    }, 1000); // Check every second
  });
}

// Function to extract contacts from the page (MODIFIED)
async function extractContacts() {
  console.log(` Extracting contacts from page ${currentPage}...`);
  const listItems = await waitForContacts();
  const contacts = [];

  listItems.forEach((li, index) => {
    const linkElement = li.querySelector('a[href*="miniProfile"]');
    const nameElement = li.querySelector('span span');
    const mb1Div = li.querySelector('.mb1');

    if (linkElement && nameElement && mb1Div) {
      const url = linkElement.getAttribute('href').split('?')[0];
      let name = nameElement.textContent.trim().split('View')[0].trim();
      const locationElement = mb1Div.querySelector('div:nth-child(3)');
      const location = locationElement ? locationElement.textContent.trim() : '';

      contacts.push({ url, name, location });
      console.log(` Contact ${index + 1}: Name=${name}, Location=${location}, URL=${url}`);

      // Check if already found 10 contacts
      if (contacts.length === 10) {
        console.log(` 10 contacts found on this page.`);
        return contacts; // Exit function and return contacts
      }
    }
  });

  console.log(`Found ${contacts.length} contacts on page ${currentPage}. Script will continue.`);
  return contacts;
}

// Function to navigate to next page (ADJUSTED)
async function goToNextPage() {
  try {
    let nextButton = null;
    let attempts = 0;
    const maxAttempts = 10; // Maximum number of attempts (ADJUST HERE IF NEEDED)

    // Wait until "Next page" button appears or max attempts reached
    while (attempts < maxAttempts && !nextButton) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second (ADJUST HERE IF NEEDED)

      // Try to find button with aria-label="Next" first
      nextButton = document.querySelector('[aria-label="Next"]');

      // If not found, try to find button with text "next"
      if (!nextButton) {
        nextButton = document.querySelector('button:contains("next")');
      }

      attempts++;
    }

    if (nextButton && currentPage < maxPages) {
      console.log(`➡️ Going to next page (${currentPage + 1})...`);
      nextButton.click();
      currentPage++;
      await waitForContacts(); // Wait for next page to load
      return true;
    }

    console.log(` No next page found or limit reached.`);
    return false;
  } catch (error) {
    console.error(" Error navigating to next page:", error);
    return false;
  }
}

// Function to convert contacts to CSV and download it (ADJUSTED)
function downloadCSV(contacts, page) {
  console.log(` Generating CSV with ${contacts.length} contacts up to page ${page}...`);

  if (contacts.length === 0) {
    console.warn(" No contacts collected. CSV file will not be generated.");
    return;
  }

  // Create CSV content
  let csvContent = "Name,Location,URL\n" + contacts.map(c => `"${c.name}","${c.location}","${c.url}"`).join("\n");

  // Display CSV in console
  console.log(" Generated CSV:\n", csvContent);

  // Create blob and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  // Filename with date and time (IMPROVEMENT)
  const now = new Date();
  const filename = `contacts_p${page}_${now.toISOString().replace(/[-T:]/g, '').slice(0, 14)}.csv`;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(` CSV "${filename}" downloaded successfully!`);
}

// Main function (MODIFIED)
async function scrapeContacts() {
  console.log(" Starting contact extraction...");

  for (let i = 0; i < maxPages; i++) {
    const contacts = await extractContacts();
    allContacts = allContacts.concat(contacts);

    // Save CSV every "saveEvery" pages
    if (currentPage % saveEvery === 0) {
      downloadCSV(allContacts, currentPage);
    }

    const hasNext = await goToNextPage();
    if (!hasNext) break;
  }

  // Download final CSV with all extracted contacts
  console.log(" Extraction completed. Downloading final CSV...");
  downloadCSV(allContacts, "final");
}

// Start the script
scrapeContacts();
