import Shepherd from 'shepherd.js';
import { ThemeSpecs } from './theme';
import { NavigateFunction } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const { t } = useTranslation();

const startTour = (currentTheme: ThemeSpecs, navigate: NavigateFunction) => {



  console.count('Tour started');
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      classes: 'custom-tour-theme', // Custom class for further styling
      scrollTo: { behavior: 'smooth', block: 'center' },
    },
    useModalOverlay: true,
  });

  tour.addStep({
    title: 'Dashboard',
    text: 'This is the Dashboard section where you can view your main tasks.',
    attachTo: { element: '#dashboard_menuitem_shepherd', on: 'right' },
    buttons: [{ text: 'Next', action: tour.next }]
  });

  tour.addStep({
    title: 'Boards',
    text: 'Here you can manage your boards. Click on a board to view its details.',
    attachTo: { element: '#board', on: 'right' },
    buttons: [{ text: 'Next', action: tour.next }]
  });

  tour.addStep({
    title: 'Templates',
    text: 'This section contains templates for creating new boards.',
    attachTo: { element: '#templates_container_shepherd', on: 'right' },
    buttons: [{ text: 'Next', action: tour.next }]
  });

  tour.addStep({
    title: 'Calendar',
    text: 'The Calendar view highlights days with tasks due. Click here to see your deadlines at a glance.',
    attachTo: { element: '#calendar_container_shepherd', on: 'right' },
    buttons: [{ text: 'Next', action: tour.next }]
  });

  tour.addStep({
    title: 'Notification',
    text: 'Check all your notifications here. You will see reminders, board updates, and more.',
    attachTo: { element: '#notification_container_shepherd', on: 'right' },
    buttons: [{ text: 'Next', action: tour.next }]
  });



  tour.addStep({
    title: 'Diagram',
    text: 'Visualize your boards and tasks here using interactive diagrams.',
    attachTo: { element: '#mindmap_container_shepherd', on: 'right' },
    buttons: [
      {
        text: 'Next',
        action: async () => {
          if (navigate) {
            navigate("/mainpage/settings");
          } else {
            window.location.pathname = '/mainpage/settings';
          }
          // Wait for the profile picture element to appear before continuing
          const waitForElement = (selector: string, timeout = 1000) => {
            return new Promise<void>((resolve, reject) => {
              const start = Date.now();
              const check = () => {
                if (document.querySelector(selector)) {
                  resolve();
                } else if (Date.now() - start > timeout) {
                  reject(new Error('Element not found'));
                } else {
                  setTimeout(check, 100);
                }
              };
              check();
            });
          };
          try {
            await waitForElement('#profile_pic_shepherd');
          } catch (e) {
            // Optionally handle error or continue anyway
          }
          tour.next();
        }
      }
    ]
  });

  // ============================================

  tour.addStep({
    title: 'Profile Picture',
    text: 'Update your profile picture here to personalize your account.',
    attachTo: { element: '#profile_pic_shepherd', on: 'bottom' },
    when: {
      show: () => {
        const el = document.querySelector('#profile_picture_update_shepherd') as HTMLElement | null;
        if (el) el.style.zIndex = '999999';
        return new Promise(resolve => setTimeout(resolve, 200));
      },
      hide: () => {
        const el = document.querySelector('#profile_picture_update_shepherd') as HTMLElement | null;
        if (el) el.style.zIndex = '';
      }
    },
    buttons: [{ text: 'Next', action: tour.next }]
  });



  tour.addStep({
    title: 'User Info Update',
    text: 'Here you can update your username, phone number, and timezone.',
    attachTo: { element: '.main_profilinfo_cont', on: 'bottom' },
    when: {
      show: () => {
        const el = document.querySelector('.main_profilinfo_cont') as HTMLElement | null;
        if (el) el.style.zIndex = '999999';
        return new Promise(resolve => setTimeout(resolve, 200));
      },
      hide: () => {
        const el = document.querySelector('.main_profilinfo_cont') as HTMLElement | null;
        if (el) el.style.zIndex = '';
      }
    },
    buttons: [{ text: 'Next', action: tour.next }]
  });




  tour.addStep({
    title: 'Change Password',
    text: 'You can change your account password here.',
    attachTo: { element: '.main_password_container', on: 'bottom' },
    when: {
      show: () => {
        // Temporarily change style for highlight
        const el = document.querySelector('.password_change_container') as HTMLElement | null;
        if (el) {
          el.style.zIndex = '9999';
        }
        // Wait for DOM to update
        return new Promise(resolve => setTimeout(resolve, 200));
      },
      hide: () => {
        // Restore original style
        const el = document.querySelector('.password_change_container') as HTMLElement | null;
        if (el) {
          el.style.zIndex = '';
        }
      }
    },
    buttons: [{ text: 'Next', action: tour.next }]
  });


  tour.addStep({
    title: 'Custom Theme',
    text: 'Here you can customize the colors and background images for your boards.',
    attachTo: { element: '.custom_theme_container', on: 'right' },
    when: {
      show: () => {
        // Temporarily change style for highlight
        const el = document.querySelector('#customtheme_container_shepherd') as HTMLElement | null;
        if (el) {
          el.style.zIndex = '999999999999999'; // Set higher than Shepherd overlay
        }
        // Wait for DOM to update
        return new Promise(resolve => setTimeout(resolve, 200));
      },
      hide: () => {
        // Restore original style
        const el = document.querySelector('#customtheme_container_shepherd') as HTMLElement | null;
        if (el) {
          el.style.zIndex = '';
        }
      }
    },
    buttons: [{ text: 'Next', action: tour.next }]
  });



  tour.addStep({
    title: 'Delete Account',
    text: 'This is the danger zone. You can permanently delete your account here.',
    attachTo: { element: '.main_delete_acc_container', on: 'top' },
    when: {
      show: () => {
        // Temporarily change style for highlight
        const el = document.querySelector('.delete_acc_header_cont') as HTMLElement | null;
        if (el) {
          el.style.zIndex = '9999';
        }
        // Wait for DOM to update
        return new Promise(resolve => setTimeout(resolve, 200));
      },
      hide: () => {
        // Restore original style
        const el = document.querySelector('.delete_acc_header_cont') as HTMLElement | null;
        if (el) {
          el.style.zIndex = '';
        }
      }
    },
    buttons: [{ text: 'Finish', action: tour.complete }]
  });



  const style = document.createElement('style');
  style.innerHTML = `
  .shepherd-element.custom-tour-theme {
    background: ${currentTheme['--background-color']};
    color: ${currentTheme['--main-text-coloure']};
    border: 2px solid ${currentTheme['--border-color']};
  }
  .shepherd-element.custom-tour-theme .shepherd-header {
    background: ${currentTheme['--list-background-color']};
  }
  .shepherd-element.custom-tour-theme .shepherd-title {
    color: ${currentTheme['--main-text-coloure']};
  }
  .shepherd-element.custom-tour-theme .shepherd-text {
    color: ${currentTheme['--main-text-coloure']};
    margin-left: 10px;
  }
  .shepherd-element.custom-tour-theme .shepherd-button {
    background: ${currentTheme['--hover-color']};
    color: ${currentTheme['--main-text-coloure']};
    border: 1px solid ${currentTheme['--border-color']};
  }
  .shepherd-element.custom-tour-theme .shepherd-arrow {
    border-color: ${currentTheme['--border-color']};
  }
  .shepherd-element.custom-tour-theme .shepherd-arrow::before {
    background: ${currentTheme['--background-color']}; /* Change arrow background */
  }
`;
  document.head.appendChild(style);



  setTimeout(() => {
    tour.start();
  }, 500); // 500ms delay
};

export { startTour };