import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface RequirementsProps {
    requirements: string[];
    setRequirements: React.Dispatch<React.SetStateAction<string[]>>;
}

const Requirements: React.FC<RequirementsProps> = ({
    requirements,
    setRequirements,
}) => {
    return (
        <div className="space-y-2">
            <Label>Requirements</Label>
            <div className="flex gap-2">
                <Input
                    placeholder="Enter requirement"
                    className="border"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            setRequirements([
                                ...requirements,
                                e.currentTarget.value.trim(),
                            ]);
                            e.currentTarget.value = "";
                            e.preventDefault();
                        }
                    }}
                />
                <Button
                    type="button"
                    onClick={() => {
                        const input = document.querySelector<HTMLInputElement>(
                            'input[placeholder="Enter requirement"]'
                        );
                        if (input && input.value.trim()) {
                            setRequirements([
                                ...requirements,
                                input.value.trim(),
                            ]);
                            input.value = "";
                        }
                    }}
                >
                    +
                </Button>
            </div>
            <ul className="list-disc pl-5">
                {requirements.map((req, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                        <span>{req}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setRequirements(
                                    requirements.filter((_, i) => i !== index)
                                )
                            }
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Requirements;