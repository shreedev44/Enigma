/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminRoutes } from "@/constants/routeUrl";
import { useSidebarContext } from "@/context/SidebarContext";
import { planCreationSchema } from "@/validation/formSchema";
import { validateForm } from "@/validation/formValidation";
import { useEffect, useState } from "react";
import planImage from "@/assets/plan.jpg";
import { createPlan } from "@/api/admin";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";

const AddPlan = () => {
	const { setBreadcrumbs } = useSidebarContext();
	useEffect(() => {
		setBreadcrumbs([
			{
				component: "Subscription Plans",
				path: `/admin${adminRoutes.SUBCSRIPTIONS}`,
			},
			{ component: "Add Plan" },
		]);
	}, []);

	const navigate = useNavigate();
	const { toast } = useToast();

	const [name, setName] = useState("");
	const [maxInterviews, setMaxInterviews] = useState("");
	const [price, setPrice] = useState("");
	const [duration, setDuration] = useState("");
	const [error, setError] = useState({ field: "", message: "" });
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		const obj = {
			name,
			maxInterviews: Number(maxInterviews),
			price: Number(price),
			durationInDays: Number(duration),
		};
		const error = validateForm(planCreationSchema, obj);

		if (error) {
			setError(error);
			return;
		} else {
			setError({ field: "", message: "" });
		}

		setLoading(true);
		const response = await createPlan(obj);

		if (response.success) {
			setLoading(false);
			navigate(`/admin${adminRoutes.SUBCSRIPTIONS}`);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading(false);
		}
	};
	return (
		<div className="mt-10 relative">
			<div className="flex">
				<div className="w-full md:w-1/2">
					<form
						className="space-y-8 max-w-2xl md:pl-4"
						onSubmit={(e) => e.preventDefault()}
					>
						<div className="space-y-2">
							<Label htmlFor="planName">Plan Name</Label>
							<Input
								id="planName"
								placeholder="Enter plan name"
								className="border"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							{error.field === "name" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="price">Price (INR)</Label>
							<Input
								id="price"
								type="number"
								placeholder="Enter price"
								className="border"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
							{error.field === "price" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="maxInterviews">
								Maximum Interviews (can be conducted)
							</Label>
							<Input
								id="maxInterviews"
								type="number"
								placeholder="Enter maximum interviews"
								className="border"
								value={maxInterviews}
								onChange={(e) =>
									setMaxInterviews(e.target.value)
								}
							/>
							{error.field === "maxInterviews" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="duration">Duration (days)</Label>
							<Input
								id="duration"
								type="number"
								placeholder="Enter plan duration in days"
								className="border"
								value={duration}
								onChange={(e) => setDuration(e.target.value)}
							/>
							{error.field === "duration" && (
								<p className="text-red-500 text-sm">
									{error.message}
								</p>
							)}
						</div>

						<Button
							className="bg-mildgreen rounded-full px-10 font-bold font-mono"
							size={"lg"}
							onClick={handleSubmit}
                            disabled={loading}
						>
							{loading ? <ClassicSpinner /> : "Create Plan"}
						</Button>
					</form>
				</div>
			</div>
			<div className="hidden md:block md:w-1/2 relative">
				<img
					src={planImage}
					alt="Plans"
					className="fixed top-32 right-14 w-1/4 object-cover rounded-2xl"
				/>
			</div>
		</div>
	);
};

export default AddPlan;
