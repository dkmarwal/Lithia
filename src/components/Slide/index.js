import React from 'react';
import {
  Slide,
  Fade
} from '@material-ui/core';

export default function Transition (props) {
    return <Slide direction='down' {...props} timeout={600} >
        <Fade in={true} {...props} timeout={500}></Fade>
        </Slide>;
};