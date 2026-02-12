"use client"
import { useAuthContext } from "@/app/provider"
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { CircleDollarSign } from "lucide-react";
import { api } from "@/convex/_generated/api";

export const creditsPlans = [
  {
    id: 1,
    credits: 10,
    price: 1,
    priceId: 'price_10credits',
    popular: false
  },
  {
    id: 2,
    credits: 50,
    price: 5,
    priceId: 'price_50credits',
    popular: true,
    savings: '10%'
  },
  {
    id: 3,
    credits: 100,
    price: 9,
    priceId: 'price_100credits',
    popular: false,
    savings: '15%'
  },
  {
    id: 4,
    credits: 200,
    price: 15,
    priceId: 'price_200credits',
    popular: false,
    savings: '25%'
  }
]

function Billing(){
    const{user,setUser} =useAuthContext();
    const updateUserCredits=useMutation(api.users.UpdateUserCredits);
    
    const onPaymentSuccess=async(cost,credits)=>{
        //update user credits
        const result=await updateUserCredits({
          uid:user?._id,
          credits:Number(user?.credits)+Number(credits)
        });
        console.log(result);
        setUser(prev=>({
          ...prev,
          credits:Number(user?.credits)+Number(credits)
          
        }))
    }
    
    return(
        <div>
            <h2  className="font-bold text-3xl">Credits</h2>
            <div className="p-4 border rounded-xl flex justify-between mt-7 max-w-2xl">
               <div>
                <h2 className="font-bold text-xl"> Total Credits Left</h2>
                <h2 className="text-sm"> 1 Credits= 1 Video</h2>
               </div>
               <h2 className="font-bold text-3xl">{user?.credits} Credits</h2>

            </div>
            <p className="text-sm p-5 text-gray-500 max-w-2xl">When your current balance reached to $0 your video generation will stop working. Add Credits balance topped up</p>
            <div className="mt-5">
                <h2 className="font-bold text-2xl"> Buy More Credits</h2>

                <div className="">
                    {creditsPlans.map((plan,index)=>(
                       <div key={index} className="p-5 mt-3 border rounded-xl max-w-2xl">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <CircleDollarSign/>
                                <h2 className="text-xl"><strong>{plan.credits}</strong> Credits</h2>
                            </div>
                            <div className="flex gap-3 items-center">
                                <h2 className="font-medium text-xl">{plan.price}$</h2>
                                <div className="w-32">
                                    <PayPalButtons 
                                        style={{
                                            layout:"horizontal",
                                            color:"gold",
                                            shape:"rect",
                                            label:"paypal",
                                            height:40,
                                            tagline:false
                                        }}
                                        onApprove={()=>onPaymentSuccess(plan?.price,plan?.credits)}
                                        onCancel={()=>alert("Payment Cancelled")}
                                        createOrder={(data,actions)=>{
                                            return actions.order.create({
                                                purchase_units:[
                                                    {
                                                        amount:{
                                                            value:plan.price.toString(),
                                                            currency_code:'USD'
                                                        }
                                                    }
                                                ]
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                       </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Billing