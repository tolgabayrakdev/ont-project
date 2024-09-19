import { useEffect } from "react"
import { Link } from "react-router-dom"

type Props = {}

export default function Home({}: Props) {
  useEffect(() => {
    console.log(import.meta.env.VITE_BACKEND_URL);
    
  },[])
  return (
    <div>
      <h1>Home</h1>
      <Link to="sign-in">Giriş Yap</Link>
    </div>
    
  )
}