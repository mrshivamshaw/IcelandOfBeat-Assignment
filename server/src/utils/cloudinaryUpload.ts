import cloudinary from '../config/cloudinary';

const uploadImage = async (file: string) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        });
        return result;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

export default uploadImage;
