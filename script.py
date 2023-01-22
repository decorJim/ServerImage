# RUN SCRIPT WITH COMMAND "python script.py"
# must have import PIL with command "pip install pillow" in terminal

import os
from PIL import Image

# Get the 8 most recent images in the downloads folder
downloads_folder = 'images/'
image_files = [f for f in os.listdir(downloads_folder) if f.endswith('.jpg')]
image_files.sort(key=lambda x: os.path.getctime(os.path.join(downloads_folder, x)))

# change the number to match the count of all pairs
recent_images = image_files[-len(image_files):]


# Iterate over the images two at a time
for i, (img1, img2) in enumerate(zip(recent_images[::2], recent_images[1::2])):
    # Open the images
    images = [Image.open(downloads_folder + img1), Image.open(downloads_folder + img2)]

    # Create a new image by pasting the two images in symmetry
    new_image = Image.new('RGB', (images[0].width * 2, images[0].height))
    new_image.paste(images[0], (0, 0))
    new_image.paste(images[1], (images[0].width, 0))

    # Save the new image in created folder called pairs
    new_image_path = os.path.join("results/", 'new_image'+str(i)+'.jpg')
    new_image.save(new_image_path)
    