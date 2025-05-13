import { useGetallordersQuery } from "@/storertk/razorpayrtk"




export const Getallorders=()=>{
    const {data,isLoading} = useGetallordersQuery();
    const order = data?.purchase;

    if(isLoading){
        return <p>...isloading</p>
    }
    return (
        <div>
            <h1 className="text-center">All orders</h1>
        <div className="flex flex-col items-center gap-6 bg-blue-50">
            {order && (
             order.map((orders)=>(
              <div key={orders._id} className="bg-blue-200 p-2 rounded-2xl mt-2">
              <h1>{orders.userId.username}</h1>
              <h1>{orders.userId.role}</h1>
              <h1>{orders.courseId.courseTitle}</h1>
              <h1>${orders.courseId.coursePrice}</h1>
              <h1>{orders.paymentStatus}</h1>
              <h1>{orders.createdAt}</h1>
              <h1>{orders.transactionId && orders.transactionId}</h1>
              <h1><span className="font-bold">Created By:</span>{orders.courseId.creator.role}</h1>

              </div>  
             ))

            )}
        </div>
        </div>
    )
}