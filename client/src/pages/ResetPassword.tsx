import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginValidationSchema } from "@/validation/formSchema";
import { validateForm } from "@/validation/formValidation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import {
  adminRoutes,
  recruiterRoutes,
  studentRoutes,
} from "@/constants/routeUrl";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuCircleAlert } from "react-icons/lu";
import { resetPassword } from "@/api/common";
import { Role } from "@/types/formTypes";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";

const ResetPassword = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const search = new URLSearchParams(location.search);
  const token = search.get("token");
  const path = location.pathname;

  useEffect(() => {
    if (!token) {
      if (path.includes("recruiter")) {
        navigate(`/recruiter${recruiterRoutes.SIGNIN}`);
      } else if (path.includes("admin")) {
        navigate(`/admin${adminRoutes.SIGNIN}`);
      } else {
        navigate(studentRoutes.SIGNIN);
      }
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleCPasswordVisibility = () => {
    setIsCPasswordVisible(!isCPasswordVisible);
  };

  const handleSubmission = async (event: React.FormEvent) => {
    event.preventDefault();

    const error = validateForm(
      { password: loginValidationSchema.password },
      { password }
    );

    if (error) {
      setError(error);
      return;
    } else {
      if (password !== confirmPassword) {
        setError({
          field: "confirmPassword",
          message: "Password does not match",
        });
        return;
      }
      setError({ field: "", message: "" });
    }

    setLoading(true);

    let role: Role | null;
    if (path.includes("recruiter")) {
      role = "recruiter"
    } else if (path.includes("admin")) {
      role = "admin"
    } else {
      role = "student"
    }
    const response = await resetPassword(token as string, password, role);

    if (response.success) {
      toast({
        description: response.data.message,
      });
      if (path.includes("recruiter")) {
        navigate(`/recruiter${recruiterRoutes.SIGNIN}`);
      } else if (path.includes("admin")) {
        navigate(`/admin${adminRoutes.SIGNIN}`);
      } else {
        navigate(studentRoutes.SIGNIN);
      }
      setLoading(false);
    } else {
      setLoading(false);
      toast({
        description: response.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmission}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-xl font-bold">Reset your password</h1>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    {error.field === "password" ? (
                      <LuCircleAlert color="red" size={18} />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {isPasswordVisible ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                  {error.field === "password" ? (
                    <p className="text-red-500 text-xs">{error.message}</p>
                  ) : (
                    <></>
                  )}
                </div>
                  <div className="flex justify-between">
                    <Label htmlFor="cpassword" className="mr-2">
                      Confirm Password
                    </Label>
                    {error.field === "confirmPassword" ? (
                      <LuCircleAlert color="red" size={18} />
                    ) : (
                      <></>
                    )}
                  </div>
                <div className="relative">
                  <Input
                    type={isCPasswordVisible ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="pr-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={toggleCPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {isCPasswordVisible ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
                {error.field === "confirmPassword" ? (
                  <p className="text-red-500 text-xs">{error.message}</p>
                ) : (
                  <></>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <ClassicSpinner />
                  ) : (
                    "Reset Password"
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

export default ResetPassword;
