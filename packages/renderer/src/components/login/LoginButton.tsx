import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { SignIn } from "/@/authentication";


export default function LoginButton() {
  const navigate = useNavigate()

  const handleLogin = () => {
    try {
      SignIn('arion@arion.com', 'arionjaya123').then(() => {
        navigate('/');
      }).catch((err) => {
        console.error(JSON.stringify(err))
      })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Button onClick={handleLogin}>
      Login
    </Button>
  )
}