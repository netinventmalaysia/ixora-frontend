import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const handleLogin = (data: { email: string; password: string }) => {
    console.log("Logging in with", data);
    // 🔐 Add API call or auth logic here
  };

  return <LoginForm onSubmit={handleLogin} />;
}