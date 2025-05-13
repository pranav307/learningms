import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCompletelecMutation, useGetpurchaselecQuery } from "@/redux/lectureque";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, LockOpen } from "lucide-react"; // assuming you're using these icons
import { useGetProfileQuery } from "@/redux/userauth";

export const Purchaselec = () => {
  const { id: course } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetpurchaselecQuery(course);
  const [completelec, { isLoading: iscompleting }] = useCompletelecMutation();
  const { toast } = useToast();
  const {data:userdata} = useGetProfileQuery();
const user = userdata?.user || [];
  const handlecomplete = async (lectureid) => {
    try {
      await completelec({ courseid: course, lectureid }).unwrap();
      refetch();
    } catch (error) {
      toast({
        title: "Error in completion",
      });
    }
  };

  if (isLoading) return <p>...Loading lecture</p>;
  if (error) return <p>Error in loading: {error.message}</p>;
   console.log("lecturesss",data.lectures)
  return (
    <div>
      <h1 className="text-center p-4 font-extrabold">Lectures</h1>
      <div className="flex p-2 m-2">
      {data?.lectures.map((item) => (
        <div
          key={item._id}
          className={`border-2 p-4 transition-transform transform hover:scale-105 rounded-3xl relative ${
            item.islocked ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <div className="relative">
            {item.vedioUrl?.url?.match(/\.(mp4|webm|ogg|avi|mov|mkv|flv)$/) ? (
              <video src={item.vedioUrl.url} autoPlay controls className="w-full h-48 object-cover" />
            ) : (
              <img
                src={item.vedioUrl?.url}
                alt={item.title}
                className="rounded-lg mb-2 transition-transform transform perspective-1000 rotate-y-0 hover:rotate-y-6 hover:scale-105 shadow-lg"
              />
            )}

            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
              {item.islocked ? <Lock className="text-red-500" /> : <LockOpen className="text-green-600" />}
            </div>
          </div>

          <h1 className="font-bold">{item.title}</h1>
            <Button
                    className="font-bold bg-blue-300 p-2 m-2 rounded-2xl w-xl "
                    onClick={()=>{
                      if(user.role === "creators"){
                        navigate(`/creator/getquize/${item.lecture}`)
                      }
                     else if(user.role === "student"){
                        navigate(`/student/getquize/${item.lecture}`)
                      }
                    }}>Quize</Button>
          <p>
            status:{" "}
            {item.iscomplete ? "complete" : item.islocked ? "Locked" : "not completed"}
          </p>

          {!item.iscomplete && !item.islocked && (
            <Button onClick={() => handlecomplete(item._id)} disabled={iscompleting}>
              {iscompleting ? "Marking..." : "Mark as complete"}
            </Button>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};
