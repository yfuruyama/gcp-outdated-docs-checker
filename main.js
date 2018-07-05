const ORIGINAL_DOC_LANG = 'en';

function isDocumentPage(doc) {
  const lastUpdated = extractLastUpdated(doc);
  if (lastUpdated) {
    return true;
  } else {
    return false;
  }
}

function makeOriginalUrl(url) {
  const base = url.split('?')[0];
  return base + '?hl=' + ORIGINAL_DOC_LANG;
}

function fetchOriginalDoc(url) {
  const originalUrl = makeOriginalUrl(url);
  return fetch(originalUrl)
    .then(res => res.text())
    .then(text => new DOMParser().parseFromString(text, "text/html"));
}

function extractLastUpdated(doc) {
  const date = doc.getElementsByClassName('devsite-content-footer-date')[0];
  if (date) {
    return new Date(date.getAttribute('content'));
  } else {
    return undefined;
  }
}

function alertOutdated(currentUpdated, originalUpdated, originalUrl) {
  const months = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December",
  ];

  const currentDate = `${months[currentUpdated.getMonth()]} ${currentUpdated.getDate()}, ${currentUpdated.getFullYear()}`;
  const originalDate = `${months[originalUpdated.getMonth()]} ${originalUpdated.getDate()}, ${originalUpdated.getFullYear()}`;
  const alert = `
    <div style="width: 210px; height: 85px; background-color: red; color: white; padding: 10px; font-size: 14px; position: fixed; bottom: 5px; right: 0px; z-index: 99999999;">
      <span style="font-weight: bold;">Warning</span>: outdated document
      <div style="padding: 5px 0px 0px 0px; line-height: 1.3">
        This: ${currentDate}.<br/>
        <a href="${originalUrl}" target="_blank" style="color: white; text-decoration: underline;">Original</a>: ${originalDate}.
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = alert;
  document.body.appendChild(div);
}

(function() {
  if (!isDocumentPage(document)) {
    return;
  }

  const url = window.location.href;
  fetchOriginalDoc(url).then(doc => {
    const currentUpdated = extractLastUpdated(document);
    const originalUpdated = extractLastUpdated(doc);

    if (!(currentUpdated && originalUpdated)) {
      console.error('failed to get last updated date');
      return;
    }

    if (currentUpdated.getTime() < originalUpdated.getTime()) {
      alertOutdated(currentUpdated, originalUpdated, makeOriginalUrl(url));
    }
  }).catch(e => {
    console.error('failed to fetch original gcp document: ' + e);
  });
}());
