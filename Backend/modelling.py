import google.generativeai as genai


genai.configure(api_key="AIzaSyBEiKusGv-8XGvTu8xwPVryL_v6ZWPx6SY")


model = genai.GenerativeModel("gemini-2.5-flash-lite")
