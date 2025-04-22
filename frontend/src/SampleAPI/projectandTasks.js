export const projects = [
    {
      id: "e2720ab2-ef12-4292-8dab-10e82f5a165a",
      name: "Customer Research",
      description:
        "This project is focused on gathering and analyzing feedback from current and potential users. It involves conducting interviews, surveys, and usability tests to understand user behavior, needs, and pain points.",
      workspace_id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      created_at: "2025-04-20T17:20:03.653Z",
    },
    {
      id: "f91fdcf2-b2f5-4dbe-9d59-b8d1c20b3a65",
      name: "AI Chatbot Development",
      description:
        "Develop and deploy an AI-powered chatbot for customer support to reduce ticket volume and improve response time. This includes flow design, OpenAI integration, and internal QA testing.",
      workspace_id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      created_at: "2025-04-20T17:30:00.000Z",
    }
  ];
  export const tasks = [
    {
      _id: "661f2b7198fd740001c5aabc",
      project_id: "e2720ab2-ef12-4292-8dab-10e82f5a165a",
      task_name: "Interview 5 target users",
      status: "In Progress",
      created_at: "2025-04-20T18:00:00",
      due_date: "2025-04-22",
      started_at: "2025-04-20",
      task_notes: "Ask about product usage and daily workflow.",
      priority: "High",
      assigned_users: ["user-001", "user-002"]
    },
    {
      _id: "661f2b7198fd740001c5aabd",
      project_id: "e2720ab2-ef12-4292-8dab-10e82f5a165a",
      task_name: "Summarize survey results",
      status: "To-do",
      created_at: "2025-04-20T18:05:00",
      due_date: "2025-04-23",
      started_at: "",
      task_notes: "Categorize user feedback by theme.",
      priority: "Medium",
      assigned_users: ["user-003"]
    },
    {
      _id: "661f2b7198fd740001c5aabe",
      project_id: "f91fdcf2-b2f5-4dbe-9d59-b8d1c20b3a65",
      task_name: "Design chatbot flow",
      status: "To-do",
      created_at: "2025-04-20T18:10:00",
      due_date: "2025-04-25",
      started_at: "",
      task_notes: "Map out common queries and fallback options.",
      priority: "High",
      assigned_users: ["user-004"]
    },
    {
      _id: "661f2b7198fd740001c5aabf",
      project_id: "f91fdcf2-b2f5-4dbe-9d59-b8d1c20b3a65",
      task_name: "Integrate OpenAI API",
      status: "To-do",
      created_at: "2025-04-20T18:20:00",
      due_date: "2025-04-28",
      started_at: "",
      task_notes: "Use GPT to handle complex queries.",
      priority: "High",
      assigned_users: ["user-001", "user-005"]
    }
  ];
  
  export const workspaceMembers = [
    {
      id: "user-001",
      fullname: "Layla Hussein",
      email: "layla.hussein@acme.com",
      workspace_id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      role: "member",
      joined_at: "2025-04-20T12:00:00Z"
    },
    {
      id: "user-002",
      fullname: "Jamal Yusuf",
      email: "jamal.yusuf@acme.com",
      workspace_id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      role: "member",
      joined_at: "2025-04-20T12:30:00Z"
    },
    {
      id: "user-003",
      fullname: "Amina Abdalla",
      email: "amina.abdalla@acme.com",
      workspace_id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      role: "member",
      joined_at: "2025-04-20T13:00:00Z"
    },
    {
      id: "user-004",
      fullname: "Hassan Noor",
      email: "hassan.noor@acme.com",
      workspace_id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      role: "member",
      joined_at: "2025-04-20T14:00:00Z"
    },
    {
      id: "user-005",
      fullname: "Nasteha Ali",
      email: "nasteha.ali@acme.com",
      workspace_id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      role: "member",
      joined_at: "2025-04-20T14:30:00Z"
    }
  ];

export const workspaces = [
    {
      id: "40c3e84b-28bb-404e-9387-334b8c6de5eb",
      name: "ACME Inc.",
      owner_id: "3e901e3c-d003-440f-b8bf-5e652dc77c15",
      created_at: "2025-04-20T09:35:09.675Z"
    },
    {
      id: "0b44a1f8-c506-46a3-95af-78a4d79ecdcf",
      name: "AMCE Inc.",
      owner_id: "7cff574b-f66c-446e-bdde-9a155dda5ac5",
      created_at: "2025-04-20T10:33:59.613Z"
    }
  ];



  export const getUserWorkspace = async (userId) => {
    return workspaces.find((ws) => ws.owner_id === userId);
  };
  
  export const getWorkspaceProjects = async (workspaceId) => {
    return projects.filter((proj) => proj.workspace_id === workspaceId);
  };
  
  export const getWorkspaceMembers = async (workspaceId) => {
    return workspaceMembers.filter((mem) => mem.workspace_id === workspaceId);
  };
  
  export const getProjectTasks = async (projectId) => {
    return tasks.filter((task) => task.project_id === projectId);
  };