const axios = require("axios");
require("dotenv").config();

export const ats = async (text: String) => {
  const headers = {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  };

  const data = {
    model: "Compound-Beta",
    messages: [
      {
        role: "user",
        content: `You are an expert in resume analysis for ATS (Applicant Tracking Systems). You evaluate resumes based on structure, keyword relevance, formatting, and content alignment with job descriptions.

        Analyze the following resume and return only a JSON object with the following keys:

        - "score": A numerical score between 0 and 100 representing the resume's ATS compatibility.
        - "good": A bullet-point list of the positive aspects of the resume that help it perform well with ATS.
        - "bad": A bullet-point list of the negative aspects that may hurt its ATS compatibility.
        - "area_improvement": A bullet-point list of actionable suggestions to improve the resume's ATS score.

        Only return a valid JSON object in this exact structure. Do not include any explanations, comments, or extraneous text.

        Resume:
        """${text}"""`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  };
  const result = await generateAts(data, headers);
  return result;
};

interface AtsPayload {
  model: String;
  messages: {
    role: String;
    content: String;
  }[];
  temperature: Number;
  max_tokens: Number;
}

interface headerParams {
  Authorization: String;
}

const generateAts = async (data: AtsPayload, headers: headerParams) => {
  try {
    const response = await axios.post(process.env.GROQ_API_URL, data, { headers });
    const test = response.data.choices[0].message.content;

    const cleaned = test.replace(/```json|```/g, "").trim();

    const finalResult = JSON.parse(cleaned);

    return finalResult;
  } catch (error) {
    console.log(error);
    return "Please try again later";
  }
};

export const formalBody = async (text: String) => {
  const headers = {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  };

  const data = {
    model: "Compound-Beta",
    messages: [
      {
        role: "user",
        content: `You are an expert in professional email writing for job applications and referral requests. Transform informal, raw, or unstructured email body text into a well-written, formal, and concise email suitable for sending to company HR, recruiters, or executives (such as the CEO).

      Requirements:
      - Maintain a polite and professional tone.
      - Ensure the message clearly conveys the intent (e.g., job application, referral, request for opportunity).
      - Avoid overly casual language or vague phrasing.
      - Keep the structure clean with proper opening and closing.
      - Do not include a subject line.
      
      Input:
      """${text}"""

      Output:
      Return only the professionally rewritten version of the email body. Do not include any commentary, subject line, or extra formatting.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  };
  try {
    const response = await axios.post(process.env.GROQ_API_URL, data, { headers });

    const test = response.data.choices[0].message.content;

    return test;
  } catch (error) {
    console.log(error);
    return "Please try again later";
  }
};
