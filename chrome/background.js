const APP_URL = "HttpParrot.html";
const APP_TITLE = 'hrishix6 | HttpParrot';

/**
 * bootstrap application in  a tab, handle duplication, load extension session rules for CORS.
 */
async function bootStrapExtension() {
  const queryOptions = {
    url: `chrome-extension://*/${APP_URL}`,
    title: APP_TITLE
  };

  let myApp;

  const [mytab] = await chrome.tabs.query(queryOptions);

  if (mytab) {
    if (!mytab.active) {
      await chrome.tabs.update(mytab.id, { active: true });
    }
    myApp = mytab.id;
  } else {
    //tab doesn't exist, create a new tab.
    const createdTab = await chrome.tabs.create({ url: APP_URL});
    myApp = createdTab.id;
  }

  console.log(`updating session rule for ${myApp}`);

  await UpdateExtensionRules(myApp);

  console.log(`updated session rule for ${myApp}`);
}

/***
 * Duplication of tab is currently not allowed as synching app state across tabs isn't implemented yet.
 */
async function HandleDuplication(tab) {
  const queryOptions = {
    url: `chrome-extension://*/${APP_URL}`,
    title: APP_TITLE
  };

  const [mytab] = await chrome.tabs.query(queryOptions);

  if (tab.title === queryOptions.title) {
    await chrome.tabs.remove(mytab.id);
    console.log(`updating session rule for ${tab.id}`);
    await UpdateExtensionRules(tab.id);
    console.log(`updating session rule for ${tab.id}`);
  }
}

/**
 * 
 * @param {*} tabId tab for which rule should be enabled.
 */
async function UpdateExtensionRules(tabId)
{
  const ModifyHeadersRule = {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "modifyHeaders",
      "requestHeaders": [
        { "header": "origin", "operation": "remove" },
        { "header": "cookie", "operation": "remove" },
        { "header": "Sec-Ch-Ua", "operation": "remove" },
        { "header": "Sec-Ch-Ua-Mobile", "operation": "remove" },
        { "header": "Sec-Ch-Ua-Platform", "operation": "remove" },
        { "header": "Accept", "operation": "set", "value":"*/*"},
        { "header": "User-Agent", "operation": "set", "value":"hrishix6/HttpParrot"},
        { "header": "Dnt", "operation": "set", "value":"0"}
    ]
    },
    "condition": {"urlFilter" : "*", tabIds: [tabId]}
};

  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1],
    addRules: [ModifyHeadersRule]
  });

}


chrome.action.onClicked.addListener(bootStrapExtension);

chrome.tabs.onCreated.addListener(HandleDuplication);