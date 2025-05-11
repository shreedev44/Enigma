import { getSubscriptionDetails } from "@/api/recruiter";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const queryParams = new URLSearchParams(location.search);
			if (!queryParams.get("sessionId")) {
				navigate(`/recruiter${recruiterRoutes.SUBSCRIPTIONS}`);
				return;
			}
			const response = await getSubscriptionDetails();

			if (response.success) {
				setLoading(false);
				toast({
					description:
						"Congradulations, You are now a premium member",
				});
				navigate(`/recruiter${recruiterRoutes.SUBSCRIPTIONS}`);
			} else {
				setLoading(false);
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
			{loading ? (
				<>
					<ClassicSpinner />
					<br />
					Verifying payment
				</>
			) : (
				"Payment Successfull"
			)}
		</div>
	);
};

export default PaymentSuccess;
