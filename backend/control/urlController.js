import path from "path";
import fs from "fs";
import formidable from "formidable";
import { fileURLToPath } from "url";
import {urlModel} from "../model/urlmodel.js";
import {imageUploadUtil} from "../lib/cloudinary.js"; // Cloudinary upload helper

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadVideo = async (req, res) => {
    const uploadDir = path.resolve(__dirname, "../upload");

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        multiples: false,
    });

    try {
        // Parse form data
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve([fields, files]);
            });
        });

        if (!files.media) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = files.media[0];
        const filePath = file.filepath;
        const fileType = file.mimetype.startsWith("video") ? "video" : "image";

        // Upload to Cloudinary
        const result = await imageUploadUtil(filePath, fileType);

        // Remove local file after upload
        await fs.promises.unlink(filePath);

        console.log("Uploaded URL:", result.secure_url);

        // Save URL in `URLModel`
        const urlDocument = new urlModel({
            url: result.secure_url,
            type: fileType,
        });

        await urlDocument.save();

        return res.json({ urlId: urlDocument._id, url: result.secure_url, type: fileType });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: error.message });
    }
};
