import sys

pdf_path = r"C:\Users\LUKMAN HAKIM\.gemini\antigravity\brain\45e0e41e-d7ed-45de-9078-f91ae237af9e\.user_uploaded\media_1786007886478.pdf"
out_dir = r"C:\Users\LUKMAN HAKIM\.gemini\antigravity\scratch\lukmanhakim-jasaweb\portofolio\images\fredy-team"

with open(pdf_path, "rb") as f:
    data = f.read()

count = 0
start = 0

while True:
    soi = data.find(b"\xff\xd8\xff", start)
    if soi == -1:
        break
    eoi = data.find(b"\xff\xd9", soi + 3)
    if eoi == -1:
        break
    
    img_data = data[soi:eoi+2]
    if len(img_data) > 10000:  # Hany simpan gambar lebih dari 10KB
        count += 1
        fn = f"{out_dir}\\team_{count}.jpg"
        with open(fn, "wb") as img_file:
            img_file.write(img_data)
        print(f"Saved: team_{count}.jpg ({len(img_data)} bytes)")
    start = eoi + 2

print(f"Done! Extracted {count} images.")
