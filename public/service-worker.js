chrome.action.onClicked.addListener(bootStrapExtension);

chrome.tabs.onCreated.addListener(HandleDuplication);

async function bootStrapExtension() {
  const queryOptions = {
    url: 'chrome-extension://nflkmjkabjappoejnfcapabcpjbolpce/index.html',
    title: 'hrishix6 | HttpParrot'
  };

  const [mytab] = await chrome.tabs.query(queryOptions);

  if (mytab) {
    if (!mytab.active) {
      await chrome.tabs.update(mytab.id, { active: true });
    }
  } else {
    //tab doesn't exist, create a new tab.
    await chrome.tabs.create({ url: 'index.html' });
  }
}

/***
 * Duplication of tab is currently not allowed as synching app state across tabs isn't implemented yet.
 */
async function HandleDuplication(tab) {
  const queryOptions = {
    url: 'chrome-extension://nflkmjkabjappoejnfcapabcpjbolpce/index.html',
    title: 'hrishix6 | HttpParrot'
  };

  const [mytab] = await chrome.tabs.query(queryOptions);

  if (tab.title === queryOptions.title) {
    chrome.tabs.remove(mytab.id);
  }
}
