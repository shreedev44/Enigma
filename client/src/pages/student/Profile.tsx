import Breadcrumbs from "@/components/Breadcrumbs";
import { studentRoutes } from "@/constants/routeUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoIosNavigate } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useGetProfilePic } from "@/hooks/useGetStudent";
import defaultPic from "../../assets/default-avatar.jpg";
import { getProfile } from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import EditProfileModal from "@/components/studentComponents/EditProfileModal";

const Profile = () => {
  const { toast } = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [githubProfile, setGithubProfile] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [profilePic, setProfilePic] = useState(
    useGetProfilePic() || defaultPic
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();

      if (response.success) {
        const { profile } = response.data;
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setGithubProfile(profile.githubProfile);
        setLinkedinProfile(profile.linkedinProfile);
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
    setTimeout(() => {
      setProfileLoading(false);
    }, 5000);
  }, []);

  return (
    <div className="pt-24">
      <Breadcrumbs
        components={[
          { component: "Home", path: studentRoutes.HOME },
          { component: "Profile" },
        ]}
      />
      <div className="grid grid-flow-row md:grid-flow-col grid-rows-5 gap-4 mt-10 px-5 md:px-20">
        <div className="row-span-3 bg-zinc-300 dark:bg-zinc-800 rounded-xl">
          <div className="flex justify-start ml-5">
            <Avatar className="w-12 md:w-20 h-12 md:h-20 my-5">
              <AvatarImage src={profilePic} alt="image" />
              <AvatarFallback>
                <Skeleton className="w-12 md:w-20 h-12 md:h-20 my-5 rounded-full" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center ml-5">
              {profileLoading ? (
                <>
                  <Skeleton className="h-4 w-[150px] mb-2" />
                  <Skeleton className="h-4 w-[100px]" />
                </>
              ) : (
                <p className="font-bold text-2xl font-mono">
                  {firstName} {lastName}
                  <p className="text-sm">Leaderboard Rank: 4</p>
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-start mt-6 pl-7 md:pl-10">
            <div className="flex flex-col justify-center">
              <div className="flex flex-col justify-center">
                <p className="text-xl font-bold font-mono">Github</p>
                {profileLoading ? (
                  <Skeleton className="h-4 w-[200px]" />
                ) : (
                  <div className="flex justify-center items-center">
                    <p className="ml-2 text-xs mr-3">
                      {githubProfile.slice(0, 30) + '...' || "Not added"}{" "}
                    </p>
                    {githubProfile ? (
                      <a
                        href={githubProfile}
                        target="_blank"
                        className="cursor-pointer"
                      >
                        <IoIosNavigate size={20} />
                      </a>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center mt-5">
                <p className="text-xl font-bold font-mono">LinkedIn</p>
                {profileLoading ? (
                  <Skeleton className="h-4 w-[200px]" />
                ) : (
                  <div className="flex justify-center items-center">
                    <p className="ml-2 text-xs mr-3">
                      {linkedinProfile.slice(0, 30) + '...' || "Not added"}{" "}
                    </p>
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
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center my-10">
            <Dialog>
              <DialogTrigger>
                <Button
                  size={"lg"}
                  className="bg-fleace font-bold"
                  disabled={profileLoading}
                  onClick={() => setModalOpen(!isModalOpen)}
                >
                  Edit Profile
                </Button>
              </DialogTrigger>
              <EditProfileModal
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                profilePicture={useGetProfilePic() || ''}
                setProfilePicture={setProfilePic}
                githubProfile={githubProfile}
                setGithubProfile={setGithubProfile}
                linkedinProfile={linkedinProfile}
                setLinkedinProfile={setLinkedinProfile}
                isModalOpen={isModalOpen}
              />
            </Dialog>
          </div>
          <hr className="border-t-2 border-fleace mb-5" />
          <div className="flex justify-center">
            <p className="ml-5 text-2xl font-bold font-mono">Community Stats</p>
          </div>
          <div className="flex justify-start my-6 pl-7 md:pl-10">
            <div className="flex flex-col justify-center font-mono">
              <div className="flex flex-col justify-center">
                <p className="">Questions Asked: 12</p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="">Questions Answered: 24</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-3 md:col-span-4 bg-zinc-300 dark:bg-zinc-800 rounded-xl">
          Problem Stats
        </div>
      </div>
    </div>
  );
};

export default Profile;
