# RUN SCRIPT WITH COMMAND "python script.py"
# must have import PIL with command "pip install pillow" in terminal
import os
from PIL import Image
import threading

downloads_folder = 'images/'
image_files = [f for f in os.listdir(downloads_folder) if f.endswith('.jpg')]
image_files=sorted(image_files, key=lambda x: int(x.split("-")[1].split(".")[0]))

# change the number to match the count of all pairs
recent_images = image_files[-len(image_files):]

def process_images(img1, img2, i):
    # Open the images
    images = [Image.open(downloads_folder + img1), Image.open(downloads_folder + img2)]

    # Create a new image by pasting the two images in symmetry
    new_image = Image.new('RGB', (images[0].width * 2, images[0].height))
    new_image.paste(images[0], (0, 0))
    new_image.paste(images[1], (images[0].width, 0))

    # Save the new image in created folder called pairs
    new_image_path = os.path.join("results/", 'new_image'+str(i)+'.jpg')
    new_image.save(new_image_path)

# Iterate over the images two at a time
for i, (img1, img2) in enumerate(zip(recent_images[::2], recent_images[1::2])):
    # Create a new thread for each pair of images
    t = threading.Thread(target=process_images, args=(img1, img2, i))
    t.start()
