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
          { title: "Research API integration", description: "", due_date: null, priority: 'green' },
          { title: "Design wireframes", description: "", due_date: null, priority: 'orange' },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Implement authentication", description: "", due_date: null, priority: 'red' },
        ],
      },
      {
        name: "Review",
        tasks: [
          { title: "Code review for feature X", description: "", due_date: null, priority: null },
        ],
      },
      {
        name: "Done",
        tasks: [
          { title: "Set up project repository", description: "", due_date: null, priority: 'green' },
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
          { title: "Morning workout", description: "", due_date: null, priority: 'orange' },
          { title: "Meal prep", description: "", due_date: null, priority: 'red' },
        ],
      },
      {
        name: "Learning Goals",
        tasks: [
          { title: "Complete TypeScript course", description: "", due_date: null, priority: 'green' },
          { title: "Read a book", description: "", due_date: null, priority: null },
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
          { title: "Book venue", description: "", due_date: null, priority: 'red' },
          { title: "Send invitations", description: "", due_date: null, priority: 'green' },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Order decorations", description: "", due_date: null, priority: 'orange' },
        ],
      },
      {
        name: "Completed",
        tasks: [
          { title: "Plan menu", description: "", due_date: null, priority: null },
        ],
      },
    ],
  },
];