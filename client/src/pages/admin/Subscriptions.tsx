import { getPLans } from "@/api/admin";
import PlanCardSkeleton from "@/components/loaders/PlanCardSkeleton";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { adminRoutes } from "@/constants/routeUrl";
import { useSidebarContext } from "@/context/SidebarContext";
import { useToast } from "@/hooks/use-toast";
import { PricingCardProps } from "@/types/propsTypes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
	const { setBreadcrumbs } = useSidebarContext();
	useEffect(() => {
		setBreadcrumbs([{ component: "Subscription Plans" }]);
	}, [setBreadcrumbs]);
	const navigate = useNavigate();
	const { toast } = useToast();

	const [loading, setLoading] = useState(false);
	const [plans, setPlans] = useState<PricingCardProps[]>([]);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await getPLans();

			if (response.success) {
				setPlans(response.data.plans);
				setLoading(false);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading(false);
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section className="py-16 px-4 sm:px-8">
			<div className="flex justify-end">
				<Button
					className="font-bold font-mono bg-mildgreen my-3"
					size={"lg"}
					onClick={() => navigate(`/admin${adminRoutes.ADD_PLAN}`)}
				>
					Add Plan
				</Button>
			</div>
			<div className="max-w-6xl mx-auto text-center">
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
										userLevel="admin"
									/>
								);
						  })}
				</div>
			</div>
		</section>
	);
};

export default Subscriptions;
