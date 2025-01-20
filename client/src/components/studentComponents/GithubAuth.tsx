import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { studentRoutes } from "@/constants/routeUrl";
import { githubAuth } from "@/api/student";
import { useDispatch } from "react-redux";
import { setStudent } from "@/redux/studentSlice";

const GitHubCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const githubLogin = async (code: string) => {
        const response = await githubAuth(code);
        if (response.success) {
          toast({
            description: `Signed in successfully`,
          });
          dispatch(
            setStudent({
              _id: response.data.user._id,
              email: response.data.user.email,
              role: response.data.user.role,
              status: response.data.user.status,
              accessToken: response.data.accessToken,
              profilePicture: response.data.profile.profilePicture,
            })
          );
          navigate(studentRoutes.HOME);
        } else {
          navigate(studentRoutes.SIGNIN);
          toast({
            description: response.error,
            variant: "destructive",
          });
        }
      };

      githubLogin(code);
    } else {
      navigate(studentRoutes.SIGNIN);
      toast({
        description: "Github Authentication failed",
        variant: "destructive",
      });
    }
  }, []);

  return (
    <div className="mt-40 flex justify-center">
      <FaGithub size={50} className="animate-bounce hover:animate-ping" />
    </div>
  );
};

export default GitHubCallback;
