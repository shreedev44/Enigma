import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import banner from "../../assets/signinbanner.jpg";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { LuCircleAlert } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { validateForm } from "@/validation/formValidation";
import { loginValidationSchema } from "@/validation/formSchema";
import { signin } from "@/api/common";
import { useToast } from "@/hooks/use-toast";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useDispatch } from "react-redux";
import { setRecruiter } from "@/redux/recruiterSlice";
import { googleAuth } from "@/api/recruiter";
import { useGoogleLogin } from "@react-oauth/google";
import { decodeToken } from "@/utils/googleTokenDecode";

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

    const response = await signin(email, password, "recruiter");

    if (response.success) {
      setLoading(false);
      toast({
        description: `Signed in successfully`,
      });
      dispatch(
        setRecruiter({
          _id: response.data.user._id,
          email: response.data.user.email,
          role: response.data.user.role,
          status: response.data.user.status,
          accessToken: response.data.accessToken,
          profilePicture: response.data.profile.profilePicture,
        })
      );
      navigate(`/recruiter/${recruiterRoutes.HOME}`);
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        description: response.error,
      });
    }
  };

  const googleSignin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const decoded = await decodeToken(tokenResponse.access_token);
      const response = await googleAuth({
        email: decoded.email,
        companyName: decoded.name,
        profilePicture: decoded.picture,
        role: "recruiter"
      });

      if (response.success) {
        toast({
          description: response.data.message,
        });
        dispatch(
          setRecruiter({
            _id: response.data.user._id,
            email: response.data.user.email,
            role: response.data.user.role,
            status: response.data.user.status,
            accessToken: response.data.accessToken,
            profilePicture: response.data.profile.profilePicture,
          })
        );
        setLoading(false);
        navigate(`/recruiter/${recruiterRoutes.HOME}`);
      } else {
        toast({
          variant: "destructive",
          description: response.error,
        });
        setLoading(false);
      }
    },
    onError: () => {
      toast({
        description: `Google Authentication Failed`,
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  return (
    <div
      className={cn("flex flex-col gap-6 w-full md:w-1/2", className)}
      {...props}
    >
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Sign In to your Enigma recruiter account
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
                {error.field === "email" ? (
                  <p className="text-red-500 text-xs">{error.message}</p>
                ) : (
                  <></>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="mr-2">
                    Password
                  </Label>
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
                    required
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
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/recruiter${recruiterRoutes.FORGOT_PASSWORD}`);
                }}
                href="#"
                className="ml-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a>
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
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    googleSignin();
                  }}
                >
                  <FaGoogle />
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={() =>
                    navigate(`/recruiter${recruiterRoutes.SIGNUP}`)
                  }
                >
                  Sign Up
                </a>
              </div>
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
