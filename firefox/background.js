browser.browserAction.onClicked.addListener(()=> {
    browser.tabs.create({
        active: true,
        url: "./HttpParrot.html"
    }).then(()=> {
        console.log('extension page opened');
    }).catch(err => {
        console.log(err);
        console.log('error creating tab');
    });
});
browser.webRequest.onBeforeSendHeaders.addListener(
    (e)=> {
       const isRequestFromExtensionPage = e.documentUrl.endsWith("HttpParrot.html");
        if(isRequestFromExtensionPage) {
            const newHeaders = e.requestHeaders.filter((header) => {
                const name = header.name.toLowerCase();
               return !(name == "origin" || name == "cookie")
            });
            newHeaders.forEach((header)=> {
                if(header.name.toLowerCase() === "user-agent")
                {
                    header.value = "hrishix6/HttpParrot";
                }
            });

            return {requestHeaders: newHeaders};
        }
        return { requestHeaders: e.requestHeaders };
    },
    {urls: ["<all_urls>"], types: ["xmlhttprequest"]},
    ["blocking", "requestHeaders"]
);
