import { useToast } from "@/hooks/use-toast";
import { useCompletelecMutation, useGetlecwithlocQuery } from "@/redux/lectureque";
import { useGetProfileQuery } from "@/redux/userauth";
import { Button } from "@headlessui/react";
import { Lock, LockOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";




export function LectureList(){
    const {id:courseid} = useParams()
    const {data,error,isLoading,refetch} = useGetlecwithlocQuery(courseid);
    const [completelec,{isLoading:iscompleting}] = useCompletelecMutation()
    const {toast} = useToast()
    const navigate = useNavigate();
    const {data:userdata,} = useGetProfileQuery();
    const user = userdata?.user || [];
    const handlecomplete = async (lectureid)=>{
        try {
            await completelec({courseid,lectureid}).unwrap()
            refetch()
        } catch (error) {
            toast({
                title:"error in comletion"
            })
        }
    }
    if (isLoading) return <p className="text-center text-lg">Loading lectures...</p>;
  if (error) return <p className="text-center text-red-500">Error loading lectures</p>;
    return (
        <div>
            <h2> Lecture</h2>
        <div>
          
      {data?.lectures?.map((lecture)=>(
       <div key={lecture._id}
       className={`p-4 border rounded-lg shadow-md transition-all duration-300 ${
        lecture.islocked ? 'bg-gray-100 text-gray-500' : 'bg-white'
      }`}
       >
{/* Thumbnail */}
                <div className="relative">

                  {lecture.vedioUrl?.url && lecture.vedioUrl?.url.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/)
                  
                  ?(<video src={lecture.vedioUrl?.url} autoPlay controls className="sm:w-full h-64 object-cover" ></video>):

                  ( <img
                    src={lecture.vedioUrl?.url}
                    alt={lecture.title}
                    className="rounded-lg mb-2  h-48 sm:w-2xl object-cover transition-transform transform 
                     perspective-1000 rotate-y-0 hover:rotate-y-6 hover:scale-105 shadow-lg"
                  />)
                  }
                  
                  {/* Lock Icon Overlay */}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                    {lecture.islocked ? (
                      <Lock className="text-red-500" />
                    ) : (
                      <LockOpen className="text-green-600" />
                    )}
                  </div>
                  </div>
                
        <h2>{lecture.title}</h2>
        <p>
            Status:{lecture.iscomplete? "complete" : lecture.islocked ? "locked" :"not completed"}
        </p>
        <div className="flex justify-evenly">
          <Button
          className="font-bold bg-blue-300 p-2 m-2 rounded-2xl sm:w-xl "
          onClick={()=>{
            if(user.role === "creators"){
              navigate(`/creator/getquize/${lecture._id}`)
            }
           else if(user.role === "student"){
              navigate(`/student/getquize/${lecture._id}`)
            }
          }}>Quize</Button>
        {!lecture.iscomplete && !lecture.islocked && (
            <Button onClick={()=>handlecomplete(lecture._id)}
                disabled={iscompleting}
              className="bg-blue-600 hover:bg-amber-500 text-white p-4 m-2  rounded-2xl"
            > 
            
            {iscompleting ?"marking" :"mark as complete ...."}
            </Button>
        )}
        </div>
        </div>
      ))}

            </div>
        </div>
        
    )
}