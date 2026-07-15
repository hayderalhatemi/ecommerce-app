import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../sotre/hooks";
import { setUser } from "../sotre/slices/authSlice";
import api from "../api/axios";

interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterForm) => {
        try {
            const res = await api.post("/auth/register", data);
            dispatch(setUser(res.data));
            navigate("/");
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as { response: { data: { message: string } } };
                alert(axiosErr.response.data.message);
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" {...register("name", { required: "Name is required" })} />
                    {errors.name && <span className="error">{errors.name.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" {...register("email", {required: "Email is required" })} />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
                    {errors.password && <span className="error">{errors.password.message}</span>}
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>
            <p>Already Have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default RegisterPage;