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
import { deleteApplication } from "@/api/student";
import { useToast } from "@/hooks/use-toast";

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
							className="flex justify-around items-center rounded-md py-3 border border-white"
							key={index}
						>
							<p>{`${value.role} at ${value.companyName}`}</p>
							{`Applied on ${new Date(
								value.createdAt
							).toLocaleDateString("en-GB")}`}
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant={"destructive"}>
										Delete
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will permanently delete your
											application.
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
