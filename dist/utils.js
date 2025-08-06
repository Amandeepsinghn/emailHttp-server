"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfScan = exports.formalBody = exports.ats = void 0;
const axios = require("axios");
require("dotenv").config();
const ats = (text) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield generateAts(data, headers);
    return result;
});
exports.ats = ats;
const generateAts = (data, headers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.post(process.env.GROQ_API_URL, data, { headers });
        const test = response.data.choices[0].message.content;
        const cleaned = test.replace(/```json|```/g, "").trim();
        const finalResult = JSON.parse(cleaned);
        return finalResult;
    }
    catch (error) {
        console.log(error);
        return "Please try again later";
    }
});
const formalBody = (text) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios.post(process.env.GROQ_API_URL, data, { headers });
        const test = response.data.choices[0].message.content;
        return test;
    }
    catch (error) {
        console.log(error);
        return "Please try again later";
    }
});
exports.formalBody = formalBody;
const pdfScan = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
    };
    const data = {
        model: "Compound-Beta",
        messages: [
            {
                role: "user",
                content: `You are an expert in professional email writing for job applications and referrals. Based on the content of the candidate's resume, generate a well-written, formal, and concise email body that the candidate can send to a company's HR, recruiter, or leadership (e.g., CEO) when applying for a job or requesting a referral.

      Requirements:
      - The email should reflect the candidate's background and strengths, extracted from the resume.
      - Maintain a polite and professional tone.
      - Clearly express interest in job opportunities or referrals.
      - Keep the structure clean with proper opening and closing.
      - Do not include a subject line.
      - Do not include the resume text in the output.

      Input (Resume):
      """${text}"""

      Output:
      Return only the professionally written email body tailored to the resume content. Do not include commentary, formatting, or subject line.`,
            },
        ],
        temperature: 0.7,
        max_tokens: 1024,
    };
    try {
        const response = yield axios.post(process.env.GROQ_API_URL, data, { headers });
        const test = response.data.choices[0].message.content;
        return test;
    }
    catch (error) {
        console.log(error);
        return "Please try again later";
    }
});
exports.pdfScan = pdfScan;
//# sourceMappingURL=utils.js.map