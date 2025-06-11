export interface ThemeSpecs {
  '--background-color': string;
  '--main-text-coloure': string;
  '--border-color': string;
  '--scrollbar-thumb-color': string;
  '--list-background-color': string;
  '--task-background-color': string;
  '--hover-color': string;
  '--due-date-color': string;
}


const themes = {
  dark_gray: {
    '--background-color': '#181A1B',           // Slightly lighter, deep charcoal
    '--main-text-coloure': '#F5F6FA',          // Very light gray for high contrast
    '--border-color': '#2C2F33',               // Subtle, slightly lighter than background
    '--scrollbar-thumb-color': '#44474A',      // Muted mid-gray for scrollbars
    '--list-background-color': '#23272A',      // Slightly lighter than background for lists
    '--task-background-color': '#222326',     // Close to list bg, but distinct for cards/tasks
    '--hover-color': '#23272A',           // Slightly lighter than background
    '--due-date-color': '#A3B1C6'         // Muted blue-gray for due dates
  },

  forest_night: {
    '--background-color': '#18221E',           // Deep forest green-black
    '--main-text-coloure': '#E3F9E5',          // Soft, pale green for high contrast
    '--border-color': '#294036',               // Muted green-gray for borders
    '--scrollbar-thumb-color': '#3C5F4B',      // Muted green for scrollbars
    '--list-background-color': '#1E2C25',      // Slightly lighter green for lists
    '--task-background-color': '#254135',    // Distinct, rich green for cards/tasks
    '--hover-color': '#22342B',           // Slightly lighter forest green
    '--due-date-color': '#8FC7A1',
  },
  ocean_teal: {
    '--background-color': '#1A252F',           // Deep slate blue/teal
    '--main-text-coloure': '#EAF6FB',          // Soft, very light blue for high contrast
    '--border-color': '#274357',               // Muted blue-gray for subtle borders
    '--scrollbar-thumb-color': '#3B6E7A',      // Muted teal for scrollbars
    '--list-background-color': '#22313F',      // Slightly lighter slate for lists
    '--task-background-color': '#2B4D5C',  // Distinct teal for cards/tasks
    '--hover-color': '#22313F',           // Lighter slate blue
    '--due-date-color': '#7FC6D7'         // Soft teal for due dates
  },

  deep_aqua: {
    '--background-color': '#16222A',           // Deep blue-aqua, darker than ocean_teal
    '--main-text-coloure': '#D6F6FF',          // Soft, icy aqua for high contrast
    '--border-color': '#264653',               // Muted blue-green for subtle borders
    '--scrollbar-thumb-color': '#2A6F77',      // Muted teal for scrollbars
    '--list-background-color': '#1B2E35',      // Slightly lighter blue-aqua for lists
    '--task-background-color': '#235B63',       // Distinct, rich teal for cards/tasks
    '--hover-color': '#1B2E35',           // Lighter blue-aqua
    '--due-date-color': '#6EC1C8'         // Aqua for due dates
  },

  ink_cobalt: {
    '--background-color': '#101820',           // Almost black, with a blue hint
    '--main-text-coloure': '#DDEEFF',          // Clean pale blue for contrast
    '--border-color': '#1F2F3C',               // Soft ink-blue
    '--scrollbar-thumb-color': '#355570',      // Muted cobalt blue
    '--list-background-color': '#18232E',      // Lighter ink tone
    '--task-background-color': '#223748',      // Bold cobalt background
    '--hover-color': '#18232E',           // Lighter ink tone
    '--due-date-color': '#6A8DBA'
  },
  blue_steel: {
    '--background-color': '#202B38',           // Deep steel blue
    '--main-text-coloure': '#E3ECF7',          // Soft, icy blue for high contrast
    '--border-color': '#31475E',               // Muted blue-gray for borders
    '--scrollbar-thumb-color': '#46627F',      // Muted steel blue for scrollbars
    '--list-background-color': '#263445',      // Slightly lighter blue for lists
    '--task-background-color': '#2F4258',      // Distinct, rich blue for cards/tasks
    '--hover-color': '#263445',                // Slightly lighter blue for hover
    '--due-date-color': '#7FA6C9'              // Muted blue for due dates
  },
  velvet_moss: {
    '--background-color': '#1A1F1B',           // Dark earthy green-black
    '--main-text-coloure': '#E5F4DC',          // Soft leafy green
    '--border-color': '#2D3B2F',               // Olive-gray
    '--scrollbar-thumb-color': '#506E5B',      // Mossy green
    '--list-background-color': '#232A24',      // Slightly lighter forest
    '--task-background-color': '#364739',   // Natural tone for cards
    '--hover-color': '#232A24',           // Lighter moss green
    '--due-date-color': '#A3C9A8'
  },

  arctic_alice: {
    '--background-color': '#EAF6FB',           // AliceBlue, very light and airy
    '--main-text-coloure': '#223040',          // Deep slate for contrast
    '--border-color': '#B5C9D6',               // Soft blue-gray border
    '--scrollbar-thumb-color': '#CFE3F2',      // Muted blue for scrollbars
    '--list-background-color': '#DCE8F1',      // Slightly lighter for lists
    '--task-background-color': '#D6EAF8',   // Gentle blue for cards/tasks
    '--hover-color': '#D6EAF8',           // Gentle blue for hover
    '--due-date-color': '#7FB3D5'
  },

  mint_ice: {
    '--background-color': '#E6FAF7',           // Very light minty blue-green
    '--main-text-coloure': '#23404A',          // Deep teal for contrast
    '--border-color': '#B7E4E0',               // Soft mint border
    '--scrollbar-thumb-color': '#CFE9E6',      // Muted mint for scrollbars
    '--list-background-color': '#C9E6E2',      // Gentle, slightly darker mint for lists
    '--task-background-color': '#D6F5F0',   // Soft mint for cards/tasks
    '--hover-color': '#D6F5F0',           // Soft mint for hover
    '--due-date-color': '#7ED6C1'     // Soft mint for due dates
  },
  spring_cloud: {
    '--background-color': '#F5FCF9',           // Very light, almost white with a hint of green
    '--main-text-coloure': '#234040',          // Deep teal-gray for contrast
    '--border-color': '#C3E6DF',               // Soft pastel green-blue border
    '--scrollbar-thumb-color': '#D6ECE7',      // Gentle mint for scrollbars
    '--list-background-color': '#E6F6F2',      // Light mint for lists
    '--task-background-color': '#D9F3EC',   // Slightly deeper mint for cards/tasks
    '--hover-color': '#E6F6F2',           // Light mint for hover
    '--due-date-color': '#81B4AA'
  },

  lavender_mist: {
    '--background-color': '#F5F6FB',           // Very light lavender/blue
    '--main-text-coloure': '#2D3142',          // Deep blue-gray for contrast
    '--border-color': '#C7C9E2',               // Soft lavender-gray border
    '--scrollbar-thumb-color': '#D8DAF2',      // Pale lavender for scrollbars
    '--list-background-color': '#E7E9F7',      // Slightly deeper lavender for lists
    '--task-background-color': '#E0E3F3',    // Gentle blue-lavender for cards/tasks
    '--hover-color': '#E7E9F7',           // Soft lavender for hover
    '--due-date-color': '#898FB3'
  },

};

export default themes;



