import { getPlans, getSubscriptionDetails } from "@/api/recruiter";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlanCardSkeleton from "@/components/loaders/PlanCardSkeleton";
import PricingCard from "@/components/PricingCard";
import { useToast } from "@/hooks/use-toast";
import { PricingCardProps } from "@/types/propsTypes";
import { CurrentSubscription } from "@/types/types";
import { useEffect, useState } from "react";

const Subscriptions = () => {
	const [loading, setLoading] = useState(false);
	const [plans, setPlans] = useState<PricingCardProps[]>([]);
	const [current, setCurrent] = useState<CurrentSubscription | null>();

	const { toast } = useToast();

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await getPlans();

			if (response.success) {
				setPlans(response.data.plans);
				setLoading(false);
				const subResp = await getSubscriptionDetails();
				if (subResp.success) {
					setCurrent(subResp.data);
				} else {
					toast({
						description: response.error,
						variant: "destructive",
					});
				}
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="pt-24">
			<Breadcrumbs
				components={[
					{
						component: "Subscription plans",
					},
				]}
			/>
			<div className="max-w-6xl mx-auto text-center mt-5 md:mt-20 mb-5">
				<h2 className="text-4xl font-bold mb-2">Our Pricing Plan</h2>
				<p className="text-gray-300 mb-2">
					Unlock the full potential of recruitment with Enigma premium
				</p>
				{current ? (
					<p className="mb-10 text-red-500">
						Current plan will expire on{" "}
						{new Date(current.expiresAt).toLocaleDateString("en-GB")}.
					</p>
				) : (
					<></>
				)}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{loading
						? [...Array(3)].map((_, index) => {
								return <PlanCardSkeleton key={index} />;
						  })
						: plans.map((value, index) => {
								return (
									<PricingCard
										key={index}
										{...value}
										userLevel="recruiter"
									/>
								);
						  })}
				</div>
			</div>
		</div>
	);
};

export default Subscriptions;
