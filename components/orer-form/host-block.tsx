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

      {(flyerFormStore.flyer?.form_type === "With Photo" || flyerFormStore.flyer?.hasPhotos) ? (
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Music className="w-4 h-4 text-primary" />
            Main Host
          </Label>

          {/* Input field with upload button on RIGHT side */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg shadow-md hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)] transition-all duration-300 pr-3">
              {/* Name input - takes full width */}
              <Input
                value={host?.name || ""}
                onChange={handleHostNameChange}
                placeholder="Enter host name..."
                className="bg-transparent border-none text-white placeholder:text-gray-600 
                  focus-visible:ring-0 focus-visible:ring-offset-0 h-10 flex-1 pl-3"
              />

              {/* Image preview on RIGHT (if uploaded) */}
              {(hostPreview || host?.image) && (
                <>
                  <div className="flex-shrink-0">
                    <img
                      src={hostPreview || (host?.image ? URL.createObjectURL(host.image) : "")}
                      alt="Host"
                      className="w-8 h-8 rounded object-cover border border-primary"
                    />
                  </div>

                  {/* Remove image button */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-primary text-xs hover:underline font-semibold flex-shrink-0"
                  >
                    Remove
                  </button>
                </>
              )}

              {/* Upload button on RIGHT (only show if NO image) */}
              {!hostPreview && !host?.image && (
                <label htmlFor="host-upload" className="cursor-pointer flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 hover:bg-primary/20 transition-all">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <input
                    id="host-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUploadHost}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
});

export default HostSection;
