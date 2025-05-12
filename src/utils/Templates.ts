import { Template } from "./interface";




export const templates: Template[] = [
  {
    id: 1,
    name: "Project Management",
    board: {
      name: "Project Board",
    },
    lists: [
      {
        name: "To Do",
        tasks: [
          { title: "Task 1", description: "Description 1", due_date: null },
          { title: "Task 2", description: "Description 2", due_date: null },
        ],
      },
      {
        name: "In Progress",
        tasks: [
          { title: "Task 3", description: "Description 3", due_date: null },
        ],
      },
      {
        name: "Done",
        tasks: [],
      },
      {
        name: "To Do1",
        tasks: [
          { title: "Task 1", description: "Description 1", due_date: null },
          { title: "Task 2", description: "Description 2", due_date: null },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Personal Goals 0",
    board: {
      name: "Goals Board",
    },
    lists: [
      {
        name: "Short Term Goals",
        tasks: [
          { title: "Goal 1", description: "Description 1", due_date: null },
        ],
      },
      {
        name: "Long Term Goals",
        tasks: [],
      },
    ],
  },
  {
    id: 3,
    name: "Personal Goals",
    board: {
      name: "Goals Board",
    },
    lists: [
      {
        name: "Short Term Goals 1",
        tasks: [
          { title: "Goal 1", description: "Description 1", due_date: null },
        ],
      },
      {
        name: "Long Term Goals",
        tasks: [],
      },
    ],
  },
  {
    id: 4,
    name: "Personal Goals 2",
    board: {
      name: "Goals Board",
    },
    lists: [
      {
        name: "Short Term Goals",
        tasks: [
          { title: "Goal 1", description: "Description 1", due_date: null },
        ],
      },
      {
        name: "Long Term Goals",
        tasks: [],
      },
    ],
  },
];