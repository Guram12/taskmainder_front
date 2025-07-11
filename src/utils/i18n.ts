import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // header component
      "customTheme": "Custom Theme",
      'are_you_sure_you_want_to_log_out?': 'Are you sure you want to log out?',
      'yes': 'Yes',
      'no': 'No',


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
      'diagrams': 'Diagrams',

      //template component
      "choose_a_template": "Choose a Template",
      'select_template': "Select Template",
      'are_you_sure_you_want_to_select_the_template': "Are you sure you want to select the template:",

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

      // ================ settings ==============
      // settings  component
      "are_you_sure_you_want_to_delete_this_background_image": "Are you sure you want to delete this background image?",
      // profile picture update component
      'profile_picture_update': 'Profile Picture Update',
      'change_image': 'Change Image',
      'save': 'Save',
      'saving': 'Saving...',
      'select_avatar': 'Select Avatar',
      //profile info update component
      "user_information_update": "User Information Update",
      'enter_username': 'Enter Username',
      'phone_number': 'Phone Number',
      // password change component
      'change_Password': 'Change Password',
      'you_are_logged_in_using_a_social': "You are logged in using a social account. Password changes are not applicable.",
      'old_Password': 'Old Password',
      'new_Password': 'New Password',
      'confirm_new_Password': 'Confirm New Password',
      'correct': 'correct',
      'incorrect': 'incorrect',
      // ---------------- password validation text ------------
      'minimum_8_symbols': 'Minimum 8 symbols',
      'at_least_one_uppercase_letter': 'At least one uppercase letter',
      'at_least_one_number': 'At least one number',
      'passwords_match': 'Passwords match',
      'Passwords_do_not_match': '* Passwords do not match',

      // customtheme component
      'create_custom_theme': 'Create Custom Theme',
      'click_image_to_select_new_background': 'Click image to select new background',
      'you_can_change_board_background': 'You can change board background images if you are the owner or admin of this board.',
      "no_boards_available_for_theme": "No boards available. Please create a board first.",
      "save_image": "Save Image",
      'cancel_image_save': 'Cancel',
      'select_colors': 'Select Colors',
      'save_theme': 'Save Theme',

      // deleteAccount component
      'danger_zone': 'Danger Zone',
      'delete_account': 'Delete Account',
      'delete': 'Delete',
      'type_delete_confirmation': 'Type "delete my account" to confirm!',
      'type_here': 'Type here...',
      'confirm': 'Confirm',
      'cancel': 'Cancel',

      //members component
      'Update_Board_Name_onmobile': 'Update Board Name',
      'edit_board_name': 'Edit Name.(Max 25 characters)',
      'manage_users': 'Manage Users',
      'search_users_by_email': 'Search users by email',
      'invitation_sent_successfully': 'Invitation sent successfully!',
      "are_you_sure_you_want_to_delete_the_board": "Are you sure you want to delete the board:",
      'admin': 'admin',
      'member': 'member',
      'owner': 'owner',
      "are_you_sure_you_want_to_delete_the_user": "Are you sure you want to delete the user: ",
      'from the board': " from the board: ",
      'diagram': "Diagram",

      //board component
      'create_List': 'Create List',
      'add': 'Add',

      // list component 
      'list_name': 'List Name(max 21)',
      'are_you_sure_you_want_to_delete_the_list': 'Are you sure you want to delete the task',
      'add_task': 'Add Task',
      'task_title': 'Task Title',

      // task component 
      "task_due_date": "Due Date:",
      'no_associated_users': 'No associated users',
      'no_due_date': 'No due date',

      // authentication component
      'login': 'Login',
      'enter_your_email': 'Enter your email',
      'enter_your_password': 'Enter your password',
      'register': 'Register',
      'forgot_password': 'Forgot password?',
      'hide_password': 'Hide password',
      'show_password': 'Show password',
      'email': 'Email',
      'username': 'Username',
      'select_timezone': 'Select Timezone',
      'password': 'Password',
      'confirm_password': 'Confirm Password',
      'go_back_to_login': 'Go back to login',
      'password_reset': 'Password Reset',
      'send_reset_link': 'Send Reset Link',
      'open_email_provider': 'Open Email Provider',
      'password_reset_link_sent_to_your_email_address.': 'Password reset link sent to your email address.',
      'failed_to_send_password_reset_link': 'Failed to send password reset link. Please try again.',
      'create_new_password': 'Create New Password',

      // diagram component
      'boards_mode': 'Board Mode',
      'add_list_task': 'Add List / Task',
      'reset_positions': 'Reset Positions',
      "connect_board_or_list": 'Connect board to create list. Connect list to create task',
      'create': 'Create',
      'task_only': 'Task',
      'list_only': 'List',
      'enter_task_name': 'Enter task name',
      'task': 'Task',
      'list': 'List',
      'enter': 'Enter',
      'name': 'Name',
      'cannot_connect_task_to_task': 'Cannot connect task to task',
      'cannot_connect_list_to_list': 'Cannot connect list to list',
      'cannot_connect_new_node_to_task': 'Cannot connect new task to task',
      'cannot_connect_task_to_board': 'Cannot connect task to board',
      //task name modal
      'edit_list_name': 'Edit List Name',
      'enter_list_name': 'Enter list name',
      'update': 'Update',
      // board name update modal;
      'board_name_edit': 'Edit Board Name',

      // taskmodalupdate component
      'update_task': 'Update Task',
      'title': 'Title',
      'characters_left': 'characters left',
      'description': 'Description',
      'add_a_description': 'Add a description...',
      'task_description': 'Task Description',
      'priority': 'Priority',
      'low': 'Low'  ,
      'medium': 'Medium',
      'high': 'High',
      'select_date': 'Select Date',
      'select_time': 'Select Time',
      'clear_due_date': 'Clear Due Date',
      'associate_users_to_task': 'Associate Users To Task',
      'select_users': 'Select Users...',
      'associated_users': 'Associated Users : ',
      'clear_all_associated_users': 'Clear All Associated Users'  ,
      'completed': 'Completed',
      'delete_task': 'Delete Task',


    }
  },
  ka: {
    translation: {
      // header component
      "customTheme": "მორგებული თემა",
      'are_you_sure_you_want_to_log_out?': 'დარწმუნებული ხართ, რომ გსურთ გასვლა?',
      'yes': 'კი',
      'no': 'არა',

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
      'diagrams': 'დიაგრამები',

      //template component
      "choose_a_template": "შეარჩიე შაბლონი",
      "select_template": "შაბლონის არჩევა",
      'are_you_sure_you_want_to_select_the_template': "დარწმუნებული ხართ, რომ გსურთ აირჩიოთ შაბლონი:",


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

      // ================ settings ==============
      // settings  component
      "are_you_sure_you_want_to_delete_this_background_image": "დარწმუნებული ხართ, რომ გსურთ ამ ფონური სურათის წაშლა?",
      // profile picture update component
      'profile_picture_update': 'პროფილის სურათის განახლება',
      'change_image': 'სურათის შეცვლა',
      'save': 'შენახვა',
      'saving': 'შენახვა...',
      'select_avatar': 'აირჩიეთ ავატარი',
      //profile info update component
      "user_information_update": "მომხმარებლის ინფორმაციის განახლება",
      'enter_username': 'მომხმარებლის სახელი',
      'phone_number': 'ტელეფონის ნომერი',
      // password change component
      'change_Password': 'პაროლის შეცვლა',
      'you_are_logged_in_using_a_social': "თქვენ სისტემაში სოციალური ანგარიშით ხართ შესული. პაროლის შეცვლა ამ შემთხვევაში მიუწვდომელია.",
      'old_Password': 'ძველი პაროლი',
      'new_Password': 'ახალი პაროლი',
      'confirm_new_Password': 'ახალი პაროლის დადასტურება',
      'correct': 'სწორია',
      'incorrect': 'არასწორია',
      // ---------------- password validation text ------------
      'minimum_8_symbols': 'მინიმუმ 8 სიმბოლო',
      'at_least_one_uppercase_letter': 'მინიმუმ ერთი დიდი ასო',
      'at_least_one_number': 'მინიმუმ ერთი რიცხვი',
      'passwords_match': 'პაროლები ემთხვევა',
      'Passwords_do_not_match': '* პაროლები არ ემთხვევა',

      // customtheme component
      'create_custom_theme': 'შექმენი მორგებული თემა',
      'click_image_to_select_new_background': 'დააწკაპუნე სურათზე ახალი ფონის შესარჩევად',
      'you_can_change_board_background': 'დაფის ფონის სურათების შეცვლა შეგიძლიათ მხოლოდ იმ შემთხვევაში, თუ თქვენ ხართ ამ დაფის მფლობელი ან ადმინი.',
      "no_boards_available_for_theme": "დაფები არ არის ხელმისაწვდომი. გთხოვთ, ჯერ შექმნათ დაფა.",
      "save_image": "შენახვა",
      'cancel_image_save': 'გაუქმება',
      'select_colors': 'აირჩიე ფერები',
      'save_theme': 'თემის შენახვა',

      // deleteAccount component
      'danger_zone': 'საფრთხის ზონა',
      'delete_account': 'ანგარიშის წაშლა',
      'delete': 'წაშლა',
      'type_delete_confirmation': 'დასადასტურებლად ჩაწერეთ „წავშალე ჩემი ანგარიში“!',
      'type_here': 'ჩაწერე აქ...',
      'confirm': 'დადასტურება',
      'cancel': 'გაუქმება',

      //members component
      'Update_Board_Name_onmobile': 'დაფის სახელის განახლება',
      'edit_board_name': 'სახელი (მაქს 25 სიმბოლო)',
      "manage_users": 'მომხმარებლების მართვა',
      "search_users_by_email": 'ძებნა ელფოსტით',
      "invitation_sent_successfully": 'მოწვევა წარმატებით გაიგზავნა!',
      'are_you_sure_you_want_to_delete_the_board': "დარწმუნებული ხართ, რომ გსურთ წაშალოთ დაფა:",
      'admin': 'ადმინი',
      'member': 'წევრი',
      'owner': 'მფლობელი',
      "are_you_sure_you_want_to_delete_the_user": "დარწმუნებული ხართ, რომ გსურთ წაშალოთ მომხმარებელი: ",
      'from the board': " დაფიდან: ",
      'diagram': "დიაგრამა",

      //board component
      'create_List': 'სიის დამატება',
      'add': 'დამატება',

      // list component
      'list_name': 'სიის სახელი(მაქს. 21)',
      'are_you_sure_you_want_to_delete_the_list': 'დარწმუნებული ხართ, რომ გსურთ წაშალოთ სია:',
      'add_task': 'დავალების დამატება',
      'task_title': 'დავალების სათაური',

      // task component
      "task_due_date": "ვადა:",
      "no_associated_users": "არავინ",
      "no_due_date": "ვადის გარეშე",

      // authentication component
      'login': 'შესვლა',
      'enter_your_email': 'შეიყვანე ელ. ფოსტა',
      'enter_your_password': 'შეიყვანე პაროლი',
      'register': 'რეგისტრაცია',
      'forgot_password': 'დაგავიწყდა პაროლი?',
      'hide_password': 'პაროლის დამალვა',
      'show_password': 'პაროლის ჩვენება',
      'email': 'ელ. ფოსტა',
      'username': 'მომხმარებლის სახელი',
      'select_timezone': 'აირჩიეთ დროის სარტყელი',
      'password': 'პაროლი',
      'confirm_password': 'პაროლის დადასტურება',
      'go_back_to_login': 'შესვლის გვერდზე დაბრუნება',
      'password_reset': 'პაროლის აღდგენა',
      'send_reset_link': 'გაგზავნე აღდგენის ბმული',
      'open_email_provider': 'ელფოსტის გახსნა',
      'password_reset_link_sent_to_your_email_address.': 'პაროლის აღდგენის ბმული გაგზავნილია თქვენს ელფოსტაზე.',
      'failed_to_send_password_reset_link': 'პაროლის აღდგენის ბმულის გაგზავნა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.',
      'create_new_password': 'შექმენით ახალი პაროლი',

      // diagram component
      'boards_mode': 'დაფის რეჟიმი',
      'add_list_task': 'დაამატე სია / დავალება',
      'reset_positions': 'პოზიციების განულება',
      "connect_board_or_list": 'დააკავშირეთ დაფასთან სიის შესაქმნელად. დააკავშირეთ სიასთან დავალების შესაქმნელად',
      'create': 'შექმნა',
      'task_only': 'დავალება',
      'list_only': 'სია',
      'enter_task_name': 'შეიყვანეთ დავალების სახელი',
      'task': 'დავალების',
      'list': 'სიის',
      'enter': 'შეიყვანე',
      'name': 'სახელი',
      'cannot_connect_task_to_task': 'დავალების დავალებასთან დაკავშირება შეუძლებელია',
      'cannot_connect_list_to_list': 'სიის სიასთან დაკავშირება შეუძლებელია',
      'cannot_connect_new_node_to_task': 'ახალი დავალების დავალებასთან დაკავშირება შეუძლებელია',
      'cannot_connect_task_to_board': 'დავალების დაფასთან დაკავშირება შეუძლებელია',
      //task name modal
      'edit_list_name': 'სიის სახლის შეცვლა',
      'enter_list_name': 'შეიყვანე სიის სახელი',
      'update': 'განახლება',
      // board name update modal;
      'board_name_edit': 'დაფის სახელის შეცვლა',

      // taskmodalupdate component
      'update_task': 'დავალების განახლება',
      'title': 'სათაური',
      'characters_left': 'სიმბოლო დარჩა',
      'description': 'აღწერა',
      'add_a_description': 'დაამატე აღწერა...',
      'task_description': 'დავალების აღწერა',
      'priority': 'პრიორიტეტი',
      'low': 'დაბალი',
      'medium': 'საშუალო',
      'high': 'მაღალი',
      'select_date': 'თარიღი',
      'select_time': 'დრო',
      'clear_due_date': 'ვადის გასუფთავება',
      'associate_users_to_task': 'მომხმარებლების მიბმა დავალებაზე',
      'select_users': 'მომხმარებლების არჩევა...',
      'associated_users': 'მიბმული მომხმარებლები : ',
      'clear_all_associated_users': 'ყველა მიბმული მომხმარებლის გასუფთავება',
      'completed': 'დასრულებული',
      'delete_task': 'დავალების წაშლა',













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