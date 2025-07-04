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
    '--task-background-color': '#181A1BCE',     // Close to list bg, but distinct for cards/tasks
    // '--task-background-color': '#222326', 
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
  neon_void: {
    '--background-color': '#0A0A12',            // Deep midnight blue-black
    '--main-text-coloure': '#F2F2F2',           // Bright off-white for strong readability
    '--border-color': '#1F1F2E',                // Subtle, soft midnight border
    '--scrollbar-thumb-color': '#7F00FF',       // Vivid purple neon
    '--list-background-color': '#141421',       // Slightly lighter void blue
    '--task-background-color': '#1C1C2E',       // Distinct neon-dark slate
    '--hover-color': '#261C3A',                 // Purple-tinted dark hover
    '--due-date-color': '#00FFE7'               // Vibrant aqua-cyan neon for dates
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
  hologram_glow: {
    '--background-color': '#111114',            // Very dark slate with violet undertones
    '--main-text-coloure': '#E0E7FF',           // Soft holographic bluish white
    '--border-color': '#393B4F',                // Faint purple-gray border
    '--scrollbar-thumb-color': '#A67EFF',       // Lavender neon glow
    '--list-background-color': '#1B1C26',       // Dim glassy violet
    '--task-background-color': '#2C2E3E',       // Muted holo-purple
    '--hover-color': '#232436',                 // Slightly glowing hover
    '--due-date-color': '#8BD3FF'               // Light electric blue
  },

  sky_breeze: {
    '--background-color': '#B3D8F6',           // Soft sky blue
    '--main-text-coloure': '#234060',          // Deep blue for contrast
    '--border-color': '#8CB4D9',               // Muted blue border
    '--scrollbar-thumb-color': '#A5C7E8',      // Gentle blue for scrollbars
    '--list-background-color': '#C6E2FA',      // Lighter sky for lists
    '--task-background-color': '#D6ECFB',      // Very light blue for cards/tasks
    '--hover-color': '#C6E2FA',                // Lighter blue for hover
    '--due-date-color': '#4A90E2'              // Vivid sky blue for due dates
  },

  glacier_bite: {
    '--background-color': '#F9FBFD',            // Frost white with a touch of blue
    '--main-text-coloure': '#1A2634',           // Cold deep navy for high readability
    '--border-color': '#CBDDEB',                // Cool ice-gray border
    '--scrollbar-thumb-color': '#A3BED4',       // Frozen blue-gray
    '--list-background-color': '#E6EFF7',       // Pale icy blue for list panels
    '--task-background-color': '#D8E7F2',       // Light glacial blue for task cards
    '--hover-color': '#E2EDF5',                 // Hover tint with soft sharpness
    '--due-date-color': '#4080BF'               // Strong glacier blue for accents
  }
  ,

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

  sage_paper: {
    '--background-color': '#DDE3DC',            // Pale desaturated green-gray
    '--main-text-coloure': '#2B332F',           // Deep charcoal green
    '--border-color': '#B4BFB6',                // Soft sage-gray
    '--scrollbar-thumb-color': '#A1B3A5',       // Calm green-gray
    '--list-background-color': '#CAD3CC',       // Slightly deeper paper sage
    '--task-background-color': '#B6C4BA',       // Gentle muted sage for tasks
    '--hover-color': '#C5CEC7',                 // Slight tint shift on hover
    '--due-date-color': '#6A8777'               // Muted forest tone for due dates
  }
  ,



};

export default themes;



