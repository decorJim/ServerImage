/*import Jimp from 'jimp';

onmessage = async (event) => {
    const image1 = event.data.image1;
    const image2 = event.data.image2;

    const image1Jimp = await Jimp.read(image1);
    const image2Jimp = await Jimp.read(image2);

    // do some image processing here 
    const newImage = new Jimp(image1.bitmap.width * 2, image1.bitmap.height);
    newImage.composite(image1, 0, 0);
    newImage.composite(image2, image1.bitmap.width, 0);
    newImage.write('\`results/new_image${i}.jpg\`');
}*/
