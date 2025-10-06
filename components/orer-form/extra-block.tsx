import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Extras = {
    bottle: boolean;
    food: boolean;
    animation: boolean;
};

export default function ExtrasBlock() {
    const [extras, setExtras] = useState<Extras>({
        bottle: false,
        food: false,
        animation: false,
    });

    const extrasList = [
        { id: "bottle", label: "Bottle for VIP", price: 10, key: "bottle" },
        { id: "food", label: "Food for VIP", price: 15, key: "food" },
        { id: "animation", label: "Add animation", price: 20, key: "animation" },
    ];

    return (
        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border-1 border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Extras
                </h2>
                <Plus className="h-4 w-4 text-primary animate-pulse" />
            </div>

            {/* Extras List */}
            <div className="space-y-3">
                {extrasList.map((extra) => (
                    <div
                        key={extra.id}
                        className="flex bg-gray-950 items-center justify-between p-2 rounded-lg  border border-gray-800 hover:!ring-0 hover:!outline-none hover:!border-primary
             hover:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id={extra.id}
                                checked={extras[extra.key as keyof Extras]}
                                onCheckedChange={(checked) =>
                                    setExtras({ ...extras, [extra.key]: checked as boolean })
                                }
                                className="border-1 border-primary rounded-sm w-4 h-4"
                            />
                            <Label
                                htmlFor={extra.id}
                                className="text-white text-sm cursor-pointer font-medium"
                            >
                                {extra.label}
                            </Label>
                        </div>
                        <span className="text-primary text-sm font-bold">${extra.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
