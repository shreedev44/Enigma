import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { studentRoutes } from "@/constants/routeUrl";
import { useToast } from "@/hooks/use-toast";
import { resendOtp, verifyOtp } from "@/api/common";
import { Button } from "@/components/ui/button";
import ClassicSpinner from "@/components/loaders/ClassicSpinner";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, _setEmail] = useState(localStorage.getItem("email") as string);
  const [timer, setTimer] = useState(
    Number(localStorage.getItem("timer")) || 30
  );
  const [isResendDisabled, setResendDisabled] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const isFromSignup = location.state?.fromSignup;

    if (!isFromSignup) {
      navigate(studentRoutes.SIGNUP);
      return;
    }
  }, []);

  if (!email) {
    navigate(studentRoutes.SIGNUP);
    toast({
      variant: "destructive",
      description: "Your registration data were lost, Please signup again",
    });
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setResendDisabled(false);
            localStorage.setItem("timer", "0");
            return 0;
          }
          localStorage.setItem("timer", String(prev - 1));
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      localStorage.removeItem("timer");
    };
  }, [isResendDisabled]);

  const handleOtpChange = (newOtp: string) => {
    if (loading) return;
    const numericOtp = newOtp.replace(/\D/g, "");
    setOtp(numericOtp);
  };

  const handleSubmission = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate(studentRoutes.SIGNUP);
      toast({
        variant: "destructive",
        description: "Your registration data were lost, Please signup again",
      });
      return;
    }

    setLoading(true);

    const response = await verifyOtp(otp, email, "student");

    if (response.success) {
      localStorage.removeItem("email");
      localStorage.removeItem("timer");
      setLoading(false);
      navigate(studentRoutes.SIGNIN);
      toast({
        description: response.data.message,
      });
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        description: response.error,
      });
    }
  };

  const handleResendOtp = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      navigate(studentRoutes.SIGNUP);
      toast({
        variant: "destructive",
        description: "Your registration data were lost, Please signup again",
      });
      return;
    }

    setLoading(true);

    const response = await resendOtp(email, "student");

    if (response.success) {
      setLoading(false);
      setResendDisabled(true);
      toast({
        description: response.data.message,
      });
      setTimer(30);
      localStorage.setItem("timer", "30");
    } else {
      setLoading(false);
      localStorage.removeItem("timer");
      localStorage.removeItem("email");
      toast({
        description: response.error,
      });
    }
  };

  return (
    <div className="pt-24 md:pt-40 flex justify-center">
      <div>
        <h1 className="mb-20 text-3xl">
          Your OTP has been sent to <strong>{email}</strong>
        </h1>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(otp) => handleOtpChange(otp)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-center mt-10">
          <Button onClick={handleSubmission} disabled={loading}>
            {loading ? (
              <ClassicSpinner />
            ) : (
              "Verify OTP"
            )}
          </Button>
        </div>
        <p className="mt-6 text-sm text-center">
          Didn't Receive OTP?{" "}
          <span
            className={
              isResendDisabled || loading
                ? "text-gray-500"
                : "text-white-500 underline cursor-pointer"
            }
            onClick={handleResendOtp}
          >
            {" "}
            Resend OTP
          </span>{" "}
          {isResendDisabled ? "in " + timer : ""}
        </p>
      </div>
    </div>
  );
};

export default Otp;
