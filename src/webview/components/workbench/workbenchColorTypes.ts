/**
 * ColorFly: Workbench Colors - Shared Types & Category Feature Map
 * Extracted from WorkbenchColorCatalog for modular per-feature maintenance.
 */

import { WorkbenchCategory } from '../../../shared/types';
import { Localized } from '../../i18n';

export interface CategoryFeatureMeta {
  label: string;
  location: string;
  impact: Localized;
  icon: string;
}

export const CATEGORY_FEATURE_MAP: Record<string, CategoryFeatureMeta> = {
  activityBar: {
    label: 'Navigation Activity Bar',
    location: 'Left Vertical Column',
    impact: {
      en: 'The vertical icon bar on the far left used to open Explorer, Search, and Source Control.',
      bn: 'একেবারে বাম পাশের খাড়া আইকন বার, যা দিয়ে ফাইল এক্সপ্লোরার, সার্চ ও গিট খোলা হয়।',
      hi: 'बाएँ किनारे का खड़ा आइकन बार जिससे एक्सप्लोरर, खोज और सोर्स कंट्रोल खोले जाते हैं।',
    },
    icon: '📍 Left Icon Bar',
  },
  sideBar: {
    label: 'Primary Sidebar',
    location: 'Left Collapsible Container',
    impact: {
      en: 'The main panel on the left listing files (Explorer), search results, and git changes.',
      bn: 'বাম পাশের মেইন প্যানেল যাতে ফাইল লিস্ট (Explorer), সার্চ রেজাল্ট ও গিট চেঞ্জেস থাকে।',
      hi: 'बाएँ ओर का मुख्य पैनल जिसमें फ़ाइल सूची (एक्सप्लोरर), खोज परिणाम और गिट परिवर्तन होते हैं।',
    },
    icon: '📍 Primary Sidebar',
  },
  editor: {
    label: 'Code Editor Canvas',
    location: 'Main Workspace',
    impact: {
      en: 'The main code writing canvas with cursor, line numbers, and code highlights.',
      bn: 'প্রধান কোড লেখার ক্যানভাস, কার্সর, লাইন নম্বর, এবং কোড হাইলাইটস।',
      hi: 'कर्सर, लाइन नंबर और कोड हाइलाइट सहित मुख्य कोड लेखन कैनवास।',
    },
    icon: '📍 Editor Canvas',
  },
  tabsAndTitle: {
    label: 'Tabs & Title Bar',
    location: 'Top Window & Headers',
    impact: {
      en: 'The header bar at the very top of the window and the tabs of open files.',
      bn: 'উইন্ডোর সবচেয়ে উপরের হেডার বার এবং ওপেন থাকা ফাইলের ট্যাবসমূহ।',
      hi: 'विंडो के सबसे ऊपर का हेडर बार और खुली फ़ाइलों की टैब।',
    },
    icon: '📍 Window Header & Tabs',
  },
  statusBar: {
    label: 'Status Bar',
    location: 'Bottom Horizontal Strip',
    impact: {
      en: 'The colored bar at the very bottom showing git branch name, error count, and status info.',
      bn: 'একেবারে নিচের রঙিন বার যাতে গিট ব্রাঞ্চ নাম, এরর কাউন্ট, ও স্ট্যাটাস থাকে।',
      hi: 'सबसे नीचे की रंगीन बार जिसमें गिट ब्रांच नाम, त्रुटि काउंट और स्थिति होती है।',
    },
    icon: '📍 Bottom Status Line',
  },
  panel: {
    label: 'Panel Surface',
    location: 'Bottom / Side Container',
    impact: {
      en: 'The large bottom panel containing Output, Problems, and the terminal.',
      bn: 'আউটপুট, প্রবলেমস এবং টার্মিনাল ধারণকারী নিচের বড় প্যানেলটি।',
      hi: 'आउटपुट, समस्याओं और टर्मिनल वाला बड़ा नीचे का पैनल।',
    },
    icon: '📍 Bottom Panel',
  },
  terminal: {
    label: 'Integrated Terminal',
    location: 'Console Surface & Colors',
    impact: {
      en: 'The integrated terminal console where npm, git, and other commands run.',
      bn: 'ইন্টিগ্রেটেড টার্মিনাল কনসোল যেখানে npm, git কমান্ড ইত্যাদি রান করা হয়।',
      hi: 'इंटीग्रेटेड टर्मिनल कंसोल जहाँ npm, git आदि कमांड चलते हैं।',
    },
    icon: '📍 Embedded CLI Shell',
  },
  buttonsAndInputs: {
    label: 'Buttons & Inputs',
    location: 'UI Controls',
    impact: {
      en: 'Form buttons, text input boxes, dropdowns, and check controls.',
      bn: 'ফর্মের বাটন, টেক্সট ইনপুট বক্স, ড্রপডাউন এবং চেককন্ট্রোল।',
      hi: 'फ़ॉर्म के बटन, टेक्स्ट इनपुट बॉक्स, ड्रॉपडाउन और चेक नियंत्रण।',
    },
    icon: '📍 UI Controls & Forms',
  },
  listsAndTrees: {
    label: 'Lists, Trees & Menus',
    location: 'Tree Items & Popups',
    impact: {
      en: 'File tree rows, menus, and command palette list items.',
      bn: 'ফাইল ট্রির রো, মেনু এবং কমান্ড প্যালেটের লিস্ট আইটেম।',
      hi: 'फ़ाइल ट्री पंक्तियाँ, मेनू और कमांड पैलेट की सूची आइटम।',
    },
    icon: '📍 Lists & Context Menus',
  },
  searchAndDebug: {
    label: 'Search, Git & Debug',
    location: 'Tool Highlights',
    impact: {
      en: 'Search match highlights, git change markers, and the debug toolbar.',
      bn: 'সার্চ ম্যাচ হাইলাইটস, গিট চেঞ্জ মার্কার এবং ডিবাগ টুলবার।',
      hi: 'खोज मैच हाइलाइट, गिट परिवर्तन मार्कर और डीबग टूलबार।',
    },
    icon: '📍 Search & Debugging',
  },
  notifications: {
    label: 'Notifications & Popups',
    location: 'Alert Toasts',
    impact: {
      en: 'Notification popups and toast alert messages.',
      bn: 'নোটিফিকেশন পপআপ এবং টোস্ট অ্যালার্ট ম্যাসেজ।',
      hi: 'सूचना पॉपअप और टोस्ट अलर्ट संदेश।',
    },
    icon: '📍 Popups & Notifications',
  },
  other: {
    label: 'Other Components',
    location: 'System Elements',
    impact: {
      en: 'Scrollbars, breadcrumbs, and progress bars.',
      bn: 'স্ক্রলবার, ব্রেডক্রাম্বস এবং প্রগ্রেস बार।',
      hi: 'स्क्रॉलबार, ब्रेडक्रम्ब्स और प्रगति बार।',
    },
    icon: '📍 System Elements',
  },
};
