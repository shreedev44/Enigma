import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { RctrEditProfilePropType } from "@/types/propsTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import defaultPic from "../../assets/default-avatar.jpg";
import CropperCanvas from "../Cropper";
import { validateForm } from "@/validation/formValidation";
import { recruiterProfileValidationSchema } from "@/validation/formSchema";
import { RecruiterProfileType } from "@/types/formTypes";
import { dataURLToFile } from "@/utils/urlToFile";
import Messages from "@/constants/Messages";
import { updateProfile } from "@/api/recruiter";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setRecruiter } from "@/redux/recruiterSlice";
import { Textarea } from "@/components/ui/textarea";
import ClassicSpinner from "../loaders/ClassicSpinner";

const EditProfileModal = (props: RctrEditProfilePropType) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [isHover, setHover] = useState(false);
  const [companyName, setCompanyName] = useState(props.companyName);
  const [bio, setBio] = useState(props.bio);
  const [basedAt, setBasedAt] = useState(props.basedAt);
  const [facebookProfile, setFacebookProfile] = useState(props.facebookProfile);
  const [linkedinProfile, setLinkedinProfile] = useState(props.linkedinProfile);
  const [twitterProfile, setTwitterProfile] = useState(props.twitterProfile);
  const [profilePicture, setProfilePicture] = useState(props.profilePicture);
  const [profileFile, setProfileFile] = useState("");
  const [error, setError] = useState({ field: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompanyName(props.companyName);
    setBio(props.bio);
    setBasedAt(props.basedAt);
    setFacebookProfile(props.facebookProfile);
    setLinkedinProfile(props.linkedinProfile);
    setTwitterProfile(props.twitterProfile);
    setProfilePicture(props.profilePicture);
  }, [props]);

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
    const form: Partial<RecruiterProfileType> = {};
    if (companyName !== props.companyName) {
      form.companyName = companyName;
      changed = true;
    }
    if (bio !== props.bio) {
      form.bio = bio;
      changed = true;
    }
    if (basedAt !== props.basedAt) {
      form.basedAt = basedAt;
      changed = true;
    }
    if (linkedinProfile !== props.linkedinProfile) {
      form.linkedinProfile = linkedinProfile;
      changed = true;
    }
    if (facebookProfile !== props.facebookProfile) {
      form.facebookProfile = facebookProfile;
      changed = true;
    }
    if (twitterProfile !== props.twitterProfile) {
      form.twitterProfile = twitterProfile;
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
      recruiterProfileValidationSchema,
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

    setLoading(true)
    const response = await updateProfile(formData)

    if(response.success) {
        const profile = response.data?.profile
        props.setCompanyName(profile.companyName)
        props.setBio(profile.bio)
        props.setBasedAt(profile.basedAt)
        props.setLinkedinProfile(profile.linkedinProfile)
        props.setFacebookProfile(profile.facebookProfile)
        props.setTwitterProfile(profile.twitterProfile)
        if(props.profilePicture !== profile.profilePicture) {
            dispatch(setRecruiter({profilePicture: profile.profilePicture}))
        }
        props.setProfilePicture(profile.profilePicture)
        closeRef.current?.click()
        setLoading(false)
    } else {
        toast({
            description: response.error,
            variant: "destructive"
        })
        closeRef.current?.click()
        setLoading(false)
    }
  };
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
          <Label htmlFor="companyName" className="text-right">
            Company Name
          </Label>
          <Input
            id="companyName"
            value={companyName}
            className="col-span-3"
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        {error.field === "companyName" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lastName" className="text-right">
            Bio
          </Label>
          <Textarea
            id="lastName"
            value={bio}
            className="col-span-3 resize-none"
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        {error.field === "lastName" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="basedAt" className="text-right">
            Based At
          </Label>
          <Input
            id="basedAt"
            value={basedAt}
            className="col-span-3"
            onChange={(e) => setBasedAt(e.target.value)}
          />
        </div>
        {error.field === "basedAt" ? (
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="facebook" className="text-right">
            Facebook
          </Label>
          <Input
            id="facebook"
            value={facebookProfile}
            className="col-span-3"
            onChange={(e) => setFacebookProfile(e.target.value)}
          />
        </div>
        {error.field === "facebookProfile" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="twitter" className="text-right">
            X (twitter)
          </Label>
          <Input
            id="twitter"
            value={twitterProfile}
            className="col-span-3"
            onChange={(e) => setTwitterProfile(e.target.value)}
          />
        </div>
        {error.field === "twitterProfile" ? (
          <p className="text-red-500 text-xs text-center">{error.message}</p>
        ) : (
          <></>
        )}
      </div>
      <p
        className="text-center text-xs underline underline-offset-2 cursor-pointer text-bluegrey"
        onClick={() => props.changePassword()}
      >
        Change Password
      </p>
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
            <ClassicSpinner />
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
