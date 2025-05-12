import { Button } from "@/components/ui/button";
import {
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { DynamicPagination } from "../Pagination";
import { AppliationDrawerProps } from "@/types/propsTypes";
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
import {
	acceptSchedule,
	deleteApplication,
	rejectSchedule,
} from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import _ from "lodash";

const ApplicationDrawer: React.FC<AppliationDrawerProps> = ({
	pageData,
	setPage,
	applications,
	setApplications,
}) => {
	const { toast } = useToast();
	const handleDelete = async (applicationId: string) => {
		const response = await deleteApplication(applicationId);

		if (response.success) {
			setApplications(
				applications.filter((app) => app._id !== applicationId)
			);
			toast({
				description: response.data.message,
			});
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};

	const handleSchedule = async (
		applicationId: string,
		status: "accept" | "reject"
	) => {
		const fetchFunction =
			status === "accept" ? acceptSchedule : rejectSchedule;

		const response = await fetchFunction(applicationId);

		if (response.success) {
			toast({
				description: response.data.message,
			});
			let newApplications = _.cloneDeep(applications);
			newApplications = newApplications.map((value) => {
				if (value._id === applicationId) {
					value.status =
						status === "accept" ? "accepted" : "rejected";
				}
				return value;
			});
			setApplications(newApplications);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
		}
	};
	return (
		<DrawerContent>
			<div className="mx-auto w-full max-w-2xl">
				<DrawerHeader>
					<DrawerTitle className="text-center">
						My Applications
					</DrawerTitle>
				</DrawerHeader>
				{applications.length ? (
					applications.map((value, index) => (
						<div
							className="grid grid-cols-5 md:grid-cols-6 items-center text-sm py-2 border border-white rounded-md px-4"
							key={index}
						>
							<p className="col-span-2 font-medium">
								{value.role} at {value.companyName}
							</p>
							<p className="col-span-1 text-center">
								{new Date(value.createdAt).toLocaleDateString(
									"en-GB"
								)}
							</p>
							<p
								className={`col-span-${
									value.status === "interview requested"
										? "1 text-yellow-500"
										: "2"
								} text-center capitalize value ${
									value.status === "accepted"
										? "text-green-500"
										: value.status === "rejected"
										? "text-red-500"
										: ""
								}`}
							>
								{value.status}
							</p>
							{value.status === "interview requested" ? (
								<div className="col-span-1">
									<Button
										className="mr-1 bg-mildgreen"
										onClick={() =>
											handleSchedule(value._id, "accept")
										}
									>
										<Check />
									</Button>
									<Button
										variant={"destructive"}
										onClick={() =>
											handleSchedule(value._id, "reject")
										}
									>
										<X />
									</Button>
								</div>
							) : (
								<></>
							)}
							<div className="col-span-1 flex justify-center">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive" size="sm">
											Delete
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will permanently delete
												your application.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() =>
													handleDelete(value._id)
												}
											>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					))
				) : (
					<p className="text-center">No job applications yet</p>
				)}
				<DrawerFooter>
					{applications.length ? (
						<DynamicPagination
							key={123}
							{...pageData}
							setPage={setPage}
						/>
					) : (
						<></>
					)}
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</div>
		</DrawerContent>
	);
};

export default ApplicationDrawer;
