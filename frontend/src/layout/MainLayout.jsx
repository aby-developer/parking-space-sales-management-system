import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-100">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main
                className="
                    lg:ml-64
                    min-h-screen
                    p-4
                    sm:p-6
                    transition-all duration-300
                "
            >
                <Outlet />
            </main>

        </div>
    );
}