import { useState, useReducer } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import banner from "../../assets/signinbanner.jpg";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { LuCircleAlert } from "react-icons/lu";
import { Progress } from "@/components/ui/progress";
import { passwordRegex } from "@/validation/regex";
import {
  RecruiterSignupFormAction,
  RecruiterSignupFormType,
} from "@/types/formTypes";
import { useNavigate } from "react-router-dom";
import { recruiterSignupValidationSchema } from "@/validation/formSchema";
import { validateForm } from "@/validation/formValidation";
import { googleAuth, signup } from "@/api/recruiter";
import { useToast } from "@/hooks/use-toast";
import { recruiterRoutes } from "@/constants/routeUrl";
import { useGoogleLogin } from "@react-oauth/google";
import { decodeToken } from "@/utils/googleTokenDecode";
import { setRecruiter } from "@/redux/recruiterSlice";
import { useDispatch } from "react-redux";
import ClassicSpinner from "../loaders/ClassicSpinner";

const SignupForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);
  const [isPasswordStrengthVisible, setPasswordStrengthVisibility] =
    useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatchFun = useDispatch();
  const { toast } = useToast();

  const initialFormData: RecruiterSignupFormType = {
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const reducer = (
    state: RecruiterSignupFormType,
    action: RecruiterSignupFormAction
  ) => {
    switch (action.type) {
      case "SET_COMPANY_NAME":
        return { ...state, companyName: action.payload };
      case "SET_EMAIL":
        return { ...state, email: action.payload };
      case "SET_PASSWORD":
        if (action.payload === "") setPasswordStrengthVisibility(false);
        else {
          const hasMinLength = passwordRegex.length.test(action.payload);
          const hasLetter = passwordRegex.letter.test(action.payload);
          const hasDigit = passwordRegex.digit.test(action.payload);
          const hasSpecialChar = passwordRegex.specialChar.test(action.payload);
          let strength = 0;
          if (hasMinLength) strength += 25;
          if (hasLetter) strength += 25;
          if (hasDigit) strength += 25;
          if (hasSpecialChar) strength += 25;

          setPasswordStrength(strength);
          setPasswordStrengthVisibility(true);
        }
        return { ...state, password: action.payload };
      case "SET_CONFIRM_PASSWORD":
        return { ...state, confirmPassword: action.payload };
      default:
        return state;
    }
  };

  const [formData, dispatch] = useReducer(reducer, initialFormData);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleCPasswordVisibility = () => {
    setIsCPasswordVisible(!isCPasswordVisible);
  };

  const handleFormSubmission = async (event: React.FormEvent) => {
    event.preventDefault();

    const error = validateForm(
      recruiterSignupValidationSchema,
      formData as unknown as Record<string, string>
    );

    if (error) {
      setError(error);
      return;
    } else if (formData.password !== formData.confirmPassword) {
      setError({
        field: "confirmPassword",
        message: "Password does not match",
      });
      return;
    } else {
      setError({ field: "", message: "" });
    }

    setLoading(true);
    const response = await signup({...formData, role: "recruiter"});

    if (response.success) {
      localStorage.setItem("email", response.data.email);
      setLoading(false);
      navigate(`/recruiter${recruiterRoutes.VERIFY_OTP}`, {
        state: { fromSignup: true },
      });
      toast({
        description: "Verify your email with OTP",
      });
    } else {
      setLoading(false);
      toast({
        description: response.error,
        variant: "destructive",
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
        role: "recruiter",
      });

      if (response.success) {
        toast({
          description: `Signed in successfully`,
        });
        dispatchFun(
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
          <form onSubmit={(e) => e.preventDefault()} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome to Enigma</h1>
                <p className="text-balance text-muted-foreground">
                  Register your recruiter account in Enigma
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="companyname" className="mr-2">
                    Company Name
                  </Label>
                  {error.field === "companyName" ? (
                    <LuCircleAlert color="red" size={18} />
                  ) : (
                    <></>
                  )}
                </div>
                <Input
                  id="companyname"
                  type="text"
                  placeholder="E.g: Apple Inc"
                  value={formData.companyName}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_COMPANY_NAME",
                      payload: e.target.value,
                    })
                  }
                  required
                />
                {error.field === "companyName" ? (
                  <p className="text-red-500 text-xs">{error.message}</p>
                ) : (
                  <></>
                )}
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
                  placeholder="E.g: johndoe@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    dispatch({ type: "SET_EMAIL", payload: e.target.value })
                  }
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
                    placeholder="Include [a - z], [0 - 9], [! - @]"
                    className="pr-12"
                    value={formData.password}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PASSWORD",
                        payload: e.target.value,
                      })
                    }
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
                {isPasswordStrengthVisible ? (
                  <>
                    <Label htmlFor="passwordstrength">Password Strength</Label>
                    <Progress value={passwordStrength} id="passwordstrength" />
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="grid gap-2">
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
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_CONFIRM_PASSWORD",
                        payload: e.target.value,
                      })
                    }
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
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={handleFormSubmission}
              >
                {loading ? (
                  <ClassicSpinner />
                ) : (
                  "Get OTP"
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
                Already an Enigma user?{" "}
                <a
                  className="underline underline-offset-4 cursor-pointer"
                  onClick={() =>
                    navigate(`/recruiter${recruiterRoutes.SIGNIN}`)
                  }
                >
                  Sign In
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

export default SignupForm;
