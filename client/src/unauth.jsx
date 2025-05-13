import { useNavigate } from "react-router-dom"
import { Button } from "./components/ui/button";



export function Unauth(){
    const navigate =useNavigate();
    return(
        <>
        <h1>Restricted apge</h1>
        <Button onClick={()=> navigate('/')}> Go back</Button>
        </>
    )
}