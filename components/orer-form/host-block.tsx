import React, { useState } from "react";
import { Music, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toJS } from "mobx";

const HostSection = observer(() => {
  const { flyerFormStore } = useStore();
  const host = flyerFormStore.flyerFormDetail.host;

  // For instant image preview (local)
  const [hostPreview, setHostPreview] = useState<string | null>(null);

  // -----------------------------
  // ✅ Handle host name change
  // -----------------------------
  const handleHostNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    flyerFormStore.updateHost("name", e.target.value);
  };

  // -----------------------------
  // ✅ Handle host image upload
  // -----------------------------
  const handleFileUploadHost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    flyerFormStore.updateHost("image", file);

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setHostPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // -----------------------------
  // ✅ Remove image
  // -----------------------------
  const handleRemoveImage = () => {
    flyerFormStore.updateHost("image", null);
    setHostPreview(null);
  };

  // -----------------------------
  // ✅ Render
  // -----------------------------
  return (
    <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-bold">Host *</h2>

      <div className="grid grid-cols-2 gap-6 mb-4">
        {flyerFormStore.flyer?.hasPhotos ? <div className="col-span-2">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Music className="w-4 h-4 text-theme text-sm" />
              Main Host
            </Label>

            <div className="flex items-center gap-4">
              {/* Upload Button */}
              <label htmlFor="host-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-sm font-semibold">Upload Image</span>
                  <Upload className="w-4 h-4" />
                </div>
                <input
                  id="host-upload"
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
            {(hostPreview || host?.image) && (
              <>
                <img
                  src={
                    hostPreview ||
                    (host?.image ? URL.createObjectURL(host.image) : "")
                  }
                  alt="Host"
                  className="w-8 h-8 rounded-full object-fill border-2 border-primary"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-primary text-xs hover:underline"
                >
                  Remove Image
                </button>
              </>
            )}

            <Input
              value={host?.name || ""}
              onChange={handleHostNameChange}
              placeholder="Enter host name..."
              className="bg-transparent border-none text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            />

            <span className="text-gray-500 text-sm whitespace-nowrap">
              {host?.image ? "Image uploaded" : "No file chosen"}
            </span>
          </div>
        </div>
          :
          <div className="col-span-2">
            <Input
              value={host?.name || ""}
              onChange={handleHostNameChange}
              placeholder="Enter host name..."
              className="bg-gray-950 border border-gray-800 text-white
              placeholder:text-gray-600 rounded-lg h-10 shadow-md
              focus-visible:!ring-0 focus-visible:!outline-none
              focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
              transition-all duration-300"
            />
          </div>
        }
      </div>
    </div>
  );
});

export default HostSection;
