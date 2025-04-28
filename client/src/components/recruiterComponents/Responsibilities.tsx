import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface ResponsibilitiesProps {
    responsibilities: string[];
    setResponsibilities: React.Dispatch<React.SetStateAction<string[]>>;
}

const Responsibilities: React.FC<ResponsibilitiesProps> = ({
    responsibilities,
    setResponsibilities,
}) => {
    return (
        <div className="space-y-2">
            <Label>Responsibilities</Label>
            <div className="flex gap-2">
                <Input
                    placeholder="Enter responsibilities"
                    className="border"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            setResponsibilities([
                                ...responsibilities,
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
                            'input[placeholder="Enter responsibilities"]'
                        );
                        if (input && input.value.trim()) {
                            setResponsibilities([
                                ...responsibilities,
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
                {responsibilities.map((resp, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                        <span>{resp}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setResponsibilities(
                                    responsibilities.filter((_, i) => i !== index)
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

export default Responsibilities;