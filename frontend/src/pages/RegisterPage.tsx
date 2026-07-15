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
}