import { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

const CropperCanvas = (props: {
  profileFile: string;
  setProfilePic: (value: string) => void;
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    props.setProfilePic(cropper?.getCroppedCanvas().toDataURL() as string);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Crop your image</DialogTitle>
      </DialogHeader>
      <Cropper
        src={props.profileFile}
        style={{ height: 400, width: "100%" }}
        aspectRatio={1}
        guides={false}
        crop={onCrop}
        ref={cropperRef}
        viewMode={1}
      />
      <DialogFooter>
      <DialogClose asChild>
        <Button type="submit">Crop Image</Button>
      </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default CropperCanvas;
