export function getAppointmentsForDay(state, value) {
  const filteredDay = state.days.filter(obj => obj.name === value);
  if(state.days.length === 0 || filteredDay.length === 0) {
    return [];
  }

  // Get apoints for day
  const appointmentsFromDay = filteredDay[0].appointments;
 
  const filteredAppointments = [];
 
  // Add all apointments of day into aray
  for(let appointment of appointmentsFromDay) {
    filteredAppointments.push(state.appointments[appointment]);
  }

  return filteredAppointments;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null
  };

  const filteredInterviews = {};

  filteredInterviews.student = interview.student;

  filteredInterviews.interviewer = state.interviewers[interview.interviewer];

  return filteredInterviews;

}