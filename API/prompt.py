from modelling import model

setup = "Types of tasks - Work: a task which requires a certain number of hours to work on. This must be completed before its deadline if its strictness is true, but can be completed up to 5 days late if its strictness is false; Event: a task which cannot be moved. During its startTime and endTime, other works cannot be worked on. "

prompt = "Create a timeline for a student using the inputs with the following formats for work: taskID, deadline, strictness, timeRequire; and format for event: taskID, startTime, endTime. Split the work hours into 2-5 hour sessions to be filled out in the days leading up to the deadline within the time window of 12pm-6pm, making sure to complete the hours required by each work. Make sure these sessions do not conflict with event times. During weekdays, try to limit the total time spent on work to 3 hours per day. During weekends, try to limit the total time spent on work to 6 hours per day."

formatting = " Use the following output format: 'taskID, startTime, stopTime' so that the number of hours required to work of each work is distributed well."

fake_Data = "Input: work: w1, 2025-10-25 12:00, No, 10; w2, 2025-11-01 12:00, Yes, 25. event: e1, 2025-10-20 12:00, 2025-10-20 14:00."

# prompt for data type;
response = model.generate_content(setup + prompt + fake_Data + formatting)

# parsing response
print(response.text)

# clean data
clean = "Only output the final result in the format: 'taskID, startTime, stopTime'. One session per line. No not add anything else. "
print("=================================")
print(model.generate_content(clean + str(response.text)).text)
