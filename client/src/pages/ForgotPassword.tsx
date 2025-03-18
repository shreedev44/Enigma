import { forgotPassword } from "@/api/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginValidationSchema } from "@/validation/formSchema";
import { validateForm } from "@/validation/formValidation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  adminRoutes,
  recruiterRoutes,
  studentRoutes,
} from "@/constants/routeUrl";
import { Role } from "@/types/formTypes";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmission = async (event: React.FormEvent) => {
    event.preventDefault();

    const error = validateForm(
      { email: loginValidationSchema.email },
      { email }
    );

    if (error) {
      setError(error);
      return;
    } else {
      setError({ field: "", message: "" });
    }

    setLoading(true);

    const pathName = window.location.pathname;
    let role: Role | null;
      if (pathName.includes("recruiter")) {
        role = "recruiter"
      } else if (pathName.includes("admin")) {
        role = "admin"
      } else {
        role = "student"
      }

    const response = await forgotPassword(email, role);

    if (response.success) {
      toast({
        description: response.data.message,
      });
      const pathName = window.location.pathname;
      if (pathName.includes("recruiter")) {
        navigate(`/recruiter${recruiterRoutes.SIGNIN}`);
      } else if (pathName.includes("admin")) {
        navigate(`/admin${adminRoutes.SIGNIN}`);
      } else {
        navigate(studentRoutes.SIGNIN);
      }
      setLoading(false);
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmission}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-xl font-bold">Forgot your password?</h1>
                <div className="text-center text-sm">
                  Don&apos;t worry. You can reset your password by entering your
                  registered email here. A password reset link will be sent to
                  your email and you reset your password there!
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error.field === "email" ? (
                    <p className="text-red-500 text-xs">{error.message}</p>
                  ) : (
                    <></>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <ClassicSpinner />
                  ) : (
                    "Sent Link"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
