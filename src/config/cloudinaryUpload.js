const cloudinary = require("./cloudinary");

const uploadToCloudinary = (fileBuffer, folder = "devTinder") => {
    return new Promise((resolve, reject)=> {
    const uploadStream = cloudinary.uploader.upload_stream(
        {
        folder: folder,
        resource_type: 'image',
        transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: 'auto' }
        ]
    },
        (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.secure_url);
            }
        }
    );
    uploadStream.end(fileBuffer);
});
}

module.exports={uploadToCloudinary};