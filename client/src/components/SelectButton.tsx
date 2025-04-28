import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SelectButtonProps } from "@/types/propsTypes";

const SelectButton: React.FC<SelectButtonProps> = ({
	width = "180",
	label,
	placeholder,
	values,
	state,
	setState
}) => {
	return (
		<Select value={state} onValueChange={(value) => setState(value)}>
			<SelectTrigger className={`w-[${width}px]`}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>{label}</SelectLabel>
					{values.map((value, index) => (
						<SelectItem value={value.value} key={index}>
							{value.display}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default SelectButton;
