import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../lib/supabaseClient";
import { se } from "date-fns/locale";

// getting api
const ai = new GoogleGenAI({ apiKey: "AIzaSyBEiKusGv-8XGvTu8xwPVryL_v6ZWPx6SY" });

// prompting
const setup = "Types of tasks - Work: a task which requires a certain number of hours to work on. This must be completed before its deadline if its strictness is true, but can be completed up to 5 days late if its strictness is false; Event: a task which cannot be moved. During its startTime and endTime, work sessions cannot happen. ";
let dateTime = new Date()
console.log(dateTime);

const prompt = "Create a timeline for a student using the inputs with the following formats for work: taskID, deadline, strictness, timeRequire; and format for event: taskID, startTime, endTime. Split the work into sessions, each session should be between 2-5 hour long and between 12pm-6pm. Ensure the sessions time add up to the work's timeRequire. These sessions cannot coincide with any events. The sessions must start after "+dateTime+". During weekdays, try to limit the total time spent on work to 3 hours per day. During weekends, try to limit the total time spent on work to 6 hours per day. Prioritise the work with the earliest deadlines first.";
const formatting = " Use the following output format: 'taskID, startTime, stopTime' so that the number of hours required to work of each work is distributed well.";
const clean = "Only output the final result in the format: 'taskID, startTime, stopTime'. One session per line. Do not add anything else. Do not add padding. ";

export async function reSchedule() {
  console.log("Gemini api called");
  // fetch tasks
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
  // format tasks
  var data_string = " work: "
  data_cw?.forEach((item) => {
    data_string += item.id + ", ";
    data_string += String(item.deadline).substring(0,16) + ", ";
    data_string += item.strictness + ", ";
    data_string += item.est_hours + "; ";
  })
  data_string += " event: "
  data_ev?.forEach((item) => {
    data_string += item.id + ", ";
    data_string += String(item.start_at).substring(0,16) + ", ";
    data_string += String(item.end_at).substring(0,16) + "; ";
  })
  console.log(data_string);
  // eg date formats: 2025-10-21T11:30:45+00:00, 2025-10-21T13:00:58+00:00
  
  // api
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: (setup + prompt + data_string + formatting),
    config: {
      thinkingConfig: {
        thinkingBudget: 10, // Disables thinking
      },
    }
  });
  // clean response
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

  // split data to be ready to push
  // const sessions = clean_response.text.split("\n")
  // console.log(sessions);

  const clean_clean_response = clean_response.text.replace(/`/g, "");
  const sessions = clean_clean_response.split("\n")
  console.log(sessions);

  // clear old sessions
  const { data: existingRows, error: fetchError } = await supabase
  .from("work_distribution")
  .select("*")
  .limit(1); // check if an least 1 row exists

  if (fetchError) {
    console.error("Error checking existing rows:", fetchError.message);
  } else if (existingRows && existingRows.length > 0) {
    // delete if there are rows
    const { error: deleteError } = await supabase.from("work_distribution").delete().neq("taskid", ""); 
    
    if (deleteError) {
      console.error("Error clearing work_distribution table:", deleteError.message);
    } else {
      console.log("Cleared work_distribution table");
    }
  } else {
    console.log("No rows to delete, skipping clear step.");
  }
  // add newly updated sessions
  for (const response of sessions) {
    const list_resp = response.split(", ").map(x => x.trim());
    
    // sanity check: skip malformed lines
    if (list_resp.length < 3) {
      console.warn("Skipping malformed line:", response);
      continue;
    }
    
    const { data, error } = await supabase.from("work_distribution").insert([
    {
      taskid: list_resp[0],
      time_start:list_resp[1],
      time_end:list_resp[2],
    },
  ]);
  if (error) {
    console.error()
  }
  };
  window.location.reload();
}