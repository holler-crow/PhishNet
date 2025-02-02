
// Define types of suspicious wording
const improper = [
    /a[n][\s=]+important[\s=]+documents/g,
    /lift[\s=]+up[\s=]+this[\s=]+restriction/g,
    /link[\s=]+bellow/g
]
const urgent = [
    /(important|urgent)[ ]+(notification|info|alert)/g,
    /(contact|call)[\w ]+immediately/g,
    /lost[\s=]+(permanently|forever)/g,
    /(within|after)[\s]+[0-9]+[\s]+(hours|days)/g
]
const request = [
    /(login[\s=]+to[\s=]+your[\s=]+account)/g,
    /(verify[\s=]+your[\s=]+account)/g,
    /(update[\s=]+your[\s=]+information)/g,
    /(password[\s=]+reset)/g,
    /(fill)[\s=]+(out|in)*necessary[\s=]+fields/g,
    /extra[\s=]+verification/g
]
const vague = [
    /(Dear|Hello|Hi)*(customer|client|user|friend|member|account holder)[,:]/g,
    /(account|access|banking)\s(was|is|will be|has been| might be)\s(frozen|limited|blocked|compromised|closed|locked|deleted|deactivated)/g,
    /regular(ly)? screening/g,
    /illegal[\s=]+internet[\s=]+activities/g,
    /account[\s=]+suspension/g,
    /[\-\w]+: [\w \(\),\[\]\<\.:]+[\S\n]\n[^\w]+\Z/g,
]
const urls = [
    /https?:\/\/[^\s]+(\.com|\.co\.uk|\.gov)\.[0-9a-zA-Z\-]/g,
    /signin.ebay.com/g,
    /https?:\/\/+(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/g,
    /http:\/\/mail.yahoo.com\/config\/login?/g
]

const LIMIT = 2;

// Count the number of times that patterns
// from an array of patterns are found in the text.
function detectHelper(patterns, text) {
    let sum = 0;
    for (const pattern in patterns) {
        let iter = text.matchAll(pattern);
        sum += [...iter].length;    
    }
    return sum;
}

function detect(text) {
    let numImproper = detectHelper(improper, text);
    let numUrgent = detectHelper(urgent, text);
    let numRequest = detectHelper(request, text);
    let numVague = detectHelper(vague, text);
    let numSusURLs = detectHelper(urls, text);

    let sum = numImproper + numUrgent + numRequest + numVague + numSusURLs;

    console.log(`Urgent language detected ${numUrgent} times.`);
    console.log(`Value language detected ${numVague} times.`);
    console.log(`Information requests detected ${numRequest} times.`);
    console.log(`Improper language detected ${numImproper} times.`);
    console.log(`Suspicious URLs detected ${numSusURLs} times.`);


    return sum;
}

function goPhishing(text) {
    if (detect(text) >= 2) {
        document.body.style.border = "5px solid red";
    }
}

goPhishing(document.body.innerHTML);

// Now monitor the DOM for additions and substitute emoji into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
// const observer = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     if (mutation.addedNodes && mutation.addedNodes.length > 0) {
//       // This DOM change was new nodes being added. Run our substitution
//       // algorithm on each newly added node.
//       for (let i = 0; i < mutation.addedNodes.length; i++) {
//         const newNode = mutation.addedNodes[i];
//         goPhishing(newNode);
//       }
//     }
//   });
// });
// observer.observe(document.body, {
//   childList: true,
//   subtree: true
// });