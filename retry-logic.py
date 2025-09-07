import requests
import time

def post_with_retry(url, data, retries=2, delay=20):
    for attempt in range(retries + 1):  # +1 for the initial try
        try:
            response = requests.post(url, json=data, timeout=10)
            if response.status_code == 200:
                return response
            else:
                print(f"Attempt {attempt+1} failed with {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt+1} failed with error: {e}")

        if attempt < retries:
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
    
    # ❌ If we reach here, all retries failed
    raise RuntimeError(f"All {retries+1} attempts failed for POST {url}")
