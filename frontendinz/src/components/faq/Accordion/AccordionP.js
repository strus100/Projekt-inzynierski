import React from 'react';
import parse from 'html-react-parser';

export default ({text}) =>
                <p>{parse(text)}</p>