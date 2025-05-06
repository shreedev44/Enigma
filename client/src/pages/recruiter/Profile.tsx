import Breadcrumbs from "@/components/Breadcrumbs";
import { recruiterRoutes } from "@/constants/routeUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoIosNavigate } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useGetProfilePic, useGetRecruiterData } from "@/hooks/useGetRecruiter";
import defaultPic from "../../assets/default-avatar.jpg";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProfile } from "@/api/recruiter";
import EditProfileModal from "@/components/recruiterComponents/EditProfileModal";
import { forgotPassword } from "@/api/common";

const Profile = () => {
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();

      if (response.success) {
        const { profile } = response.data;
        setCompanyName(profile.companyName);
        setBio(profile.bio);
        setBasedAt(profile.basedAt);
        setLinkedinProfile(profile.linkedinProfile);
        setFacebookProfile(profile.facebookProfile);
        setTwitterProfile(profile.twitterProfile);
        setProfilePic(profile.profilePicture || defaultPic);
        setProfileLoading(false);
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { toast } = useToast();
  const recruiterData = useGetRecruiterData();

  const [isModalOpen, setModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [bio, setBio] = useState("");
  const [basedAt, setBasedAt] = useState("");
  const [facebookProfile, setFacebookProfile] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [twitterProfile, setTwitterProfile] = useState("");
  const [profilePic, setProfilePic] = useState(
    useGetProfilePic() || defaultPic
  );

  const changePassword = async () => {
      const response = await forgotPassword(recruiterData.email, "recruiter");
  
      if(response.success) {
        toast({
          description: "Your password reset link was sent to your email"
        })
      } else {
        toast({
          description: response.error,
          variant: 'destructive'
        })
      }
    }

  return (
    <div className="pt-24">
      <Breadcrumbs
        components={[
          { component: "Home", path: `/recruiter${recruiterRoutes.HOME}` },
          { component: "Profile" },
        ]}
      />
      <div className="my-10 flex mx-7 md:mx-44 rounded-xl bg-zinc-300 dark:bg-zinc-800 px-5 md:px-20 py-3 md:py-6">
        <div className="flex flex-col justify-center">
          <div className="flex justify-start items-center">
            <Avatar className="w-12 md:w-20 h-12 md:h-20 my-5">
              <AvatarImage src={profilePic} alt="image" />
              <AvatarFallback>
                <Skeleton className="w-12 md:w-20 h-12 md:h-20 my-5 rounded-full" />
              </AvatarFallback>
            </Avatar>
            {profileLoading ? (
                <Skeleton className="h-8 w-[150px] md:h-12 md:w-[300px] ml-5 rounded-full" />
            ) : (
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        
                    <p className="text-lg md:text-3xl font-bold font-mono ml-5">
                        {companyName.length <= 30
                        ? companyName
                        : companyName.slice(0, 30) + "..."}
                    </p>
                    </TooltipTrigger>
                    <TooltipContent className="light:bg-black">
                    {companyName}
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            )}
          </div>
          <div className="flex flex-col justify-center mt-5">
            <p className="text-md md:text-2xl font-bold font-mono">Bio</p>
            {profileLoading ? (
                <Skeleton className="h-5 w-[150px] md:h-7 md:w-[200px] ml-5 rounded-full" />
            ) : (
                <p className="font-mono text-xs md:text-lg ml-3">
                {bio ? bio : "Not added"}
                </p>
            )}
          </div>
          <div className="flex flex-col justify-center mt-5">
            <p className="text-md md:text-2xl font-bold font-mono">Based At</p>
            {profileLoading ? (
                <Skeleton className="h-5 w-[150px] md:h-7 md:w-[200px] ml-5 rounded-full" />
            ) : (
                <p className="font-mono text-xs md:text-lg ml-3">
                {basedAt
                    ? basedAt.length <= 30
                    ? basedAt
                    : basedAt.slice(0, 30) + "..."
                    : "Not added"}
                </p>
            )}
          </div>
          <div className="flex flex-col justify-center mt-5">
            <p className="text-md md:text-2xl font-bold font-mono">LinkedIn</p>
            <div className="flex">
                {profileLoading ? (
                    <Skeleton className="h-4 w-[120px] md:h-6 md:w-[150px] ml-5 rounded-full" />
                ) : (
                    <p className="font-mono text-xs md:text-sm mx-3">
                        {linkedinProfile
                        ? linkedinProfile.slice(0, 30) + "..."
                        : "Not added"}{" "}
                    </p>
                )}
              {linkedinProfile ? (
                <a
                  href={linkedinProfile}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <IoIosNavigate size={20} />
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center mt-5">
            <p className="text-md md:text-2xl font-bold font-mono">Facebook</p>
            <div className="flex">
                {profileLoading ? (
                    <Skeleton className="h-4 w-[120px] md:h-6 md:w-[150px] ml-5 rounded-full" />
                ) : (
                    <p className="font-mono text-xs md:text-sm mx-3">
                        {facebookProfile
                        ? facebookProfile.slice(0, 30) + "..."
                        : "Not added"}{" "}
                    </p>
                )}
              {facebookProfile ? (
                <a
                  href={facebookProfile}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <IoIosNavigate size={20} />
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center mt-5">
            <p className="text-md md:text-2xl font-bold font-mono">
              X (Twitter)
            </p>
            <div className="flex">
                {profileLoading ? (
                    <Skeleton className="h-4 w-[120px] md:h-6 md:w-[150px] ml-5 rounded-full" />
                ) : (
                    <p className="font-mono text-xs md:text-sm mx-3">
                        {twitterProfile
                        ? twitterProfile.slice(0, 30) + "..."
                        : "Not added"}{" "}
                    </p>
                )}
              {twitterProfile ? (
                <a
                  href={twitterProfile}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <IoIosNavigate size={20} />
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex justify-start">
            <Dialog>
                <DialogTrigger>
                    <Button
                        size={"lg"}
                        className="bg-fleace font-bold my-10"
                        disabled={profileLoading}
                        onClick={() => setModalOpen(!isModalOpen)}
                    >
                        Edit Profile
                    </Button>
                </DialogTrigger>
                <EditProfileModal 
                companyName={companyName}
                setCompanyName={setCompanyName}
                bio={bio}
                setBio={setBio}
                basedAt={basedAt}
                setBasedAt={setBasedAt}
                linkedinProfile={linkedinProfile}
                setLinkedinProfile={setLinkedinProfile}
                facebookProfile={facebookProfile}
                setFacebookProfile={setFacebookProfile}
                twitterProfile={twitterProfile}
                setTwitterProfile={setTwitterProfile}
                profilePicture={profilePic}
                setProfilePicture={setProfilePic}
                isModalOpen={isModalOpen}
                changePassword={changePassword}
                />
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
