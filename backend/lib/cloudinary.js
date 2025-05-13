import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDAPI_KEY,
    api_secret:process.env.CLOUD_SECRET
})


export async function imageUploadUtil(filepath, resourceType = "auto") {
    return new Promise((resolve, reject) => {
        // Check if file exists before proceeding
        if (!fs.existsSync(filepath)) {
            return reject(new Error("File not found: " + filepath));
        }

        const uploadStream = cloudinary.v2.uploader.upload_stream(
            { resource_type: resourceType },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return reject(error);
                }
                console.log("Upload Success:", result);
                resolve(result);
            }
        );

        const fileStream = fs.createReadStream(filepath);

        fileStream.on("error", (err) => {
            console.error("File Stream Error:", err);
            reject(err);
        });

        fileStream.pipe(uploadStream);
    });
}
