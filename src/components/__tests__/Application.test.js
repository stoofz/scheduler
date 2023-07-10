import React from "react";
import axios from "axios";
import { render, cleanup, waitForElement, fireEvent, getByAltText, getByPlaceholderText, getByText, getAllByTestId, queryByText, queryByAltText, waitForElementToBeRemoved } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  
  /* test number one */
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });


  /* test number two */
  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
    fireEvent.click(getByAltText(appointment, "Add"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
  
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  

/* test number three */
it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {

  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, 'Archie Cohen'));

  const appointment = getAllByTestId(
    container,
    'appointment'
  ).find(appointment => queryByText(appointment, 'Archie Cohen'));

  fireEvent.click(queryByAltText(appointment, 'Delete'));

  expect(
    getByText(appointment, 'Delete the appointment?')
  ).toBeInTheDocument();

  fireEvent.click(queryByText(appointment, 'Confirm'));

  expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

  await waitForElement(() => getByAltText(appointment, 'Add'));

  const day = getAllByTestId(container, 'day').find(day =>
    queryByText(day, 'Monday')
  );

  expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
});

  
/* test number four */
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  
  const { container } = render(<Application />);
    
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );
    
  fireEvent.click(queryByAltText(appointment, "Edit"));
    
  fireEvent.click(queryByText(appointment, "Save"));

  expect(getByText(appointment, "Saving")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Archie Cohen"));
})

  
/* test number five */
  it("shows the save error when failing to save an appointment", async () => {

    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
    target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument();
  });
    
  
/* test number six */ 
it("shows the delete error when failing to delete an existing appointment", async () => {

    axios.delete.mockRejectedValueOnce();
    
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(() => getByText(appointment, "Could not cancel appointment."));
  });
});