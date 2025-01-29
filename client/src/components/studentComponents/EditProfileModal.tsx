import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { StdntEditProfilePropType } from "@/types/propsTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import defaultPic from "../../assets/default-avatar.jpg";
import CropperCanvas from "../Cropper";
import { DialogClose } from "@radix-ui/react-dialog";
import { validateForm } from "@/validation/formValidation";
import { studentProfileValidationSchema } from "@/validation/formSchema";
import { StudentProfileType } from "@/types/formTypes";
import { dataURLToFile } from "@/utils/urlToFile";
import Messages from "@/constants/Messages";
import { updateProfile } from "@/api/student";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setStudent } from "@/redux/studentSlice";

const EditProfileModal = (props: StdntEditProfilePropType) => {
  const { toast } = useToast();
  const dispatch = useDispatch()

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [isHover, setHover] = useState(false);
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [githubProfile, setGithubProfile] = useState(props.githubProfile);
  const [linkedinProfile, setLinkedinProfile] = useState(props.linkedinProfile);
  const [profilePicture, setProfilePicture] = useState(props.profilePicture);
  const [profileFile, setProfileFile] = useState("");
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleProfileClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = () => {
    const allowedFiles = ["jpeg", "png", "webp", "jpg"];
    const file = inputRef.current?.files?.[0];
    if (file && !allowedFiles.includes(file?.type?.split("/")[1])) {
      setError({
        field: "profilePicture",
        message: Messages.INVALID_FILE_TYPE,
      });
      return;
    }
    if (file && file?.size > 5 * 1024 * 1024) {
      setError({
        field: "profilePicture",
        message: Messages.FILE_SIZE_EXCEEDED,
      });
      return;
    } else {
      setError({ field: "", message: "" });
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfileFile(reader.result?.toString() as string);
      buttonRef.current?.click();
    };
    reader.onerror = () => {
      console.log("Failed to read file");
    };
    reader.readAsDataURL(file as Blob);
  };

  const hanldeSubmit = async () => {
    let changed = false;
    const form: Partial<StudentProfileType> = {};
    if (firstName !== props.firstName) {
      form.firstName = firstName;
      changed = true;
    }
    if (lastName !== props.lastName) {
      form.lastName = lastName;
      changed = true;
    }
    if (githubProfile !== props.githubProfile) {
      form.githubProfile = githubProfile;
      changed = true;
    }
    if (linkedinProfile !== props.linkedinProfile) {
      form.linkedinProfile = linkedinProfile;
      changed = true;
    }
    if (profilePicture !== props.profilePicture) {
      changed = true;
    }

    if (!changed) {
      closeRef.current?.click();
      setError({ field: "", message: "" });
      return;
    }
    const error = validateForm(
      studentProfileValidationSchema,
      form as Record<string, string>
    );

    if (error) {
      setError(error);
      return;
    }
    setError({ field: "", message: "" });

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    if (profilePicture !== props.profilePicture) {
      const newFile = dataURLToFile(profilePicture, Date.now() + "profile_pic");
      formData.append("profilePicture", newFile);
    }

    setLoading(true);
    const response = await updateProfile(formData);

    if (response.success) {
      const profile = response.data?.profile;
      props.setFirstName(profile.firstName);
      props.setLastName(profile.lastName);
      props.setGithubProfile(profile.githubProfile);
      props.setLinkedinProfile(profile.linkedinProfile);
      if(props.profilePicture !== profile.profilePicture) {
        dispatch(setStudent({profilePicture: profile.profilePicture}))
      }
      props.setProfilePicture(profile.profilePicture);
      closeRef.current?.click();
      setLoading(false)
    } else {
      toast({
        description: response.error,
        variant: "destructive",
      });
      closeRef.current?.click();
      setLoading(false)
    }
  };

  useEffect(() => {
    setFirstName(props.firstName);
    setLastName(props.lastName);
    setGithubProfile(props.githubProfile);
    setLinkedinProfile(props.linkedinProfile);
    setProfilePicture(props.profilePicture);
  }, [props]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex justify-center">
          <Avatar
            className="w-20 md:w-24 h-20 md:h-24 my-5 relative items-center justify-center"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleProfileClick}
          >
            <AvatarImage
              src={profilePicture === "" ? defaultPic : profilePicture}
              alt="image"
              className={isHover ? "opacity-50" : ""}
            />
            <AvatarFallback>
              <Skeleton className="w-12 md:w-22 h-12 md:h-22 my-5 rounded-full" />
            </AvatarFallback>
            {isHover ? <MdEdit className="absolute" size={35} /> : <></>}
          </Avatar>
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
          />
        </div>
        {error.field === "profilePicture" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="firstName" className="text-right">
            First Name
          </Label>
          <Input
            id="firstName"
            value={firstName}
            className="col-span-3"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        {error.field === "firstName" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lastName" className="text-right">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={lastName}
            className="col-span-3"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        {error.field === "lastName" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="github" className="text-right">
            Github
          </Label>
          <Input
            id="github"
            value={githubProfile}
            className="col-span-3"
            onChange={(e) => setGithubProfile(e.target.value)}
          />
        </div>
        {error.field === "githubProfile" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="linkedin" className="text-right">
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            value={linkedinProfile}
            className="col-span-3"
            onChange={(e) => setLinkedinProfile(e.target.value)}
          />
        </div>
        {error.field === "linkedinProfile" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
      </div>
      <Dialog>
        <DialogTrigger>
          <button className="hidden" ref={buttonRef}></button>
        </DialogTrigger>
        <CropperCanvas
          profileFile={profileFile}
          setProfilePic={setProfilePicture}
        />
      </Dialog>
      <DialogFooter>
        <Button type="submit" onClick={hanldeSubmit} disabled={loading}>
          {loading ? (
            <div className="w-6 h-6 border-4 border-t-black border-gray-300 rounded-full animate-spin"></div>
          ) : (
            "Save Changes"
          )}
        </Button>
        <DialogClose>
          <button ref={closeRef} className="hidden"></button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditProfileModal;
