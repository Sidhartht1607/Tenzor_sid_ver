import base64
import os
from google import genai
from google.genai import types

def generate(chat, chat_history=[]):
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    model = "gemini-2.0-flash"

    # Check if there's no existing chat history and initialize it
    if chat_history ==[]:
        chat_history = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text="""You are expert in many scientific, engineering and job market fields. I need you to explain everything in as simple words for me. I want to understand in depth of what this topic is about and if any technologies. Please explain any abbreviations found in the text as well. You should also use the internet to find out anything new about the main points in the text."""),
                ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(text="""Okay, I understand. I'm here to help you understand any scientific, engineering, or job market topic. Tell me what you want to learn about. I will then:

1.  **Explain the basics in simple terms:** I'll avoid jargon and use everyday language to describe the core concepts.
2.  **Delve into the depth:** Once you have the fundamentals, I'll gradually introduce more detailed information, key principles, and important considerations.
3.  **Explain abbreviations:** I'll define all the abbreviations I use and any found in the text you provide.
4.  **Discuss relevant technologies:** I'll highlight technologies associated with the topic, explaining how they work and their significance.
5.  **Research for updates:** I'll use the internet to find the latest developments, trends, and information related to the topic to ensure my explanation is up-to-date.
6.  **Relate to the job market:** If applicable, I'll discuss how the topic connects to job opportunities, skills in demand, and career paths.

**Just give me the topic you want to understand!** I'm ready when you are."""),
                ],
            ),
        ]

    # Always add the new user query to chat history
    chat_history.append(types.Content(
        role="user",
        parts=[types.Part.from_text(text=chat)],
    ))

    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=2000,
        response_mime_type="text/plain",
    )

    full_response = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=chat_history,
        config=generate_content_config,
    ):
        full_response += chunk.text

    # Append the AI response to the chat history for continuity
    chat_history=chat_history+[(types.Content(
        role="model",
        parts=[types.Part.from_text(text=full_response)],
    )),]

    print(full_response)
    return full_response, chat_history  # Return the full response and updated chat history

'''if __name__ == "__main__":
    chat = "write a 50 word essay on employment rates in US"
    # Example of starting with no chat history
    response, history = generate(chat)

    # Example of continuing from an existing history
    new_chat = "Can you tell me more about the factors affecting these rates?"
    response, updated_history = generate(new_chat, history)'''
