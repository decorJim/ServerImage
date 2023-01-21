import * as fs from 'fs';
import Jimp from 'jimp';

class imageService {
    constructor() {

    } 

    async process() {
        const imagesFolder = 'images/';

        const imageFiles = fs.readdirSync(imagesFolder)
            .filter((file) => file.endsWith('.jpg'))
            .sort((a, b) => fs.statSync(`${imagesFolder}/${a}`).ctime.getTime() - fs.statSync(`${imagesFolder}/${b}`).ctime.getTime());

        const recentImages = imageFiles.slice(-imageFiles.length);

        for (let i = 0; i < recentImages.length; i += 2) {
            const image1 = recentImages[i];
            const image2 = recentImages[i + 1];

        Jimp.read(`${imagesFolder}/${image1}`)
          .then((image1) => Jimp.read(`${imagesFolder}/${image2}`)
          .then((image2) => {
              const newImage = new Jimp(image1.bitmap.width * 2, image1.bitmap.height);
              newImage.composite(image1, 0, 0);
              newImage.composite(image2, image1.bitmap.width, 0);
              newImage.write(`results/new_image${i}.jpg`);
          }))
        .catch((err) => console.error(err));

      }
       

    }

}


const service=new imageService();
export default service;