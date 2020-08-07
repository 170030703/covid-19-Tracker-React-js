import React from 'react';
//rfce-react functional component

import './InfoBox.css';

import {Card , CardContent, Typography} from "@material-ui/core";

function InfoBox({title, cases,active, isRed,total, ...props}) {
    return (
        <Card  onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'} `}>
            <CardContent>
               {/* Title */}
               <Typography className="infoBox__title" color="textSecondary">
              {title}
          </Typography>
    
              {/* +25k per day No of Cases */}
                 <h2 className={`info__cases  ${!isRed && 'infoBox__cases--green'}`}>{cases} </h2>

          {/* Total count +1.2M */}
          <Typography className="infoBox__total" color="textSecondary">
              {total} Total
          </Typography>

        


            </CardContent>

        </Card>
        
    )
}

export default InfoBox
