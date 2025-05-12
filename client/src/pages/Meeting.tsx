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
	const role = getQueryParam("role") || "attendee"; // Default role is attendee
	const isHost = role === "host";

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
		const userID = randomID(5);
		const userName = isHost ? `Host-${userID}` : `User-${userID}`;

		// Generate token with role information
		const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
			appID,
			serverSecret,
			roomID,
			userID,
			userName
		);

		// Create and initialize ZegoUIKitPrebuilt
		const zc = ZegoUIKitPrebuilt.create(kitToken);

		// Options for the video call
		const startOption = {
			container: document.getElementById("zego-container"),

			// Basic room settings
			sharedLinks: [
				{
					name: "Personal link",
					url:
						window.location.protocol +
						"//" +
						window.location.host +
						window.location.pathname +
						"?roomID=" +
						roomID +
						(isHost ? "&role=host" : ""),
				},
			],

			// Configuration for video conference mode
			scenario: {
				mode: ZegoUIKitPrebuilt.VideoConference,
				config: {
					role: isHost
						? ZegoUIKitPrebuilt.Host
						: ZegoUIKitPrebuilt.Audience,
				},
			},

			// **** KEY WAITING ROOM SETTINGS ****

			// Enable permission control
			joinRoomWithJoinRequirePermission: !isHost, // Regular users need permission

			// Only host can approve join requests
			onlySupportProcessUserJoinApplyByHost: true,

			// Disable auto approval of join requests
			disableAutoApproveJoinApplication: true,

			// **** END OF KEY WAITING ROOM SETTINGS ****

			// Basic UI settings
			showUserList: true,
			showRoomDetailsButton: true,

			// Host-specific controls
			showRemoveUserButton: isHost,
			showTurnOffRemoteCameraButton: isHost,
			showTurnOffRemoteMicrophoneButton: isHost,
		};

		// Join the room with our configuration
		zc.joinRoom(startOption);

		// Clean up on unmount
		return () => {
			zc.destroy();
		};
	}, [roomID, navigate, role, isHost]);

	return (
		<>
			<div
				id="zego-container"
				className="mt-24 absolute w-full h-[87vh]"
			></div>

			{isHost && (
				<div className="absolute top-28 left-4 z-50 bg-blue-600 text-white p-2 rounded-md text-sm">
					You are the host. Check the users list to approve join
					requests.
				</div>
			)}
		</>
	);
};

export default Meeting;
