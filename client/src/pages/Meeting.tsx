import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Meeting = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getQueryParam = (param: string) => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get(param);
    };

    const roomID = getQueryParam("roomID");

    function randomID(len: number) {
        let result = "";
        const chars =
            "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
        const maxPos = chars.length;
        for (let i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return result;
    }

    useEffect(() => {
        if (!roomID) {
            navigate(-1); 
            return;
        }

        const appID = Number(import.meta.env.VITE_ZEGOCLOUG_API_KEY);
        const serverSecret = import.meta.env.VITE_ZEGOCLOUG_API_SECRET;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            randomID(5),
            randomID(5)
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: document.getElementById("zego-container"),
            sharedLinks: [
                {
                    name: "Personal link",
                    url:
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        window.location.pathname +
                        "?roomID=" +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });

        return () => {
            if (zp) {
                zp.destroy();
            }
        };
    }, [roomID, navigate]);

    return (
        <div
            id="zego-container"
            className="mt-24 absolute w-full h-[87vh]"
        ></div>
    );
};

export default Meeting;
