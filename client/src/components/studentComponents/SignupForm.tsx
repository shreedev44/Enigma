import { useState, useReducer } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import banner from "../../assets/signinbanner.jpg";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { nameRegex, emailRegex, passwordRegex } from "@/validation/regex";
import { StudentSignupFormAction, StudentSignupFormType } from "@/types/formTypes";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);
  const [isPasswordStrengthVisible, setPasswordStrengthVisibility] =
    useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate()

  const initialFormData: StudentSignupFormType = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const reducer = (state: StudentSignupFormType, action: StudentSignupFormAction) => {
    switch (action.type) {
      case "SET_FIRST_NAME":
        return { ...state, firstName: action.payload };
      case "SET_LAST_NAME":
        return { ...state, lastName: action.payload };
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
                <h1 className="text-2xl font-bold">Welcome to Enigma</h1>
                <p className="text-balance text-muted-foreground">
                  Register your account in Enigma
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder="E.g: John"
                  value={formData.firstName}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIRST_NAME",
                      payload: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="E.g: Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    dispatch({ type: "SET_LAST_NAME", payload: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
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
                <div className="flex items-center">
                  <Label htmlFor="cpassword">Confirm Password</Label>
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
              </div>
              <Button type="submit" className="w-full">
                Get OTP
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <FaGithub />
                </Button>
                <Button variant="outline" className="w-full">
                  <FaGoogle />
                </Button>
              </div>
              <div className="text-center text-sm">
                Already an Enigma user?{" "}
                <a className="underline underline-offset-4 cursor-pointer" onClick={() => navigate('/signin')}>
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
