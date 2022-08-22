import React, { useState, useEffect, useCallback } from "react";
import { Button, Container } from "react-bootstrap";
import { useToken } from "../hooks.js";
import calculateCurrentActiveButtons from "./TimeSlotLogic.jsx";

function TimeSlotSection() {
  // Logic to handle what buttons are shown dpeending on what the current selection is
  const [buttons, setButtons] = useState([]);
  const { token } = useToken();
  const handleClick = (selectedButton) => {
    //make api call to set the current button as current status and add to history
    updateStatus(selectedButton);

    // update UI based on current selection
    // TODO: This could cause the UI and DB to become out of sync. Is the reduction of api call worth it?
    setButtons(calculateCurrentActiveButtons(selectedButton));
  };

  const fetchCurrentStatus = useCallback(() => {
    fetch(`http://localhost:5000/api/current_status?id=${token}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log({ json });
        const currentActiveButtons = calculateCurrentActiveButtons(
          json.timetype
        );
        setButtons(currentActiveButtons);
      })
      .catch((e) => {
        console.log(`API call failed: ${e}`);
      });
  }, [token]);

  const updateStatus = useCallback(
    (selectedButton) => {
      fetch(
        `http://localhost:5000/api/status?id=${token}&status=${selectedButton}`,
        {
          method: "POST",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`status ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          console.log({ json });
          return calculateCurrentActiveButtons(json.timetype);
        })
        .catch((e) => {
          console.log(`API call failed: ${e}`);
        });
    },
    [token]
  );

  useEffect(() => {
    // hit backend and get current status
    fetchCurrentStatus();
  }, [fetchCurrentStatus]);

  console.log(buttons);
  return (
    <Container
      style={{ backgroundColor: "#ffffff", padding: "3em" }}
      className="d-flex flex-column gap-4 p-4"
    >
      <h3>Your Shift</h3>
      <Container className="d-flex flex-column gap-4 p-4">
        {buttons.map((button) => {
          // If button is disabled, dont render
          return (
            <div>
              <Button onClick={() => handleClick(button)} variant="primary">
                {button}
              </Button>
            </div>
          );
        })}
      </Container>
    </Container>
  );
}

export default TimeSlotSection;
