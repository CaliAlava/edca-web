from PIL import Image

img = Image.open('images/ecuador_map.png').convert("RGBA")
datas = img.getdata()

# Find the most common color (likely the checkerboard or background)
# We want to keep only the darkest pixels (the outline) and make them white, 
# and make everything else transparent.
# Let's check grayscale values.
gray_img = img.convert("L")
gray_datas = gray_img.getdata()

new_data = []
for item in gray_datas:
    # The outline is the darkest part. Let's say anything < 100 is outline.
    if item < 100:
        # Make outline white
        new_data.append((255, 255, 255, 255))
    else:
        # Make everything else transparent
        new_data.append((0, 0, 0, 0))

img.putdata(new_data)
img.save('images/ecuador_map_fixed.png')
print("Saved images/ecuador_map_fixed.png")
