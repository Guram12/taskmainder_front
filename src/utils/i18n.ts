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
      'close': 'Close',

      // notification component 
      "board_invitation_accepted": "Board Invitation Accepted",
      'left_board': 'Left Board',
      'task_due_reminder': 'Task Due Reminder',
      'board_member_left': 'Board Member Left',
      'removed_from_board': 'Removed from Board',
      'delete_all': 'Delete All',

      // notification body translations
      "removed_from_board_body": "You have been removed from the board '{{boardName}}'.",
      "board_member_left_body": "{{userName}} has left the board '{{boardName}}'.",
      "task_due_reminder_body": "Task '{{taskName}}' is due on {{dueDate}} with priority {{priority}}.",
      "board_invitation_accepted_body": "{{userName}} has joined your board \"{{boardName}}\".",
      "left_board_body": "You have left the board '{{boardName}}'.",
      "no_notifications": "No Notifications",

      //NoBoards component
      'no_boards_available': 'No Boards Available',
      'please_create_a_new_board_to_get_started.': 'Please create a new board to get started.',

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
      'due_date': "შესრულების ვადა: ",
      'no_tasks_due_on_this_day': "ამ დღისთვის ვადიანი დავალებები არ არის. დააწკაპუნე მონიშნულ დღეზე, რომ ნახო იმ დღის დავალებები.",
      'close': 'დახურვა',

      // notification component
      "board_invitation_accepted": "დაფის მოწვევა მიღებულია",
      'left_board': 'დაფიდან გასვლა',
      'task_due_reminder': 'დავალების ვადის გახსენება',
      'board_member_left': 'დაფის წევრი გავიდა დაფიდან',
      'removed_from_board': 'დაფიდან წაშლა',
      'delete_all': 'ყველას წაშლა',

      "removed_from_board_body": "თქვენ წაშლილი ხართ დაფიდან '{{boardName}}'.",
      "board_member_left_body": "{{userName}} გავიდა დაფიდან '{{boardName}}'.",
      "task_due_reminder_body": "დავალება '{{taskName}}' უნდა შესრულდეს {{dueDate}}-ზე პრიორიტეტით {{priority}}.",
      "board_invitation_accepted_body": "{{userName}} შეუერთდა თქვენს დაფას \"{{boardName}}\".",
      "left_board_body": "თქვენ გავხვდით დაფიდან '{{boardName}}'.",
      "no_notifications": "შეტყობინებები არ არის",

      //NoBoards component
      'no_boards_available': 'დაფები არ არის ხელმისაწვდომი',
      'please_create_a_new_board_to_get_started.': 'გთხოვთ, შექმნათ ახალი დაფა დასაწყებად',

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