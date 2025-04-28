import { commonEndpoints } from "@/constants/endpointUrl";
import axios from "axios";
import { store } from "@/redux/storage";
import { removeStudent, setStudent } from "@/redux/studentSlice";
import { removeRecruiter, setRecruiter } from "@/redux/recruiterSlice";
import { removeAdmin, setAdmin } from "@/redux/adminSlice";
import {
	adminRoutes,
	recruiterRoutes,
	studentRoutes,
} from "@/constants/routeUrl";

const refreshToken = async (userLevel: "student" | "recruiter" | "admin") => {
	const response = await axios.post(
		commonEndpoints.REFRESH_TOKEN,
		{},
		{
			withCredentials: true,
		}
	);

	const accessToken = response.data?.accessToken;

	if (userLevel === "student") {
		store.dispatch(setStudent({ accessToken }));
	} else if (userLevel === "recruiter") {
		store.dispatch(setRecruiter({ accessToken }));
	} else {
		store.dispatch(setAdmin({ accessToken }));
	}

	return accessToken;
};

const getTokenByUserLevel = (
	userLevel: "student" | "recruiter" | "admin"
): string | null => {
	if (userLevel === "student") {
		return store.getState().student.accessToken;
	} else if (userLevel === "recruiter") {
		return store.getState().recruiter.accessToken;
	} else if (userLevel === "admin") {
		return store.getState().admin.accessToken;
	} else {
		return null;
	}
};

const Api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

Api.interceptors.request.use(
	(config) => {
		const userLevel = config.headers["x-user-level"] || "student";
		const token = getTokenByUserLevel(userLevel);

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

Api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response &&
			error.response.status === 403 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				const accessToken = await refreshToken(
					originalRequest.headers["x-user-level"] || "student"
				);

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;

				return Api(originalRequest);
			} catch (err) {
				console.log(err);
				const userLevel =
					originalRequest.headers["x-user-level"] || "student";
				if (userLevel === "student") {
					store.dispatch(removeStudent());
				} else if (userLevel === "recruiter") {
					store.dispatch(removeRecruiter());
				} else {
					store.dispatch(removeAdmin());
				}
				return Promise.reject(err);
			}
		} else if (
			error.response &&
			error.response.status === 401 &&
			(error.response.data.error === "Your are blocked from Enigma" ||
				error.response.data.error ===
					"Access denied, No token provided")
		) {
			const userLevel =
				originalRequest.headers["x-user-level"] || "student";
			if (userLevel === "student") {
				store.dispatch(removeStudent());
				window.location.href = studentRoutes.SIGNIN;
			} else if (userLevel === "recruiter") {
				store.dispatch(removeRecruiter());
				window.location.href = `/recruiter${recruiterRoutes.SIGNIN}`;
			} else {
				store.dispatch(removeAdmin());
				window.location.href = `/admin${adminRoutes.SIGNIN}`;
			}
			throw error;
		} else {
			throw error;
		}
	}
);

export default Api;
