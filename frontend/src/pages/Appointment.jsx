import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
    const {docId} = useParams();
    const {doctors,currencySymbol} = useContext(AppContext);
    const daysOfWeek = ["SUN" , "MON" , "TUE" , "WED", "THU" , 'FRI', 'SAT'];
    const [docInfo,setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime,setSlotTime] = useState("");

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo);
    }

   const getAvailableSlots = async () => {
  // Reset the slots array before calculating new ones
  setDocSlots([]);

  // Store today's date & time based on the system clock
  // This contains year, month, day, hours, minutes, seconds, milliseconds
  let today = new Date();

  // Loop for the next 7 days (including today)
  for (let i = 0; i < 7; i++) {
    
    // Clone today's date to avoid mutating the original `today` object
    // This ensures each iteration works on its own Date instance
    let currentDate = new Date(today);

    // Move the cloned date forward by `i` days
    // JavaScript's Date object automatically rolls over months and years.
    // Example: Sept 30 + 1 day → Oct 1
    currentDate.setDate(today.getDate() + i);

    // Define the day's end time (fixed at 9:00 PM)
    let endTime = new Date();
    endTime.setDate(today.getDate() + i); // Same rollover logic applies here
    endTime.setHours(21, 0, 0, 0); // 21:00:00.000

    // For today's date, start slots based on the current time
    if (today.getDate() === currentDate.getDate()) {
      // If current time is already past 10 AM, start from the next hour
      // Otherwise, start exactly at 10:00 AM
      currentDate.setHours(
        currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
      );

      // If current minutes > 30, start at :30, else start at :00
      // This ensures slots are aligned in half-hour intervals
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
    } 
    else {
      // For future days, start exactly at 10:00 AM
      currentDate.setHours(10);
      currentDate.setMinutes(0);
    }

    // This array will hold all time slots for the current day
    let timeSlots = [];

    // Loop until the current slot time reaches the end time (9 PM)
    while (currentDate < endTime) {
      // Format the slot time into "HH:MM" format
      // The output adapts to user's locale (may include AM/PM or 24-hour format)
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Store slot as an object containing:
      // 1. `datetime`: full date-time object (cloned to avoid mutations later)
      // 2. `time`: formatted human-readable string
      timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime
      });

      // Move to the next 30-minute slot
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    // Append the slots for this day into the main slots array
    // `prev` is the previously stored slots for earlier days in the loop
    setDocSlots(prev => ([...prev, timeSlots]));
  }
}

    useEffect(() => {
        fetchDocInfo();
    },[doctors,docId])

    useEffect(() => {
      getAvailableSlots();
    },[docInfo])

    useEffect(() => {
        console.log(docSlots)
    },[docSlots])


    return docInfo && (
        <div>
           {/* -------------- Doctor Details -------------- */}
           <div className="flex flex-col sm:flex-row gap-4">
            <div>
                <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
            </div>

            <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                {/* -- Doc Info : Name,degree, Experience */}
                <p className="flex items-center gap-2 text-2xl font-medium text-gray-900" >{docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" /></p>
                <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                    <p>{docInfo.degree} - {docInfo.speciality} </p>
                    <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
                </div>

                {/* ----------- Doctor About ------------- */}
                <div>
                    <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3" >About <img src={assets.info_icon} alt="" /></p>
                    <p className="text-sm text-gray-500 max-w-[700px] mt-1 ">{docInfo.about}</p>
                </div>
                <p className="text-gray-500 font-medium mt-4">
                    Appointment Fee : <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
                </p>
            </div>
           </div>

           {/* --------- BOOKING SLOTS */}
           <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                  <p>Booking Slots</p>
                  <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {
                        docSlots.length && docSlots.map((item,index) => (
                            <div onClick={() => setSlotIndex(index)} className={`text-center py-6 w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'} `} key={index}>
                                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))
                    }
                  </div>

                  <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length && docSlots[slotIndex].map((item,index) => (
                        <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time == slotTime ? 'bg-primary text-white' : `text-gray-400 border border-gray-300` }`} key={index}>
                             {item.time.toLowerCase()}
                        </p>
                    )) }
                  </div>

                  <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">Book an appointment</button>
           </div>

           {/* ---------- Listing Related Doctors */}
           <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

        </div>
    )
}

export default Appointment;