const ORIGINAL_DOC_LANG = 'en';

function fetchOriginalDoc(url) {
  const base = url.split('?')[0];
  const originalUrl = base + '?hl=' + ORIGINAL_DOC_LANG;
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

function alertOutdated(doc, currentLastUpdated, originalLastUpdated) {
  alert('outdated!: ' + currentLastUpdated + " " + originalLastUpdated);
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
      alertOutdated(document, currentLastUpdated, originalLastUpdated);
    }
  }).catch(e => {
    console.error('failed to fetch original gcp document: ' + e);
  });
  console.log('end');
}());
