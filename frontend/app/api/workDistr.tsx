import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../lib/supabaseClient";

// getting api
const ai = new GoogleGenAI({ apiKey: "AIzaSyBEiKusGv-8XGvTu8xwPVryL_v6ZWPx6SY" });

// prompting
const setup = "Types of tasks - Work: a task which requires a certain number of hours to work on. This must be completed before its deadline if its strictness is true, but can be completed up to 5 days late if its strictness is false; Event: a task which cannot be moved. During its startTime and endTime, other works cannot be worked on. ";
const prompt = "Create a timeline for a student using the inputs with the following formats for work: taskID, deadline, strictness, timeRequire; and format for event: taskID, startTime, endTime. Split the work hours into 2-5 hour sessions to be filled out in the days leading up to the deadline within the time window of 12pm-6pm, making sure to complete the hours required by each work. Make sure these sessions do not conflict with event times. During weekdays, try to limit the total time spent on work to 3 hours per day. During weekends, try to limit the total time spent on work to 6 hours per day.";
const formatting = " Use the following output format: 'taskID, startTime, stopTime' so that the number of hours required to work of each work is distributed well.";
const fake_Data = "Input: work: w1, 2025-10-25 12:00, No, 10; w2, 2025-11-01 12:00, Yes, 25. event: e1, 2025-10-20 12:00, 2025-10-20 14:00.";
const clean = "Only output the final result in the format: 'taskID, startTime, stopTime'. One session per line. Do not add anything else. ";

// call function
export async function test() {
  console.log("Gemini api called");
  // fetch data
  const { data: data_cw, error: error_cw } = await supabase
    .from("coursework")
    .select("*")
    .order("deadline", { ascending: true });
  if (error_cw) {
    console.error()
  }
  const { data: data_ev, error: error_ev } = await supabase
    .from("events")
    .select("*");
  if (error_ev) {
    console.error()
  }
  console.log(data_cw)
  console.log(data_ev)

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: (setup + prompt + fake_Data + formatting),
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  // console.log(response.text);

  const clean_response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: (clean + response.text),
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  console.log("==========================");
  console.log(clean_response.text);
}