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

  // Book interview by updating and adjusting avail spots
  function bookInterview(id, interview) {
    //console.log(id, interview);

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
      availSpots();
      setState({...state, appointments});
    })
  }

  // Delete interview by setting to null and adjust avail spots
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
  
    return axios.delete(url, appointment).then(() => {
      availSpots("increase");
      setState({...state, appointments});
    });
  }

  // Update available spots
  const availSpots = (operation) => {
    const currentDay = state.days.filter(day => day.name === state.day)[0];
    const days = [...state.days];
    if (operation === "incrase") {
      currentDay.spots += 1;
    } else currentDay.spots -= 1;

    const updatedDay = days.map(day => {
      if (day.id === currentDay.id) {
        return { ...currentDay };
      }
      return day;
    });

    setState(prev => ({ ...prev, days: [...updatedDay] }));
  };

  
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }
}