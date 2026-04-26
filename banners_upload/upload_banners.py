import os
import subprocess
import json

FOLDER_ID = "1DbhJNqzOJWjyXyLO2zQccW_du1tqkEvl"

files = sorted([f for f in os.listdir(".") if f.endswith(".png")])

print(f"Starting upload of {len(files)} banners to Google Drive...")

for filename in files:
    # Prepare the metadata
    metadata = {
        "name": filename,
        "parents": [FOLDER_ID]
    }
    
    # Run the gws command with relative path
    cmd = [
        "gws", "drive", "files", "create",
        "--json", json.dumps(metadata),
        "--upload", filename,
        "--upload-content-type", "image/png"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"  ✓ Uploaded: {filename}")
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Failed to upload {filename}: {e.stderr}")

print("\nAll uploads completed.")
