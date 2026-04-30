import os
import json
import requests
import time

def download_and_update_images():
    json_path = 'alma_encyclopedia_dish_soup.json'
    img_dir = os.path.join('assets', 'img', 'foods')

    # 1. Create the local assets folder if it doesn't exist
    if not os.path.exists(img_dir):
        os.makedirs(img_dir)

    # 2. Open our beautifully cleaned encyclopedia
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Cannot find {json_path}!")
        return

    items = data.get('data', [])
    downloaded_count = 0
    failed_count = 0
    already_local_count = 0

    print(f"📸 Starting image localization for {len(items)} items...")
    print("-" * 50)

    # 3. Loop through the items
    for item in items:
        img_url = item.get('image')
        
        # If there is an image, and it's still pointing to the alma website...
        if img_url and img_url.startswith("http"):
            
            # Extract the file extension (e.g., .png or .jpg)
            ext = img_url.split('.')[-1].split('?')[0]
            if ext.lower() not in ['png', 'jpg', 'jpeg', 'webp']:
                ext = 'png' # safe fallback
            
            # Create a clean, unique filename using the item's ID
            filename = f"{item['id']}.{ext}"
            local_filepath = os.path.join(img_dir, filename)

            # Only download if we haven't already saved this image
            if not os.path.exists(local_filepath):
                print(f"⬇️ Downloading: {filename}...")
                try:
                    headers = {'User-Agent': 'Mozilla/5.0'}
                    response = requests.get(img_url, headers=headers, timeout=15)
                    response.raise_for_status()

                    # Save the physical image file to your Mac
                    with open(local_filepath, 'wb') as img_file:
                        img_file.write(response.content)
                    
                    downloaded_count += 1
                    time.sleep(1) # Be polite to the Alma server!
                    
                except Exception as e:
                    print(f"   ❌ Failed to download {img_url}: {e}")
                    failed_count += 1
                    item['image'] = None # Force it to use your elegant UI fallback
                    continue
            else:
                already_local_count += 1

            # 4. UPDATE THE JSON TO POINT TO THE LOCAL GITHUB FOLDER!
            item['image'] = f"assets/img/foods/{filename}"

    # 5. Overwrite the JSON file with the new local paths
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({"data": items}, f, ensure_ascii=False, indent=2)

    print("-" * 50)
    print("✅ IMAGE LOCALIZATION COMPLETE!")
    print(f"📥 New Images Downloaded : {downloaded_count}")
    print(f"📁 Images Already Saved  : {already_local_count}")
    print(f"⚠️ Failed Downloads      : {failed_count}")
    print(f"💾 '{json_path}' has been successfully updated with local paths.")

if __name__ == "__main__":
    download_and_update_images()