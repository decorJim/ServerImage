import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from 'firebase/storage'

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBo-8Ir82N_ohkJDke4pehWXnWsMZGcP7A",
    authDomain: "imagedb-b48ed.firebaseapp.com",
    projectId: "imagedb-b48ed",
    storageBucket: "imagedb-b48ed.appspot.com",
    messagingSenderId: "552335127110",
    appId: "1:552335127110:web:ca9dc9034c00bb0f0b5047",
    measurementId: "G-XYKV61E7X9"
});

export const uploadFile = async (i: string, buffer: any, folder: string) => {

    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage,folder+"/image-"+ i + ".jpg");

    const metadata = {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
    };

    return await uploadBytes(storageRef, buffer, metadata)
    .then((snapshot: any) => {
        return "https://firebasestorage.googleapis.com/v0/b/log3900-102.appspot.com/o/" + folder + "/image-" + i + ".jpg";
    }).catch((err: any) => {
        return err;
    });
   

}

export const uploadFiles = async (images: any[], folder: string) => {
    const storage = getStorage(firebaseApp);
    let imageUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
        const buffer = images[i].buffer;
        const storageRef = ref(storage,folder+"/image-"+ i + ".jpg");
        const metadata = {
            contentType: 'image/jpeg',
            cacheControl: 'public, max-age=31536000',
        };
        const url = await uploadBytes(storageRef, buffer, metadata)
        .then((snapshot: any) => {
            return "https://firebasestorage.googleapis.com/v0/b/imagedb.appspot.com/o/" + folder + "/image-" + i + ".jpg";
        }).catch((err: any) => {
            return err;
        });
        imageUrls.push(url);
    }
    return imageUrls;
}
