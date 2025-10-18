import google.generativeai as genai

# configure API key
genai.configure(api_key="AIzaSyBEiKusGv-8XGvTu8xwPVryL_v6ZWPx6SY")
# configure model version
model = genai.GenerativeModel("gemini-2.5-flash-lite")