import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUploadImageMutation } from "@/redux/userauth";
import { useRef, useState } from "react";

export function Imageupload({ setimageurl }) {
    const [uploadImage, { isLoading, error }] = useUploadImageMutation(); // ✅ Fixed
    const inputref = useRef(null);
    const [imagefile, setimagefile] = useState(null); // ✅ Fixed (was '')

    const { toast } = useToast();

    function handleimage(e) {
        e.preventDefault();
        const selectedfile = e.target.files?.[0];
        if (selectedfile) {
            setimagefile(selectedfile);
        }
    }

    function handleremove() {
        setimagefile(null); // ✅ Fixed (was "")
        if (inputref.current) {
            inputref.current.value = "";
        }
    }

    function handleDrag(e) {
        e.preventDefault();
        e.stopPropagation(); // ✅ Fixed
    }

    function handledrop(e) {
        e.preventDefault();
        const dropFile = e.dataTransfer.files?.[0];
        if (dropFile) {
            setimagefile(dropFile);
        }
    }

    async function uploadtocloudinary() {
        if (!imagefile) {
            toast({ title: "Error", description: "No file selected" });
            return;
        }

        try {
            const response = await uploadImage(imagefile).unwrap(); // ✅ Fixed
            toast({ title: "Success", description: "Image uploaded successfully" });

            if (response) {
                setimageurl(response.url);
            }
        } catch (error) {
            toast({ title: "Error", description: error?.message || "Upload failed" });
        }
    }

    return (
        <div>
            <div onDragOver={handleDrag} onDrop={handledrop}>
                <Input id="image-upload" type="file" ref={inputref} onChange={handleimage} />
                <Button onClick={uploadtocloudinary} disabled={isLoading} className="font-bold
                text-center border-2 bg-blue-300 p-4 mt-4 hover:bg-amber-100
                ">
                    {isLoading ? "Uploading..." : "Upload"}
                </Button>
                {imagefile && (
                    <Button className="ml-2 bg-red-500 text-white" onClick={handleremove}>
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
}
