import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState(prev => ({ ...prev, day }));
 // const setDays = days => setState(prev => ({ ...prev, days }));

  // useEffect(() => {
  //   axios.get("/api/days").then(response => setDays(response.data));
  // }, []);

  useEffect(()=>{
    const dayURL = "/api/days";
    const appointmentURL = "/api/appointments";
    const interviewersURL = "/api/interviewers";
    Promise.all([
      axios.get(dayURL),
      axios.get(appointmentURL),
      axios.get(interviewersURL)
    ]).then((all) =>{
      setState(prev=>({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data}));
    })
  },[]);


  function bookInterview(id, interview) {
    console.log(id, interview);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const url =`/api/appointments/${id}`;
    return axios.put(url, appointment).then(() => {
      setState({...state, appointments});
    })
  }



  function cancelInterview(id){
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const url =`/api/appointments/${id}`;
  
    return axios.delete(url, appointment).then(()=>{
      setState({...state, appointments});
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}