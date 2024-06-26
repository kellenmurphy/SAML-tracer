// This bootstrap.js file now acts as a background.js file in terms of a Web Extension. See here:
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Specifying_background_scripts
// The onOpenWindow event handler was slightly modified to be compatible with standard Firefox.

var browser = browser || chrome
browser.action.onClicked.addListener((tab) => showTracerWindow());

var tracerWindow = null;

function showTracerWindow() {
  if (tracerWindow != null) {
    // Window already opened -- just give it focus.
    browser.windows.update(tracerWindow.id, { focused: true }, null);
    return;
  }

  // If it wasn't yet opened or it was already closed -- create a new instance.
  let url = browser.runtime.getURL("/src/TraceWindow.html");
  let creating = browser.windows.create({
    url: url,
    type: "popup",
    height: 600,
    width: 800
  }, onCreated);

  if (creating) {
    // Firefox uses a promise for window creation
    creating.then(onCreated, onError); 
  }
}

function onCreated(windowInfo) {
  console.log(`Created window: ${windowInfo.id}`);

  // memorize the extension window, so that we can give it focus, if it's already opened.
  tracerWindow = windowInfo;
  browser.windows.onRemoved.addListener(onCloseExtensionWindow);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onCloseExtensionWindow(windowId) {
  console.log(`Window ${windowId} is closed. Setting "traceWindow" to null.`)
  tracerWindow = null
}
