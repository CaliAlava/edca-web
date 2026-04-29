from PIL import Image, ImageFilter

img = Image.open('images/ecuador_map.png').convert("RGBA")
gray_img = img.convert("L")
gray_datas = gray_img.getdata()

new_data = []
for item in gray_datas:
    if item < 120:  # slightly higher threshold to catch anti-aliased edges
        new_data.append((255, 255, 255, 255))
    else:
        new_data.append((0, 0, 0, 0))

img.putdata(new_data)

# Thicken the lines by 1 pixel using MaxFilter
img_bold = img.filter(ImageFilter.MaxFilter(3))

img_bold.save('images/ecuador_map_fixed.png')
print("Image generated and thickened successfully.")
