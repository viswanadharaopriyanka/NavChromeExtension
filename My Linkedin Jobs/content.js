let job_title;
let job_desc;
let job_link;
let all_data = [];
let link_exists = true; // Initialize link_exists

function clickApplyButton() {
  const applyButton = document.querySelector(".jobs-apply-button");
  if (applyButton && applyButton.role === "link") {
    applyButton.click();
    link_exists = true;
    return true;
  } else {
    console.error("Apply button not found");
    link_exists = false;
    return false;
  }
}

async function scrapeJobDetails() {
  try {
    // Scrape job title
    const jobTitleElement = document.querySelector(".t-24.t-bold.inline");
    job_title = jobTitleElement
      ? jobTitleElement.innerText
      : "No title available";

    // Scrape job description
    const aboutSection = document.querySelectorAll(
      ".job-details-module__content"
    );
    let desc =
      aboutSection.length >= 2
        ? aboutSection[0].innerText
        : "No description available";

    // Scrape location
    const locationElement = document.querySelector(
      ".job-details-jobs-unified-top-card__primary-description-container span"
    );
    const location = locationElement
      ? locationElement.innerText.replace(/,/g, "")
      : "No location available";

    job_desc = `"${desc.replace(/"/g, '""')}"`;

    // Click Apply button and handle new tab
    const clicked = clickApplyButton();

    // If a new tab is opened, capture the URL and close the tab
    if (clicked) {
      const newTabUrl = await captureNewTabUrl();
      if (newTabUrl) {
        job_link = newTabUrl;
      } else {
        job_link = "No link provided";
      }
    }

    let data = { formated_location: location, job_title, job_link, job_desc };
    all_data.push(data);

    // Store the extracted data
    chrome.storage.local.set({ extractedData: all_data });

    // Display success popup
    displayPopup("Created Entry Successfully");
  } catch (error) {
    console.error("Error scraping job details: ", error);
  }
}

async function captureNewTabUrl() {
  return new Promise((resolve) => {
    // Listen for a new tab being opened
    chrome.tabs.onCreated.addListener(function (tab) {
      const newTabId = tab.id;

      // Check if the new tab's URL contains something meaningful
      chrome.tabs.onUpdated.addListener(function (
        tabId,
        changeInfo,
        updatedTab
      ) {
        if (tabId === newTabId && changeInfo.status === "complete") {
          const jobUrl = updatedTab.url;
          console.log("Captured URL: ", jobUrl);

          // Close the tab after capturing the URL
          chrome.tabs.remove(newTabId, function () {
            console.log("Closed the new tab");
            resolve(jobUrl);
          });
        }
      });
    });
  });
}

function displayPopup(message) {
  let popup = document.createElement("p");
  popup.classList.add("custom_popup");
  popup.innerText = message;
  popup.style.cssText = `
    background-color: darkblue; color: white; padding: 10px 20px; border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); position: absolute; top: 20px; right: 20px;
    z-index: 999; font-family: Arial, sans-serif;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

const button = document.createElement("button");
button.textContent = "Scrape Job";
button.style.cssText = `
  position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px 15px;
  background-color: #0073b1; color: white; border: none; border-radius: 5px;
  font-size: 14px; cursor: pointer;
`;

button.addEventListener("click", scrapeJobDetails);
document.body.appendChild(button);
