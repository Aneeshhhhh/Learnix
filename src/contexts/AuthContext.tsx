import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";
// Firebase has been temporarily disabled. This context provides a local mock
// implementation of auth so the app can proceed beyond signup without Firestore.

interface AuthContextType {
	currentUser: User | null;
	userData: any | null; // Stores the profile data (role, interests, etc.)
	loading: boolean;
	login: (email: string, pass: string) => Promise<void>;
	signup: (email: string, pass: string, userData: any) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	// Helpers for mock auth
	const makeUid = (email: string) => {
		try {
			return btoa(email).replace(/=+$/, "");
		} catch {
			// Fallback pseudo UID
			return `uid_${Math.random().toString(36).slice(2, 10)}`;
		}
	};

	const saveSession = (email: string, profile: any) => {
		const uid = makeUid(email);
		const session = { uid, email };
		try {
			localStorage.setItem("mockAuth:session", JSON.stringify(session));
			localStorage.setItem("mockAuth:userData", JSON.stringify({ email, ...profile }));
		} catch {}
		// Cast to firebase User for compatibility in the app
		const mockUser = { uid, email } as unknown as User;
		setCurrentUser(mockUser);
		setUserData({ email, ...profile });
	};

	// Mock login: accept provided credentials, restore any stored profile
	const login = async (email: string, _pass: string) => {
		const stored = localStorage.getItem("mockAuth:userData");
		let profile: any = { email };
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (parsed && parsed.email === email) profile = parsed;
			} catch {}
		}
		saveSession(email, profile);
	};

	// Mock signup: store profile in localStorage and mark as logged in
	const signup = async (email: string, _pass: string, additionalData: any) => {
		saveSession(email, additionalData);
	};

	const logout = async () => {
		try {
			localStorage.removeItem("mockAuth:session");
		} catch {}
		setCurrentUser(null);
		setUserData(null);
	};

	useEffect(() => {
		// Restore mock session if present
		try {
			const storedSession = localStorage.getItem("mockAuth:session");
			const storedUserData = localStorage.getItem("mockAuth:userData");
			if (storedSession) {
				const sess = JSON.parse(storedSession);
				const mockUser = { uid: sess.uid, email: sess.email } as unknown as User;
				setCurrentUser(mockUser);
			}
			if (storedUserData) {
				setUserData(JSON.parse(storedUserData));
			}
		} catch {}
		setLoading(false);
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, userData, loading, login, signup, logout }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};