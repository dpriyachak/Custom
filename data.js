const jobData = [
  {
    jobId: "JOB001",
    inputFolder: "/inputs/doc1",
    outputFolder: "/outputs/doc1",
    startTime: "2025-08-01 10:00",
    stopTime: "2025-08-01 10:30",
    status: "completed",
    reviewer: "admin",
    tags: ["invoice", "approved"]
  },
  {
    jobId: "JOB002",
    inputFolder: "/inputs/doc2",
    outputFolder: "/outputs/doc2",
    startTime: "2025-08-02 14:00",
    stopTime: "2025-08-02 14:45",
    status: "running",
    reviewer: "analyst",
    tags: ["receipt"]
  }
];

export default jobData;
