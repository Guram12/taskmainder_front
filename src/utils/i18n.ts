import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // header component
      "customTheme": "Custom Theme",

      // sidebar component
      "dashboard": "Dashboard",
      "boards": "Boards",
      "tasks": "Tasks",
      'log_out': 'Logout',
      'add_new_board': 'Add New Board',
      'templates': 'Templates',
      'calendar': 'Calendar',
      'notification': 'Notification',
      "settings": "Settings",

      //template component
      "choose_a_template": "Choose a Template",
      'select_template': "Select Template",

      // Calendar component
      //  - months
      "january": "January",
      "february": "February",
      "march": "March",
      "april": "April",
      "may": "May",
      "june": "June",
      "july": "July",
      "august": "August",
      "september": "September",
      "october": "October",
      "november": "November",
      "december": "December",
      // - days
      "sun": "Sun",
      "mon": "Mon",
      "tue": "Tue",
      "wed": "Wed",
      "thu": "Thu",
      "fri": "Fri",
      "sat": "Sat",
      // --
      "tasks_for": "Tasks for",
      "tvis": "",
      "due_date": "Due Date:",
      "no_tasks_due_on_this_day": "No Due Date Tasks on this day.  Click on a highlighted day to see tasks due on that day.",


      // "due_date": "Due Date:",
      // "close": "Close",
      // "no_due_date_tasks": "No Due Date Tasks. Click on a highlighted day to see tasks due on that day."
    








  }
},
  ka: {
    translation: {
      // header component
      "customTheme": "მორგებული თემა",

      // sidebar component
      "dashboard": "პანელი",
      "boards": "დაფები",
      "tasks": "დავალებები",
      'log_out': 'გამოსვლა',
      'add_new_board': 'დაფის დამატება',
      'templates': 'შაბლონები',
      'calendar': 'კალენდარი',
      'notification': 'შეტყობინებები',
      "settings": "პარამეტრები",

      //template component
      "choose_a_template": "შეარჩიე შაბლონი",
      "select_template": "შაბლონის არჩევა",

      // Calendar component
      //  - months
      "january": "იანვარი",
      "february": "თებერვალი",
      "march": "მარტი",
      "april": "აპრილი",
      "may": "მაისი",
      "june": "ივნისი",
      "july": "ივლისი",
      "august": "აგვისტო",
      "september": "სექტემბერი",
      "october": "ოქტომბერი",
      "november": "ნოემბერი",
      "december": "დეკემბერი",
      // - days
      "sun": "კვი",
      "mon": "ორშ",
      "tue": "სამ",
      "wed": "ოთხ",
      "thu": "ხუთ",
      "fri": "პარ",
      "sat": "შაბ",
      // --
      'tasks_for': "",
      'tvis': '-ის დავალებები',
      'due_date'  : "შესრულების ვადა: ",
      'no_tasks_due_on_this_day': "ამ დღისთვის ვადიანი დავალებები არ არის. დააწკაპუნე მონიშნულ დღეზე, რომ ნახო იმ დღის დავალებები."


    }
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;