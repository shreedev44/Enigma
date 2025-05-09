import { PricingCardProps } from "@/types/propsTypes";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { listPlan, unListPlan } from "@/api/admin";
import { useToast } from "@/hooks/use-toast";
import ClassicSpinner from "./loaders/ClassicSpinner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PricingCard: React.FC<PricingCardProps> = ({
	_id,
	name,
	price,
	maxInterviews,
	durationInDays,
	highlight = false,
	listed,
	userLevel,
}) => {
	const [visible, setVisibility] = useState(listed)
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const handleList = async (planId: string) => {
		const fetchFunction = visible ? unListPlan : listPlan;

		setLoading(true);
		const response = await fetchFunction(planId);

		if (response.success) {
			toast({
				description: response.data.message,
			});
			setLoading(false);
			setVisibility(!visible)
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading(false);
		}
	};
	return (
		<div
			className={`flex flex-col justify-between rounded-xl p-6 border ${
				highlight ? "border-teal-500" : "border-gray-700"
			}`}
		>
			<h3 className="text-xl font-bold mb-1">{name}</h3>
			<div className="text-3xl font-semibold mb-4">₹ {price}</div>
			<p className="my-5">
				Schedule upto {maxInterviews} interviews for {durationInDays}{" "}
				days
			</p>
			{userLevel === "admin" ? (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button className="font-bold font-mono">
							{visible && !loading ? "Unlist" : "List"}{" "}
							{loading && <ClassicSpinner />}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action will make the plan{" "}
								{visible ? "hidden" : "visible"} for the users
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => handleList(_id)}>Continue</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			) : (
				<Button className="font-bold font-mono" disabled={highlight}>
					{loading ? <ClassicSpinner /> : "Buy"}
				</Button>
			)}
		</div>
	);
};

export default PricingCard;
