const fs = require('fs');
let c = fs.readFileSync('src/webview/i18n.ts', 'utf8');

// Add workbench bulk strings after wcat.activeOverrideBadge in en section
let old = "  'wcat.activeOverrideBadge': 'Active Override',";
let neo = "  'wcat.activeOverrideBadge': 'Active Override',\n  'wcat.selectedCount': 'selected',\n  'wcat.bulkActivate': 'Activate All',\n  'wcat.bulkDeactivate': 'Deactivate All',\n  'wcat.bulkReset': 'Reset All',\n  'wcat.clearSelection': 'Clear',";
if (c.includes(old)) {
  c = c.replace(old, neo);
  console.log('en strings added');
} else {
  console.log('en old text not found');
}

// Add bn strings
let oldBn = "  'wcat.activeOverrideBadge': 'সক্রিয় ওভাররাইড',";
let neoBn = "  'wcat.activeOverrideBadge': 'সক্রিয় ওভাররাইড',\n  'wcat.selectedCount': 'সিলেক্টেড',\n  'wcat.bulkActivate': 'সব সক্রিয় করুন',\n  'wcat.bulkDeactivate': 'সব নিষ্ক্রিয় করুন',\n  'wcat.bulkReset': 'সব রিসেট করুন',\n  'wcat.clearSelection': ' পরিষ্কার',";
if (c.includes(oldBn)) {
  c = c.replace(oldBn, neoBn);
  console.log('bn strings added');
} else {
  console.log('bn old text not found');
}

// Add hi strings
let oldHi = "  'wcat.activeOverrideBadge': 'सक्रिय ओवरराइड',";
let neoHi = "  'wcat.activeOverrideBadge': 'सक्रिय ओवरराइड',\n  'wcat.selectedCount': 'चयनित',\n  'wcat.bulkActivate': 'सभी सक्रिय करें',\n  'wcat.bulkDeactivate': 'सभी निष्क्रिय करें',\n  'wcat.bulkReset': 'सभी रीसेट करें',\n  'wcat.clearSelection': ' साफ़ करें',";
if (c.includes(oldHi)) {
  c = c.replace(oldHi, neoHi);
  console.log('hi strings added');
} else {
  console.log('hi old text not found');
}

fs.writeFileSync('src/webview/i18n.ts', c);
console.log('Done');