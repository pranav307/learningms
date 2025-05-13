import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDeletelecMutation, useGetcourselecQuery } from "@/redux/lecturecrud";
import { Timer } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Updatelecform } from "./updatelecture";
import { useGetProfileQuery } from "@/redux/userauth";

export function GetlectureAdmin() {
  const { courseId } = useParams();
  const {data:userData} = useGetProfileQuery();
  const [editlec, seteditlec] = useState(false);
  console.log("courseId from URL:", courseId); // Debugging

  const { data, isLoading, error, refetch } = useGetcourselecQuery(courseId);
  const [deletelec] = useDeletelecMutation();
  const { toast } = useToast();
  const navigate = useNavigate();
const user = userData?.user || [];
  const lecture = data?.lectures || [];

  if (isLoading) {
    return <p>.....isLoading</p>;
  }

  return (
    <div className="bg-lime-100 p-4 min-h-screen">
      <div>
        {!editlec ? (
          <>
            <h1 className="font-extrabold text-2xl text-center">Lectures</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 lg:grid-cols-4 p-4">
              {Array.isArray(lecture) ? (
                lecture.map((lec) => (
                  <div
                    className="border-2 p-4 transition-transform transform hover:scale-105 rounded-3xl"
                    key={lec._id}
                  >
                    <img
                      src={lec.vedioUrl?.url}
                      alt={lec.title}
                      className="rounded-lg mb-2 transition-transform transform 
                        perspective-1000 rotate-y-0 hover:rotate-y-6 hover:scale-105 shadow-lg"
                    />
                    <h1 className="font-extrabold p-4">{lec.title}</h1>
                    <div className="flex justify-between">
                      <h1 className="font-bold flex gap-2">
                        <Timer />
                        {lec.duration}
                      </h1>
                      <h1 className="font-bold flex gap-2">
                        <h2>LecNO -</h2>
                        {lec.order}
                      </h1>
                    </div>
                    <h1 className="font-bold">{lec.course.courseTitle}</h1>
                    <h1 className="font-bold">{lec.course.category}</h1>
                    <Button onClick={()=> 
                      {
                        if(user.role === "admin"){
                      navigate(`/admin/getquize/${lec._id}`)
                        }
                      else if (user.role === "creators") {
                        navigate(`/creator/getquize/${lec._id}`)
                      }
                      }
                    }
                    className="bg-blue-100 hover:bg-blue-50 m-2"
                    >quize</Button>
                    <Button
                      className="font-bold border-2 bg-blue-300 hover:bg-cyan-500"
                      onClick={async () => {
                        const re = await deletelec(lec._id).unwrap();
                        toast({
                          title: "success",
                          description: re.message,
                        });
                        refetch();
                      }}
                    >
                      Delete
                    </Button>
                    <Button 
                    className="bg-blue-200 m-2 p-2 hover:bg-blue-300"
                    onClick={() => seteditlec(true)}>Edit</Button>
                  </div>
                ))
              ) : (
                <div>
                  <p>{error?.message}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <Updatelecform lecdata={lecture} />
        )}
      </div>

      <div className="text-center">
        <Button
          onClick={() =>{if(user.role ==="admin") {navigate("/admin")}
          else if(user.role === "creators"){
            navigate("/creator")
          }

          }
          }
          className="font-extrabold text-2xl border-2 m-4 w-xl bg-blue-300"
        >
          Go to pro
        </Button>
      </div>
    </div>
  );
}
