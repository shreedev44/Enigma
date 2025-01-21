import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import banner from "../../assets/signinbanner.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuCircleAlert } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { validateForm } from "@/validation/formValidation";
import { loginValidationSchema } from "@/validation/formSchema";
import { signin } from "@/api/admin";
import { useToast } from "@/hooks/use-toast";
import { adminRoutes } from "@/constants/routeUrl";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/redux/adminSlice";

const SigninForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleSubmission = async (event: React.FormEvent) => {
    event.preventDefault();

    const error = validateForm(loginValidationSchema, { email, password });

    if (error) {
      setError(error);
      return;
    } else {
      setError({ field: "", message: "" });
    }

    setLoading(true);

    const response = await signin(email, password);

    if (response.success) {
      setLoading(false);
      toast({
        description: `Signed in successfully`,
      });
      dispatch(
        setAdmin({
          _id: response.data.user._id,
          email: response.data.user.email,
          role: response.data.user.role,
          status: response.data.user.status,
          accessToken: response.data.accessToken,
          name: response.data.name,
        })
      );
      navigate(`/admin/${adminRoutes.HOME}`);
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        description: response.error,
      });
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full md:w-1/2", className)}
      {...props}
    >
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="p-6 md:p-8 mt-10"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Sign In to your Enigma admin panel
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="email" className="mr-2">
                    Email
                  </Label>
                  {error.field === "email" ? (
                    <LuCircleAlert color="red" size={18} />
                  ) : (
                    <></>
                  )}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    {error.field === "password" ? (
                      <LuCircleAlert color="red" size={18} />
                    ) : (
                      <></>
                    )}
                  </div>
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
              </div>
              <a
                onClick={(e) => {
                  e.preventDefault()
                  navigate(`/admin${adminRoutes.FORGOT_PASSWORD}`)
                }}
                href="#"
                className="ml-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a>
              <p className="text-red-500 text-center">{error.message}</p>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={handleSubmission}
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-t-black border-gray-300 rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={banner}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninForm;
