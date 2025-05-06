import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	findProblem,
	listProblem,
	unlistProblem,
	updateProblem,
} from "@/api/admin";
import { DifficultyType, ProblemType } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";
import { useSidebarContext } from "@/context/SidebarContext";
import { validateForm } from "@/validation/formValidation";
import { problemUpdationSchema } from "@/validation/formSchema";
import { adminRoutes } from "@/constants/routeUrl";

const ProblemDetails = () => {
	const { problemNo } = useParams();
	const { toast } = useToast();

	const [problem, setProblem] = useState<ProblemType | null>(null);
	const [formData, setFormData] = useState<ProblemType | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchProblemDetails = async () => {
			setLoading(true);
			const response = await findProblem(Number(problemNo));
			if (response.success) {
				setProblem(response.data.problem);
				setFormData(response.data.problem);
				setLoading(false);
			} else {
				toast({
					description: response.error,
					variant: "destructive",
				});
				setLoading(false);
			}
		};

		fetchProblemDetails();
	}, [problemNo, toast]);

	const { setBreadcrumbs } = useSidebarContext();
	useEffect(() => {
		setBreadcrumbs([
			{ component: "Problems", path: `/admin${adminRoutes.PROBLEMS}` },
			{ component: problem?.title || "" },
		]);
	}, [problem, setBreadcrumbs]);

	const handleChange = (field: keyof ProblemType, value: unknown) => {
		if (formData) {
			setFormData({ ...formData, [field]: value });
		}
		setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
	};

	const handleListing = async () => {
		const fetchFunction =
			problem?.status === "listed" ? unlistProblem : listProblem;

		setLoading(true);
		const response = await fetchFunction(problem?._id as string);

		if (response.success) {
			toast({
				description: response.data.message,
			});
			setLoading(false);
			const status = problem?.status === "listed" ? "unlisted" : "listed";
			setProblem((prev) => (prev ? { ...prev, status } : prev));
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	const handleSubmit = async () => {
		if (!problem || !formData) return;

		const updatedFields: Partial<ProblemType> = {};
		for (const key in formData) {
			if (
				formData[key as keyof ProblemType] !==
				problem[key as keyof ProblemType]
			) {
				updatedFields[key as keyof ProblemType] =
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					formData[key as keyof ProblemType] as any;
			}
		}

		if (Object.keys(updatedFields).length === 0) {
			toast({
				description: "No changes detected.",
			});
			return;
		}

		const error = validateForm(
			problemUpdationSchema,
			updatedFields as Record<string, unknown>
		);

		if (error) {
			setErrors((prevErrors) => ({
				...prevErrors,
				[error.field]: error.message,
			}));
			return;
		}

		setLoading(true);
		const response = await updateProblem(
			problem._id as string,
			updatedFields
		);
		if (response.success) {
			toast({
				description: response.data.message,
			});
			setProblem({ ...problem, ...updatedFields });
			setIsEditing(false);
			setLoading(false);
		} else {
			toast({
				description: response.error,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	if (loading && !problem) {
		return <ClassicSpinner />;
	}

	return (
		<div className="my-10 md:mt-16">
			<form onSubmit={(e) => e.preventDefault()}>
				<div className="mb-8">
					<Label htmlFor="problemName" className="text-sm">
						<strong className="mr-3 text-lg">Title</strong>
					</Label>
					<Input
						type="text"
						id="problemName"
						className="w-full md:w-2/3 md:mt-3"
						value={formData?.title || ""}
						onChange={(e) => handleChange("title", e.target.value)}
						disabled={!isEditing}
					/>
					{errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{errors.title}
						</p>
					)}
				</div>

				<div className="mb-8">
					<Label htmlFor="difficulty" className="text-sm">
						<strong className="mr-3 text-lg">Difficulty</strong>
					</Label>
					<Select
						value={formData?.difficulty || "Beginner"}
						onValueChange={(value) =>
							handleChange("difficulty", value as DifficultyType)
						}
						disabled={!isEditing}
					>
						<SelectTrigger className="md:w-[250px] w-full mb-2 md:mb-0 shadow-md md:mr-2 md:mt-3">
							<SelectValue placeholder="Difficulty" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Beginner">Beginner</SelectItem>
							<SelectItem value="Intermediate">
								Intermediate
							</SelectItem>
							<SelectItem value="Advanced">Advanced</SelectItem>
						</SelectContent>
					</Select>
					{errors.difficulty && (
						<p className="text-red-500 text-sm mt-1">
							{errors.difficulty}
						</p>
					)}
				</div>

				<div className="mb-8">
					<Label htmlFor="problemDescription" className="text-sm">
						<strong className="mr-3 text-lg">Description</strong>
					</Label>
					<Textarea
						id="problemDescription"
						className="resize-none w-full md:w-2/3 h-80 md:mt-3"
						value={formData?.description || ""}
						onChange={(e) =>
							handleChange("description", e.target.value)
						}
						disabled={!isEditing}
					/>
					{errors.description && (
						<p className="text-red-500 text-sm mt-1">
							{errors.description}
						</p>
					)}
				</div>

				<div className="mb-8">
					<Label htmlFor="functionName" className="text-sm">
						<strong className="mr-3 text-lg">Function Name</strong>
					</Label>
					<Input
						type="text"
						id="functionName"
						className="w-full md:w-1/3 md:mt-3"
						value={formData?.functionName || ""}
						onChange={(e) =>
							handleChange("functionName", e.target.value)
						}
						disabled={!isEditing}
					/>
					{errors.functionName && (
						<p className="text-red-500 text-sm mt-1">
							{errors.functionName}
						</p>
					)}
				</div>

				<div className="mb-24">
					<Button
						size="lg"
						className="font-bold font-mono mr-2 bg-mildgreen"
						onClick={() => {
							if (isEditing) {
								setFormData(problem);
								setErrors({});
							}
							setIsEditing(!isEditing);
						}}
					>
						{isEditing ? "Cancel" : "Edit"}
					</Button>
					{isEditing && (
						<Button
							size="lg"
							className="font-bold font-mono bg-mildgreen"
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading ? (
								<ClassicSpinner size={8} />
							) : (
								"Save Changes"
							)}
						</Button>
					)}
					<Button
						size="lg"
						className={`font-bold font-mono ml-2 ${
							problem?.status === "listed" ? "" : "bg-mildgreen"
						}`}
						variant={
							problem?.status === "listed"
								? "destructive"
								: "default"
						}
						onClick={handleListing}
					>
						{problem?.status === "listed" ? "Unlist" : "List"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ProblemDetails;
