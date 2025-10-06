import { useState } from "react";
import { Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type DeliveryOption = {
    id: string;
    label: string;
    value: string;
    price: string;
    color: string;
};

export default function DeliveryTimeBlock() {
    const [deliveryTime, setDeliveryTime] = useState<string>("");

    const deliveryOptions: DeliveryOption[] = [
        { id: "delivery2", label: "5 Hours", value: "5hours", price: '10', color: "bg-primary" },
        { id: "delivery24", label: "24 Hours", value: "24hours", price: 'FREE', color: "bg-primary" },
    ];

    return (
        <div className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 rounded-2xl border-1 border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold ">
                    Delivery Time
                </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {deliveryOptions.map((opt) => (
                    <div
                        key={opt.id}
                        className="flex items-center bg-gray-950 justify-between p-2 rounded-lg border border-gray-800 hover:!ring-0 hover:!outline-none hover:!border-primary
             hover:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id={opt.id}
                                checked={deliveryTime === opt.value}
                                onCheckedChange={(checked) => checked && setDeliveryTime(opt.value)}
                                className="border-1 border-primary rounded-sm w-4 h-4"
                            />
                            <Label htmlFor={opt.id} className="text-white text-sm cursor-pointer font-medium">
                                {opt.label}
                            </Label>
                        </div>
                        <span className="text-primary text-sm font-bold">${opt.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
