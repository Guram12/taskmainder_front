import { Template } from "./interface";
import wal_1 from "../assets/wal-1.webp";
import wal_2 from "../assets/wal-2.webp";
import wal_3 from "../assets/wal-3.webp";
import wal_4 from "../assets/wal-4.webp";





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
          { title: "Research API integration", description: "Investigate available APIs and document integration steps.", due_date: null, priority: 'green' },
          { title: "Design wireframes", description: "", due_date: null, priority: 'orange' },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Implement authentication", description: "Set up user login and registration using JWT.", due_date: null, priority: 'red' },
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
          { title: "Set up project repository", description: "Initialized GitHub repository and added README.", due_date: null, priority: 'green' },
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
          { title: "Morning workout", description: "30-minute cardio and strength training routine.", due_date: null, priority: 'orange' },
          { title: "Meal prep", description: "Prepare healthy lunches for the week.", due_date: null, priority: 'red' },
        ],
      },
      {
        name: "Learning Goals",
        tasks: [
          { title: "Complete TypeScript course", description: "Finish all modules and quizzes on the online platform.", due_date: null, priority: 'green' },
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
          { title: "Send invitations", description: "Email digital invitations to all guests.", due_date: null, priority: 'green' },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Order decorations", description: "Purchase balloons, banners, and tableware online.", due_date: null, priority: 'orange' },
        ],
      },
      {
        name: "Completed",
        tasks: [
          { title: "Plan menu", description: "Decided on food and drinks for the event.", due_date: null, priority: null },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "პირადი ორგანიზაცია",
    board: {
      name: "პირადი დავალებების დაფა",
    },
    background_image: wal_4,
    lists: [
      {
        name: "გასაკეთებელი",
        tasks: [
          { title: "შეისწავლე Django Signals", description: "გაიარე ოფიციალური დოკუმენტაცია და შექმენი პრაქტიკული მაგალითი.", due_date: null, priority: 'green' },
          { title: "დასალაგებელია ფაილები", description: "გადახედე ჩამოტვირთვების საქაღალდეს და გაასუფთავე ზედმეტი ფაილები.", due_date: null, priority: 'orange' },
        ],
      },
      {
        name: "პროცესშია",
        tasks: [
          { title: "სატესტო პროექტის დიზაინი", description: "შექმენი UI დიზაინის პირველადი ვარიანტი Figma-ში.", due_date: null, priority: 'red' },
        ],
      },
      {
        name: "დასრულებული",
        tasks: [
          { title: "CV-ის განახლება", description: "დამატებულია ახალი პროექტები და ტექნიკური უნარები.", due_date: null, priority: 'green' },
        ],
      },
    ],
  }

];