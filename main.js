const ORIGINAL_DOC_LANG = 'en';

function constructOriginalDocUrl(url) {
  const base = url.split('?')[0];
  return base + '?hl=' + ORIGINAL_DOC_LANG;
}

function fetchOriginalDoc(url) {
  const originalUrl = constructOriginalDocUrl(url);
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

function alertOutdated(currentLastUpdated, originalLastUpdated, originalDocUrl) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = `${monthNames[currentLastUpdated.getMonth()]} ${currentLastUpdated.getDate()}, ${currentLastUpdated.getFullYear()}`;
  const originalDate = `${monthNames[originalLastUpdated.getMonth()]} ${originalLastUpdated.getDate()}, ${originalLastUpdated.getFullYear()}`;
  const template = `
    <div style="width: 210px; height: 85px; background-color: red; color: white; padding: 10px; font-size: 14px; position: fixed; bottom: 5px; right: 0px; z-index: 99999999;">
      <span style="font-weight: bold;">Warning</span>: outdated document
      <div style="padding: 5px 0px 0px 0px; line-height: 1.3">
        current: ${currentDate}.<br/>
        <a href="${originalDocUrl}" target="_blank" style="color: white; text-decoration: underline;">original</a>: ${originalDate}.
      </div>
    </div>
  `;
  var div = document.createElement( "div" );
  div.innerHTML = template;
  document.body.appendChild(div);
}

(function() {
  const url = window.location.href;
  fetchOriginalDoc(url).then(doc => {
    const currentLastUpdated = extractLastUpdated(document);
    const originalLastUpdated = extractLastUpdated(doc);
    console.log(currentLastUpdated);
    console.log(originalLastUpdated);

    if (!(currentLastUpdated && originalLastUpdated)) {
      console.error('failed to get last updated date');
      return;
    }

    if (currentLastUpdated.getTime() < originalLastUpdated.getTime()) {
      alertOutdated(currentLastUpdated, originalLastUpdated, constructOriginalDocUrl(url));
    }
  }).catch(e => {
    console.error('failed to fetch original gcp document: ' + e);
  });
  console.log('end');
}());
