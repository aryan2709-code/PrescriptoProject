import { assets } from "../assets/assets.js";

const Footer = () => {
    return (
        <div className="md:mx-10">
           <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">

            {/* -----Left Section -----------*/}
            <div>
                <img className="mb-5 w-40" src={assets.logo} alt="" />
                <p className="w-full md:w-2/3 text-gray-600 leading-6">© 2025 Prescripto — Making healthcare accessible, one click at a time.
                   This app does not provide medical diagnosis. Please consult a qualified doctor for any medical concerns.
                   For emergencies, call your local emergency helpline.</p>
            </div>

            {/* ----------- Center Section ---------- */}
            <div>
               <p className="text-xl font-medium mb-5">COMPANY</p>
               <ul className="flex flex-col gap-2 text-gray-600">
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
               </ul>
            </div>

            {/* --------- Right Section ------------- */}
            <div>
                <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                <ul className="flex flex-col gap-2 text-gray-600">
                    <li>+1-212-456-7890</li>
                    <li>bhardwaj7a@yahoo.com</li>
                </ul>
            </div>

           </div>
           {/* ------------ Copyright text ---------- */}
           <div>
               <hr />
               <p className="py-5 text-sm text-center">Copyright 2025@ Prescripto - All Rights Reserved.</p>
           </div>
        </div>
    )
}

export default Footer;