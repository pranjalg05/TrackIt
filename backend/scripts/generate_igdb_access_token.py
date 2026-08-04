from dotenv import load_dotenv
import os
import requests

load_dotenv()

url = "https://id.twitch.tv/oauth2/token"

def get_access_token(client_id: str, client_secret: str) -> str:
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials"
    }
    
    response = requests.post(url, data=payload)
    response.raise_for_status()
    
    access_token = response.json().get("access_token")
    return access_token

if __name__ == "__main__":
    get_access_token = get_access_token(os.getenv("TWITCH_DEVELOPER_CLIENT_ID"), os.getenv("TWITCH_DEVELOPER_CLIENT_SECRET"))
    print(f"Access Token: {get_access_token}")