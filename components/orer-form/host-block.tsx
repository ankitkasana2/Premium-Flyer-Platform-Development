import React, { useState } from "react";
import { Music, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
 
const HostSection = () => {
  const [djName, setDjName] = useState("");
  const [hostImage, setDjImage] = useState<string | null>(null);
 
  // for host
  const handleFileUploadHost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
 
    const reader = new FileReader();
    reader.onload = () => {
      setDjImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
 
  return (
    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-bold">Host</h2>
 
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Music className="w-4 h-4 text-theme text-sm" />
              Main DJ or Artist
            </Label>
 
            <div className="flex items-center gap-4">
              <label htmlFor="dj-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-sm font-semibold">Upload Image</span>
                  <Upload className="w-4 h-4" />
                </div>
                <input
                  id="dj-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadHost}
                  className="hidden"
                />
              </label>
            </div>
          </div>
 
          <div
            className="flex items-center gap-3 bg-gray-950 border rounded-lg p-3 h-10 shadow-md
            hover:!ring-0 hover:!outline-none hover:!border-primary
            hover:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
            transition-all duration-300"
          >
            {hostImage && (
              <>
                <img
                  src={hostImage}
                  alt="DJ"
                  className="w-8 h-8 rounded-full object-fill border-2 border-primary"
                />
                <button
                  type="button"
                  onClick={() => setDjImage(null)}
                  className="text-primary text-xs hover:underline"
                >
                  Remove Image
                </button>
              </>
            )}
 
            <Input
              value={djName}
              onChange={(e) => setDjName(e.target.value)}
              placeholder="Enter DJ name..."
              className="bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            />
 
            <span className="text-gray-500 text-sm whitespace-nowrap">
              {hostImage ? "Image uploaded" : "No file chosen"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default HostSection;