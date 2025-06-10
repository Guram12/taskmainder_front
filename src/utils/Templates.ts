import { Template } from "./interface";
import wal_1 from "../assets/wal-1.webp";
import wal_2 from "../assets/wal-2.webp";
import wal_3 from "../assets/wal-3.webp";




export const templates: Template[] = [
  {
    id: 1,
    name: "Project Management",
    board: {
      name: "Development Sprint Board",
    },
    background_image: wal_3,
    lists: [
      {
        name: "Backlog",
        tasks: [
          { title: "Research API integration", description: "Explore third-party APIs for payment processing.", due_date: null, priority: 'green' },
          { title: "Design wireframes", description: "Create wireframes for the user dashboard.", due_date: null, priority: 'orange' },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Implement authentication", description: "Set up user login and registration functionality.", due_date: null, priority: 'red' },
        ],
      },
      {
        name: "Review",
        tasks: [
          { title: "Code review for feature X", description: "Review the code for the new feature before merging.", due_date: null, priority: null },
        ],
      },
      {
        name: "Done",
        tasks: [
          { title: "Set up project repository", description: "Initialize Git repository and push initial commit.", due_date: null, priority: 'green' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Personal Goals",
    board: {
      name: "Self-Improvement Board",
    },
    background_image: wal_2,
    lists: [
      {
        name: "Health Goals",
        tasks: [
          { title: "Morning workout", description: "Do a 30-minute workout every morning.", due_date: null, priority: 'orange' },
          { title: "Meal prep", description: "Prepare healthy meals for the week.", due_date: null, priority: 'red' },
        ],
      },
      {
        name: "Learning Goals",
        tasks: [
          { title: "Complete TypeScript course", description: "Finish the online TypeScript course on Udemy.", due_date: null, priority: 'green' },
          { title: "Read a book", description: "Read 'Atomic Habits' by James Clear.", due_date: null, priority: null },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Event Planning",
    board: {
      name: "Birthday Party Board",
    },
    background_image: wal_1,
    lists: [
      {
        name: "To Do",
        tasks: [
          { title: "Book venue", description: "Reserve a venue for the birthday party.", due_date: null, priority: 'red' },
          { title: "Send invitations", description: "Send digital invitations to all guests.", due_date: null, priority: 'green' },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Order decorations", description: "Purchase balloons, banners, and tableware.", due_date: null, priority: 'orange' },
        ],
      },
      {
        name: "Completed",
        tasks: [
          { title: "Plan menu", description: "Decide on the food and drinks for the party.", due_date: null, priority: null },
        ],
      },
    ],
  },
];