import React, { Children } from 'react';

function AccordionBody(props){
    return(
        <div className="faq--panel-accordion">
            <div className="faq--panel-accordion-container" style={props.style}>
                { props.children }
            </div>
        </div>
    )
}

export default AccordionBody;