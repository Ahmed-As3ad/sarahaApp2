import { v2 as cloudinary } from 'cloudinary';

export const cloud = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
    return cloudinary;
}

export const fileUpload = async ({ file, path = 'general' } = {}) => {
    return await cloud().uploader.upload(file.path,{
        folder:`${process.env.APP_NAME}/${path}`
    })
}

export const destroyFile = async ({ public_id } = {}) => {
    if (!public_id) throw new Error("Public ID is required");
    return await cloud().uploader.destroy(public_id);
}

export default cloud;