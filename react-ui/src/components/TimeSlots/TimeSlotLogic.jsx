const allButtons = [
  // should default to false in the beginning. Set to true for testing purposes
  "Clock In",
  "Break",
  "Lunch",
  "Clock Out",
  "Return From Break",
  "Return From Lunch",
];

const calculateCurrentActiveButtons = (
  clickedButton = null,
  user = { user_type: "user" }
) => {
  let shownButtons = [];

  // Check if user is admin
  if (user.user_type === "admin") {
    return allButtons;
  }

  switch (clickedButton) {
    case "Clock In":
      shownButtons = ["Clock Out", "Break", "Lunch"];
      break;
    case "Break":
      shownButtons = ["Return From Break"];
      // code block
      break;
    case "Lunch":
      shownButtons = ["Return From Lunch"];
      // code block
      break;
    case "Clock Out":
      shownButtons = ["Clock In"];
      // code block
      break;
    case "Return From Break":
      shownButtons = ["Clock Out", "Break", "Lunch"];
      // code block
      break;
    case "Return From Lunch":
      shownButtons = ["Clock Out", "Break", "Lunch"];
      // code block
      break;
    default:
      // this happens when a user doesnt have a current status yet (first use).
      shownButtons = ["Clock In"];
      break;
  }

  console.log({ shownButtons });
  return shownButtons;
};

export default calculateCurrentActiveButtons;
