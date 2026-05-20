import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await login(form);

            console.log("Login success:", res);

            // save token
            localStorage.setItem("token", res.token);

            alert("Login successful");

            // 🚀 NAVIGATE TO DASHBOARD
            navigate("/dashboard");

        } catch (error) {
            console.log("Login error:", error);
            alert(error.message || "Login failed");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />

                <button type="submit" style={{ width: "100%", padding: "10px" }}>
                    Login
                </button>
            </form>
        </div>
    );
}