import {
  LayoutDashboard,
  Calendar,
  List,
  Settings,
  Code2Icon,
  User2Icon,
  BriefcaseBusinessIcon,
  Puzzle,
  Users
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
  
];

export const InterviewType = [
  {
    title: 'Technical',
    icon: Code2Icon
  },{
    title:'Behavioral',
    icon:User2Icon
  },
  {
    title:'Experience',
    icon: BriefcaseBusinessIcon
  },
  {
    title:'Problem Solving',
    icon: Puzzle
  },
  {
    title:'Leadership',
    icon:Users
  },
]
export const QUESTIONS_PROMPT = `
You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
Number of Questions: {{questionCount}}

✨ Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate exactly {{questionCount}} interview questions depending on interview duration.
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.

🍀 Format your response in JSON format with array list of questions.

format:
{
  "interviewQuestions":[
    {
      "question":"",
      "type":"Technical/Behavioral/Experience/Problem Solving/Leadership"
    }
  ]
}

⚙️ The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
`; 

export const FEEDBACK_PROMPT = `
You are an expert technical interviewer evaluating a candidate's interview performance.

Below is the full interview conversation between an AI interviewer and a candidate:

{{conversation}}

Carefully analyze the candidate's responses and provide detailed feedback.

Rating Instructions:
- technicalSkills (0-10): Rate based on accuracy and depth of technical answers
- communication (0-10): Rate based on clarity, confidence, and how well they expressed ideas
- problemSolving (0-10): Rate based on their approach to solving problems
- experience (0-10): Rate based on relevant experience they mentioned

Be STRICT and HONEST — if answers were weak give low scores, if strong give high scores. Do NOT give same scores to everyone.

Respond ONLY in this exact JSON format with no extra text:
{
  "feedback": {
    "rating": {
      "technicalSkills": <number 0-10>,
      "communication": <number 0-10>,
      "problemSolving": <number 0-10>,
      "experience": <number 0-10>
    },
    "summery": "<3 line summary of overall performance>",
    "Recommendation": "<Yes or No>",
    "RecommendationMsg": "<one line explanation of recommendation>"
  }
}
`
