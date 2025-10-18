from modelling import model

prompt = "Create a timetable for a student using the inputs with the following formats for work: taskID, deadline (when the work is due), strictness (whether work has to be completed before the deadline, or can it be completed within a week), Time (number of hours required to work on it); and format for event: taskID, startTime, endTime. The input is:"

formatting = " You must plan the timetable for the student so that they are able to complete the hours required by each work before their deadlines, while not disrupting the time they have for their events. Use the following output format: 'taskID, startTime, stopTime' so that the number of hours required to work of each work is distributed between now and before the deadline"

# Prompt for data type;
response = model.generate_content(prompt + "work: w1, 2025-10-25 12:00, No, 10; w2, 2025-11-01 12:00, Yes, 25. event: e1, 2025-10-20 12:00, 2025-10-20 14:00." + formatting)



# parsing response
print(response.text)
