chrome.action.onClicked.addListener(bootStrapExtension);

async function bootStrapExtension() {
  const queryOptions = {
    url: 'chrome-extension://nflkmjkabjappoejnfcapabcpjbolpce/index.html',
    title: 'hrishix6 | HttpClient'
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
