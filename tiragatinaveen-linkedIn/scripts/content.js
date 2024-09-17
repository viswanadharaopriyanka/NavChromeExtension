function clickApplyButton() {
    const applyButton = document.querySelector('.jobs-apply-button');
    if(applyButton.role === 'link'){
      applyButton.click();
      link_exists = true;
      return true;
    }
    link_exists = false;
    return false;
  }
  
  let job_title;
  let job_desc;
  let job_link
  let all_data = [];
  let link_exists = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "clickApply") {
      const clicked = clickApplyButton();
      sendResponse({clicked: clicked});
    }
  });
  

  const button = document.createElement('button');
  button.textContent = 'Click Me';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';
  
  button.addEventListener('click', async() => {
    job_title = document.getElementsByClassName('t-24 t-bold inline')[0].innerText;
    // let desc = document.getElementsByClassName('mt4')[1].innerText;
    let about_section;
    if(document.getElementsByClassName('job-details-module__content') != undefined){
      about_section = document.getElementsByClassName('job-details-module__content');
      let desc;
      if(about_section.length === 3){
        desc = about_section[1].innerText
  
      }
      if(about_section.length === 2){
        desc = about_section[0].innerText
      }
    }else{
      about_section = document.getElementsByClassName('job-details-module');
      desc = about_section[2].innerText
    }

    let location = document.getElementsByClassName('job-details-jobs-unified-top-card__primary-description-container')[0].getElementsByTagName('span')[0].innerText
    let formated_location = location.replace(",","");
    formated_location = formated_location.replace(",","");
    job_desc=`"${desc?.replace(/"/g, '""')}"`;
    // console.log(job_desc)
    // console.log(job_title)
    await chrome.runtime.sendMessage({action: "initiateCapture"});
    await new Promise(resolve => setTimeout(resolve, (link_exists)?6000:2000)); // Wait for the page to load
    chrome.storage.local.get(['capturedUrl'], (result) => {
      // job_link = result.capturedUrl
      let jl = result.capturedUrl;
      console.log(jl)
      let data = {formated_location,job_title,jl,job_desc};
      all_data.push(data)
      chrome.storage.local.set({ 'extractedData': all_data });
    });
    let popup = document.createElement('p');
    popup.classList.add("custom_popup")
    popup.innerText = "Created Entry Sucessfully";
    popup.style.backgroundColor = "darkblue";
    popup.style.color = "white";
    popup.style.padding = "10px 20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    popup.style.position = "absolute";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.zIndex = "999";
    popup.style.fontFamily = "Arial, sans-serif";

    document.getElementsByClassName('job-details-jobs-unified-top-card__company-name')[0].appendChild(popup);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for the page to load
    popup.remove()
    

  });
  
  document.body.appendChild(button);
