import React from "react";

import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {

  const formatSpots = function(spots) {
    if (spots === 0) {
      return "no spots remaining";
    } else if (spots === 1) {
      return "1 spot remaining";
    } else {
      return `${spots} spots remaining`;
    }
  }

  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li data-testid="day" className={dayClass} onClick={() => props.setDay(props.name)}>
        <h2>{props.name}</h2> 
        <h3>{formatSpots(props.spots)}</h3>
    </li>
 

  );
}
