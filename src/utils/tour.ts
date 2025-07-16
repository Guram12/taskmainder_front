import Shepherd from 'shepherd.js';
import { ThemeSpecs } from './theme';
import { NavigateFunction } from 'react-router-dom';


const startTour = (
  currentTheme: ThemeSpecs,
  navigate: NavigateFunction,
  t: (key: string) => string,
  setSelectedComponent: (component: string) => void
) => {



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
    title: t('dashboard'),
    text: t('dashboard_text'),
    attachTo: { element: '#dashboard_menuitem_shepherd', on: 'right' },
    buttons: [{ text: t('next'), action: tour.next }]
  });

  tour.addStep({
    title: t('boards'),
    text: t('boards_text'),
    attachTo: { element: '#board', on: 'right' },
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });

  tour.addStep({
    title: t('templates'),
    text: t('template_text'),
    attachTo: { element: '#templates_container_shepherd', on: 'right' },
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });

  tour.addStep({
    title: t('calendar'),
    text: t('calendar_text'),
    attachTo: { element: '#calendar_container_shepherd', on: 'right' },
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });

  tour.addStep({
    title: t('notification'),
    text: t('notification_text'),
    attachTo: { element: '#notification_container_shepherd', on: 'right' },
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });


  tour.addStep({
    title: t('diagram'),
    text: t('diagram_text'),
    attachTo: { element: '#mindmap_container_shepherd', on: 'right' },
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: async () => {
          if (navigate) {
            setSelectedComponent('Settings')
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
    title: t('profile_picture'),
    text: t('profile_picture_text'),
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
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });



  tour.addStep({
    title: t('user_information_update'),
    text: t('user_information_update_text'),
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
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });




  tour.addStep({
    title: t('change_password'),
    text: t('change_password_text'),
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
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });


  tour.addStep({
    title: t('custom_theme'),
    text: t('custom_theme_text'),
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
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('next'),
        action: tour.next
      }
    ]
  });



  tour.addStep({
    title: t('delete_account'),
    text: t('delete_account_text'),
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
    buttons: [
      {
        text: t('previous'),
        action: tour.back,

      },
      {
        text: t('finish'),
        action: () => {
          tour.complete();
          // Optionally, you can redirect or perform another action here
          if (navigate) {
            setSelectedComponent('Boards');
            navigate("/mainpage/boards");
          } else {
            window.location.pathname = '/mainpage/dashboard';
          }
        }
      }
    ]
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