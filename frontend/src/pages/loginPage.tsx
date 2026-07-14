import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";
import api from "../api/axios";

interface LoginForm {
    email: string;
    password: string;
}

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
    const dispatch = useAppDistpatch();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        try {
            const res = await api.post("/auth/login", data);
            dispatch(setUser(res.data));
            navigate("/");
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as { response:  { data: { message: string}}};
            }
        }
    };
}